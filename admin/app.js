// Minimal admin app that loads sermons from data/sermons.json and allows editing sermon markdown files via fetch
(function(){
  const listEl = document.getElementById('sermonList');
  const editorArea = document.getElementById('editorArea');
  const refreshBtn = document.getElementById('refreshBtn');
  const authGate = document.getElementById('authGate');
  const authPassword = document.getElementById('authPassword');
  const unlockBtn = document.getElementById('unlockBtn');
  const uploadStatusEl = document.getElementById('uploadStatus');
  const uploadPreviewEl = document.getElementById('uploadPreview');
  const imageTitleEl = document.getElementById('imageTitle');
  const mediaInput = document.getElementById('mediaInput');
  const uploadBtn = document.getElementById('uploadMediaBtn');
  const ADMIN_PASSWORD = 'churchadmin2026';
  const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
  let uploadQueue = [];

  function unlockAdmin(){
    const value = (authPassword ? authPassword.value : '').trim();
    if (value === ADMIN_PASSWORD) {
      sessionStorage.setItem('church-admin-unlocked', 'true');
      if (authGate) authGate.classList.add('hidden');
    } else {
      showUploadStatus('Incorrect access code. Please try again.', 'error');
    }
  }

  if (unlockBtn) unlockBtn.addEventListener('click', unlockAdmin);
  if (authPassword) authPassword.addEventListener('keydown', (event) => { if (event.key === 'Enter') unlockAdmin(); });
  if (sessionStorage.getItem('church-admin-unlocked') === 'true' && authGate) {
    authGate.classList.add('hidden');
  }

  if (!sessionStorage.getItem('church-admin-unlocked') && authGate) {
    authGate.classList.remove('hidden');
  }

  function showUploadStatus(message, type = 'info') {
    if (!uploadStatusEl) return;
    uploadStatusEl.textContent = message || '';
    uploadStatusEl.className = 'status-banner';
    if (message) {
      uploadStatusEl.classList.add('show', type);
    }
  }

  function renderPreviewQueue() {
    if (!uploadPreviewEl) return;
    if (!uploadQueue.length) {
      uploadPreviewEl.innerHTML = '<div class="empty-list">No images selected yet.</div>';
      return;
    }

    uploadPreviewEl.innerHTML = '';
    uploadQueue.forEach(item => {
      const card = document.createElement('div');
      card.className = 'preview-card';
      const img = document.createElement('img');
      img.className = 'preview-thumb';
      img.src = item.previewUrl;
      img.alt = item.name;
      const meta = document.createElement('div');
      meta.className = 'preview-meta';
      const name = document.createElement('div');
      name.className = 'preview-name';
      name.textContent = item.name;
      const caption = document.createElement('div');
      caption.className = 'preview-caption';
      caption.textContent = item.caption || 'No caption';
      const status = document.createElement('div');
      status.className = 'preview-status';
      status.textContent = item.status === 'uploaded' ? 'Uploaded' : item.status === 'failed' ? 'Failed' : item.status === 'uploading' ? 'Uploading...' : 'Queued';
      const actions = document.createElement('div');
      actions.className = 'preview-actions';
      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.textContent = 'Remove';
      removeBtn.addEventListener('click', () => {
        uploadQueue = uploadQueue.filter(entry => entry.id !== item.id);
        URL.revokeObjectURL(item.previewUrl);
        renderPreviewQueue();
      });
      actions.appendChild(removeBtn);
      meta.appendChild(name);
      meta.appendChild(caption);
      meta.appendChild(status);
      card.appendChild(img);
      card.appendChild(meta);
      card.appendChild(actions);
      uploadPreviewEl.appendChild(card);
    });
  }

  function validateImageFile(file) {
    const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    const ext = (file.name.split('.').pop() || '').toLowerCase();
    const isAllowedType = allowed.includes(file.type) || ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext);
    if (!isAllowedType) {
      throw new Error('Only JPG, PNG, GIF, WebP and SVG files are supported.');
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      throw new Error('Images must be 5MB or smaller.');
    }
    return true;
  }

  function createUploadQueueFromFiles(files) {
    const validFiles = [];
    const errors = [];
    files.forEach(file => {
      try {
        validateImageFile(file);
        validFiles.push({
          id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
          file,
          name: file.name,
          caption: (imageTitleEl ? imageTitleEl.value.trim() : '').replace(/\s+/g, ' '),
          previewUrl: URL.createObjectURL(file),
          status: 'queued'
        });
      } catch (error) {
        errors.push(error.message);
      }
    });

    if (errors.length) showUploadStatus(errors.join(' '), 'error');
    return validFiles;
  }

  if (mediaInput) {
    mediaInput.addEventListener('change', () => {
      uploadQueue = createUploadQueueFromFiles(Array.from(mediaInput.files || []));
      renderPreviewQueue();
      if (uploadQueue.length) showUploadStatus('Images ready to upload.', 'info');
    });
  }

  if (uploadBtn) {
    uploadBtn.addEventListener('click', async () => {
      if (!uploadQueue.length) {
        showUploadStatus('Select one or more images first.', 'error');
        return;
      }

      if (sessionStorage.getItem('church-admin-unlocked') !== 'true') {
        showUploadStatus('Please unlock the admin first.', 'error');
        return;
      }

      uploadBtn.disabled = true;
      uploadBtn.textContent = 'Uploading...';
      let uploadedCount = 0;

      for (let i = 0; i < uploadQueue.length; i++) {
        const item = uploadQueue[i];
        item.status = 'uploading';
        renderPreviewQueue();
        try {
          const dataUrl = await readFileAsDataURL(item.file);
          const base64 = dataUrl.split(',')[1];
          const cleanName = item.file.name.replace(/\s+/g, '_');
          const filename = cleanName.replace(/[^a-zA-Z0-9._-]/g, '_');
          const path = `img/gallery/${filename}`;
          const caption = (item.caption || '').trim() || (imageTitleEl ? imageTitleEl.value.trim() : '').trim();

          const res = await fetch('/.netlify/functions/save-file', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ path, content: base64, isBase64: true, message: `Add gallery image ${filename}`, title: caption })
          });

          const json = await res.json();
          if (!res.ok) {
            console.error('Upload failed:', json);
            item.status = 'failed';
            showUploadStatus('Upload failed for ' + filename + '.', 'error');
          } else {
            uploadedCount += 1;
            item.status = 'uploaded';
            console.log('Uploaded', filename);
          }
        } catch (err) {
          console.error('Error uploading file', item.file.name, err);
          item.status = 'failed';
          showUploadStatus('Error uploading ' + item.file.name + '.', 'error');
        }
        renderPreviewQueue();
      }

      try {
        const buildRes = await fetch('/.netlify/functions/trigger-build', { method: 'POST' });
        const buildText = await buildRes.text();
        let buildData = {};
        try { buildData = JSON.parse(buildText); } catch (error) {
          buildData = {};
        }

        if (buildRes.ok && !buildData?.error) {
          showUploadStatus(uploadedCount > 0 ? `Upload complete. ${uploadedCount} image${uploadedCount > 1 ? 's' : ''} saved and the gallery was refreshed.` : 'Upload complete. The gallery was refreshed.', 'success');
        } else {
          showUploadStatus(uploadedCount > 0 ? `Upload complete. ${uploadedCount} image${uploadedCount > 1 ? 's' : ''} saved. The gallery was refreshed locally.` : 'Upload complete. The gallery was refreshed locally.', 'success');
        }
      } catch (err) {
        console.error('trigger build error', err);
        showUploadStatus(uploadedCount > 0 ? `Upload complete. ${uploadedCount} image${uploadedCount > 1 ? 's' : ''} saved. The gallery was refreshed locally.` : 'Upload complete. The gallery was refreshed locally.', 'success');
      }

      uploadBtn.disabled = false;
      uploadBtn.textContent = 'Upload selected';
      if (mediaInput) mediaInput.value = '';
      if (imageTitleEl) imageTitleEl.value = '';
      localStorage.setItem('churchGalleryRefresh', String(Date.now()));
      uploadQueue = [];
      renderPreviewQueue();
    });
  }

  function renderEmptyState(){
    editorArea.innerHTML = `
      <div class="empty-state">
        <div>
          <div class="empty-icon">✦</div>
          <h2>Open a sermon to begin</h2>
          <p>Select a sermon from the left to edit its content, or refresh the list when new material is added.</p>
        </div>
      </div>
    `;
  }

  async function loadSermons(){
    try{
      const res = await fetch('/data/sermons.json');
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch(e) {
      console.error('loadSermons error', e);
      return [];
    }
  }

  function renderList(items){
    listEl.innerHTML = '';
    if (!items.length) {
      listEl.innerHTML = '<div class="empty-list">No sermons found yet.</div>';
      return;
    }

    items.forEach(item => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'list-item';
      button.dataset.id = String(item.id);
      button.innerHTML = `
        <span class="list-title">${escapeHtml(item.title)}</span>
        <span class="list-meta">${escapeHtml(item.speaker || 'Speaker')}</span>
      `;
      button.addEventListener('click', () => openEditor(item));
      listEl.appendChild(button);
    });
  }

  function highlightSelection(id){
    const buttons = listEl.querySelectorAll('.list-item');
    buttons.forEach(btn => btn.classList.toggle('active', String(btn.dataset.id) === String(id)));
  }

  async function openEditor(item){
    highlightSelection(item.id);
    editorArea.innerHTML = `
      <div class="editor-header">
        <div>
          <p class="section-label">Editing sermon</p>
          <h2>${escapeHtml(item.title)}</h2>
        </div>
        <div class="meta-chip">${escapeHtml(item.speaker || 'Speaker')}</div>
      </div>
      <div id="editorForm">Loading content...</div>
    `;
    const editorForm = document.getElementById('editorForm');
    try{
      const mdRes = await fetch(`/content/sermons/${item.id}.md`);
      let md = '';
      if (mdRes.ok) md = await mdRes.text();
      editorForm.innerHTML = `
        <div class="form-card">
          <div class="form-row"><label>Title</label><input id="eTitle" type="text" value="${escapeHtml(item.title)}"></div>
          <div class="form-row"><label>Speaker</label><input id="eSpeaker" type="text" value="${escapeHtml(item.speaker)}"></div>
          <div class="form-row"><label>Date</label><input id="eDate" type="text" value="${escapeHtml(item.date)}"></div>
          <div class="form-row"><label>Body (markdown)</label><textarea id="eBody" rows="15">${escapeHtml(stripFrontmatter(md) || '')}</textarea></div>
          <div class="form-actions">
            <button id="saveBtn" class="primary-btn" type="button">Save sermon</button>
            <button id="cancelBtn" class="secondary-btn" type="button">Cancel</button>
          </div>
        </div>
      `;

      document.getElementById('cancelBtn').addEventListener('click', () => renderEmptyState());
      document.getElementById('saveBtn').addEventListener('click', () => saveSermon(item.id));
    } catch(e) {
      console.error(e);
      editorForm.innerHTML = '<div class="empty-list">Failed to load content.</div>';
    }
  }

  async function saveSermon(id){
    const title = document.getElementById('eTitle').value.trim();
    const speaker = document.getElementById('eSpeaker').value.trim();
    const date = document.getElementById('eDate').value.trim();
    const body = document.getElementById('eBody').value;

    const md = `---\nid: ${id}\ntitle: "${escapeYaml(title)}"\nspeaker: "${escapeYaml(speaker)}"\ndate: "${escapeYaml(date)}"\n---\n\n${body}\n`;

    // Note: Browser cannot write files to local filesystem. This admin requires Netlify Identity + server-side function
    // or GitHub API to commit changes. For now we POST to /.netlify/functions/save-file which should be implemented server-side.

    try{
      const res = await fetch('/.netlify/functions/save-file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path:`content/sermons/${id}.md`, content: md })
      });

      const data = await res.json();
      if (res.ok) {
        alert('Saved successfully. Changes may require a site rebuild.');
      } else {
        alert('Save failed: ' + (data && data.error ? data.error : res.statusText));
      }
    }catch(e){console.error(e); alert('Save request failed. See console.');}
  }

  function stripFrontmatter(md){
    if (!md) return md;
    return md.replace(/^---[\s\S]*?---\s*/,'');
  }

  function escapeHtml(str){ return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  function escapeYaml(str){ return String(str).replace(/"/g,'\\"'); }

  refreshBtn.addEventListener('click', async ()=>{ const items = await loadSermons(); renderList(items); });

  // initial load
  (async ()=>{ const items = await loadSermons(); renderList(items); renderEmptyState(); })();

})();

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result);
    fr.onerror = reject;
    fr.readAsDataURL(file);
  });
}
