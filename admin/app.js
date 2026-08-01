// Admin app that loads sermons from data/sermons.json and manages gallery images through a reusable widget.
(function(){
  const listEl = document.getElementById('sermonList');
  const editorArea = document.getElementById('editorArea');
  const refreshBtn = document.getElementById('refreshBtn');
  const authGate = document.getElementById('authGate');
  const authPassword = document.getElementById('authPassword');
  const unlockBtn = document.getElementById('unlockBtn');
  const imageManagerRoot = document.getElementById('imageManagerRoot');
  const ADMIN_PASSWORD = 'churchadmin2026';
  const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
  const GALLERY_STORAGE_KEY = 'church-gallery-local-images';
  const GALLERY_REFRESH_STORAGE_KEY = 'churchGalleryRefresh';
  let galleryImages = [];
  let pendingUploads = [];

  function unlockAdmin(){
    const value = (authPassword ? authPassword.value : '').trim();
    if (value === ADMIN_PASSWORD) {
      sessionStorage.setItem('church-admin-unlocked', 'true');
      if (authGate) authGate.classList.add('hidden');
      showToast('Admin unlocked. You can now manage images.', 'success');
    } else {
      showToast('Incorrect access code. Please try again.', 'error');
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

  function showToast(message, type = 'info', timeout = 3200) {
    let stack = document.getElementById('adminToastStack');
    if (!stack) {
      stack = document.createElement('div');
      stack.id = 'adminToastStack';
      stack.className = 'toast-stack';
      document.body.appendChild(stack);
    }
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    stack.appendChild(toast);
    window.setTimeout(() => toast.remove(), timeout);
  }

  function setImageStatus(message, type = 'info') {
    if (!imageManagerRoot) return;
    const statusEl = imageManagerRoot.querySelector('[data-role="status"]');
    if (!statusEl) return;
    statusEl.textContent = message || '';
    statusEl.className = 'status-banner';
    if (message) {
      statusEl.classList.add('show', type);
    }
  }

  function validateImageFile(file) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
    const ext = (file.name.split('.').pop() || '').toLowerCase();
    const isAllowedType = allowedTypes.includes((file.type || '').toLowerCase()) || ['jpg', 'jpeg', 'png', 'webp', 'svg'].includes(ext);
    if (!isAllowedType) {
      throw new Error('Only JPG, JPEG, PNG, WEBP, and SVG files are supported.');
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      throw new Error('Images must be 5MB or smaller.');
    }
    return true;
  }

  function queuePendingUploads(files, mode = 'new', existingImage = null) {
    const validFiles = [];
    const errors = [];
    files.forEach(file => {
      try {
        validateImageFile(file);
        validFiles.push({
          id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
          file,
          name: file.name,
          previewUrl: URL.createObjectURL(file),
          status: 'queued',
          mode,
          existingImage
        });
      } catch (error) {
        errors.push(error.message);
      }
    });

    if (errors.length) {
      showToast(errors.join(' '), 'error');
    }

    pendingUploads = pendingUploads.concat(validFiles);
    renderPendingUploads();
    if (validFiles.length) {
      setImageStatus(validFiles.length > 1 ? `${validFiles.length} images queued for upload.` : 'Image queued for upload.', 'info');
    }
  }

  function renderPendingUploads() {
    if (!imageManagerRoot) return;
    const listEl = imageManagerRoot.querySelector('[data-role="pending-list"]');
    if (!listEl) return;
    if (!pendingUploads.length) {
      listEl.innerHTML = '<div class="empty-list">No pending changes.</div>';
      return;
    }
    listEl.innerHTML = '';
    pendingUploads.forEach(item => {
      const card = document.createElement('div');
      card.className = 'preview-card';
      card.innerHTML = `
        <img class="preview-thumb" src="${item.previewUrl}" alt="${escapeHtml(item.name)}" />
        <div class="preview-meta">
          <div class="preview-name">${escapeHtml(item.name)}</div>
          <div class="preview-caption">${item.mode === 'replace' ? 'Replacement pending' : 'New upload pending'}</div>
          <div class="preview-status">${item.status === 'uploading' ? 'Uploading...' : item.status === 'uploaded' ? 'Uploaded' : item.status === 'failed' ? 'Failed' : 'Queued'}</div>
        </div>
        <div class="preview-actions">
          <button type="button" data-remove="${item.id}">Remove</button>
        </div>
      `;
      card.querySelector('button').addEventListener('click', () => {
        pendingUploads = pendingUploads.filter(entry => entry.id !== item.id);
        URL.revokeObjectURL(item.previewUrl);
        renderPendingUploads();
      });
      listEl.appendChild(card);
    });
  }

  function loadLocalGalleryEntries() {
    try {
      const raw = localStorage.getItem(GALLERY_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (error) {
      console.warn('Unable to read local gallery images', error);
      return [];
    }
  }

  function saveLocalGalleryEntries(entries) {
    try {
      localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(entries));
    } catch (error) {
      console.warn('Unable to save local gallery images', error);
    }
  }

  function normalizeGalleryEntry(item, fallbackId = 'gallery-item') {
    if (typeof item === 'string') {
      return { id: fallbackId, title: item.split('/').pop(), src: item, path: item, local: false, source: 'manifest' };
    }
    return {
      id: item.id || `${fallbackId}-${String(item.src || item.title || 'item')}`,
      title: item.title || item.name || 'Gallery image',
      src: item.src || item.url || '',
      path: item.path || item.src || item.url || '',
      local: Boolean(item.local),
      replaceTarget: item.replaceTarget || null,
      modifiedAt: item.modifiedAt || item.updatedAt || null,
      source: item.source || (item.local ? 'local' : 'manifest')
    };
  }

  async function persistGalleryImage(item) {
    const fileName = item.file.name;
    const baseName = fileName.split('.')[0].replace(/[-_]+/g, ' ');
    const payload = {
      action: item.mode === 'replace' ? 'replace' : 'upload',
      fileName,
      content: await readFileAsDataURL(item.file),
      isBase64: true,
      mimeType: item.file.type || 'image/jpeg',
      title: baseName,
      currentPath: item.existingImage ? (item.existingImage.path || item.existingImage.src || item.existingImage.title || '') : '',
      targetPath: item.existingImage ? (item.existingImage.path || item.existingImage.src || item.existingImage.title || '') : ''
    };

    const endpoints = [resolveSiteUrl('/api/image-management'), resolveSiteUrl('/.netlify/functions/image-management')];

    try {
      let response;
      let data = {};
      let lastError;

      for (const endpoint of endpoints) {
        try {
          response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          data = await response.json().catch(() => ({}));
          if (response.ok) {
            return data;
          }
          lastError = new Error(data && data.error ? data.error : 'Unable to save image.');
        } catch (error) {
          lastError = error;
        }
      }

      throw lastError || new Error('Unable to save image.');
    } catch (error) {
      console.warn('Image management endpoint unavailable, using local gallery fallback.', error);
      return {
        ok: true,
        path: `local:${fileName}`,
        title: baseName,
        image: {
          title: baseName,
          path: `local:${fileName}`,
          url: payload.content,
          modifiedAt: new Date().toISOString()
        }
      };
    }
  }

  async function savePendingUploads() {
    if (!pendingUploads.length) {
      showToast('Add or replace an image first.', 'info');
      return;
    }

    if (sessionStorage.getItem('church-admin-unlocked') !== 'true') {
      showToast('Please unlock the admin first.', 'error');
      return;
    }

    const saveButton = imageManagerRoot.querySelector('[data-role="save"]');
    if (saveButton) {
      saveButton.disabled = true;
      saveButton.textContent = 'Saving...';
    }

    const localEntries = loadLocalGalleryEntries();
    let uploadedCount = 0;

    for (let index = 0; index < pendingUploads.length; index += 1) {
      const item = pendingUploads[index];
      item.status = 'uploading';
      renderPendingUploads();
      try {
        const savedEntry = await persistGalleryImage(item);
        const nextEntry = {
          id: `local-${Date.now()}-${index}`,
          title: savedEntry.title || item.file.name.split('.')[0].replace(/[-_]+/g, ' '),
          src: savedEntry.image && savedEntry.image.url ? savedEntry.image.url : savedEntry.path || '',
          path: savedEntry.path || '',
          local: true,
          modifiedAt: savedEntry.image && savedEntry.image.modifiedAt ? savedEntry.image.modifiedAt : new Date().toISOString(),
          replaceTarget: item.mode === 'replace' && item.existingImage ? (item.existingImage.id || item.existingImage.path || item.existingImage.src || item.existingImage.title) : null,
          source: 'local'
        };

        if (item.mode === 'replace' && item.existingImage) {
          const existingIndex = localEntries.findIndex(entry => entry.id === nextEntry.replaceTarget || entry.replaceTarget === nextEntry.replaceTarget || entry.path === nextEntry.replaceTarget || entry.src === nextEntry.replaceTarget || entry.path === item.existingImage?.path || entry.src === item.existingImage?.src);
          if (existingIndex >= 0) {
            localEntries[existingIndex] = nextEntry;
          } else {
            localEntries.push(nextEntry);
          }
        } else {
          localEntries.push(nextEntry);
        }

        saveLocalGalleryEntries(localEntries);
        uploadedCount += 1;
        item.status = 'uploaded';
      } catch (error) {
        console.error('Image upload failed', error);
        item.status = 'failed';
        showToast(`Could not save ${item.name}: ${error.message}`, 'error');
      }
      renderPendingUploads();
    }

    window.localStorage.setItem(GALLERY_REFRESH_STORAGE_KEY, String(Date.now()));
    window.dispatchEvent(new Event('gallery:refresh'));
    await refreshGalleryImages();
    pendingUploads.forEach(item => URL.revokeObjectURL(item.previewUrl));
    pendingUploads = [];
    renderPendingUploads();
    setImageStatus(uploadedCount > 0 ? `${uploadedCount} image${uploadedCount > 1 ? 's' : ''} saved.` : 'No changes were saved.', uploadedCount > 0 ? 'success' : 'info');
    showToast(uploadedCount > 0 ? 'Image changes saved. Open the gallery page to view them.' : 'No images were updated.', uploadedCount > 0 ? 'success' : 'info');
    if (saveButton) {
      saveButton.disabled = false;
      saveButton.textContent = 'Save changes';
    }
  }

  async function deleteImage(image) {
    if (!window.confirm(`Delete ${image.title || image.name}? This will remove it from the gallery list for this admin session.`)) {
      return;
    }

    try {
      const localEntries = loadLocalGalleryEntries().filter(entry => {
        const target = image.id || image.path || image.src || image.title;
        return entry.id !== target && entry.replaceTarget !== target && entry.path !== target && entry.src !== target;
      });
      saveLocalGalleryEntries(localEntries);
      await refreshGalleryImages();
      showToast('Image removed from the gallery list.', 'success');
    } catch (error) {
      console.error('Image delete failed', error);
      showToast(`Unable to delete image: ${error.message}`, 'error');
    }
  }

  function attachImageManagerEvents(root) {
    const browseButton = root.querySelector('[data-role="browse"]');
    const input = root.querySelector('[data-role="file-input"]');
    const saveButton = root.querySelector('[data-role="save"]');
    const clearButton = root.querySelector('[data-role="clear"]');
    const openGalleryButton = root.querySelector('[data-role="open-gallery"]');
    const dropzone = root.querySelector('[data-role="dropzone"]');

    browseButton?.addEventListener('click', () => input?.click());
    input?.addEventListener('change', () => {
      const files = Array.from(input.files || []);
      if (files.length) {
        queuePendingUploads(files, 'new');
      }
      input.value = '';
    });
    clearButton?.addEventListener('click', () => {
      pendingUploads.forEach(item => URL.revokeObjectURL(item.previewUrl));
      pendingUploads = [];
      renderPendingUploads();
      setImageStatus('Pending changes cleared.', 'info');
    });
    openGalleryButton?.addEventListener('click', () => {
      window.open('../gallery.html', '_blank', 'noopener,noreferrer');
    });
    saveButton?.addEventListener('click', savePendingUploads);

    ['dragenter', 'dragover'].forEach(eventName => {
      dropzone?.addEventListener(eventName, (event) => {
        event.preventDefault();
        dropzone.classList.add('dragover');
      });
    });
    ['dragleave', 'drop'].forEach(eventName => {
      dropzone?.addEventListener(eventName, (event) => {
        event.preventDefault();
        dropzone.classList.remove('dragover');
      });
    });
    dropzone?.addEventListener('drop', (event) => {
      const files = Array.from(event.dataTransfer?.files || []);
      if (files.length) {
        queuePendingUploads(files, 'new');
      }
    });
  }

  function renderImageManager() {
    if (!imageManagerRoot) return;
    imageManagerRoot.innerHTML = `
      <div class="dropzone" data-role="dropzone">
        <div class="dropzone-title">Drop new images here</div>
        <div class="dropzone-subtitle">JPG, JPEG, PNG, WEBP, and SVG up to 5MB.</div>
        <input class="hidden" type="file" data-role="file-input" accept=".jpg,.jpeg,.png,.webp,.svg,image/jpeg,image/png,image/webp,image/svg+xml" multiple />
        <button class="secondary-btn" type="button" data-role="browse">Choose files</button>
      </div>
      <div class="form-actions">
        <button class="primary-btn" type="button" data-role="save">Save changes</button>
        <button class="ghost-btn" type="button" data-role="clear">Clear queue</button>
        <button class="secondary-btn" type="button" data-role="open-gallery">Open gallery page</button>
      </div>
      <div class="status-banner" data-role="status" role="status"></div>
      <div class="preview-grid" data-role="pending-list"></div>
      <div class="image-list" data-role="gallery-list"></div>
    `;
    attachImageManagerEvents(imageManagerRoot);
    renderPendingUploads();
    renderGalleryImages();
  }

  function renderGalleryImages() {
    if (!imageManagerRoot) return;
    const galleryList = imageManagerRoot.querySelector('[data-role="gallery-list"]');
    if (!galleryList) return;
    if (!galleryImages.length) {
      galleryList.innerHTML = '<div class="empty-list">No gallery images yet.</div>';
      return;
    }
    galleryList.innerHTML = '';
    galleryImages.forEach(image => {
      const card = document.createElement('div');
      card.className = 'image-card';
      const imageLabel = image.title || image.name || 'Gallery image';
      const imageSrc = image.src || image.url || '';
      card.innerHTML = `
        <img src="${imageSrc}" alt="${escapeHtml(imageLabel)}" />
        <div class="image-card-meta">
          <div class="preview-name">${escapeHtml(imageLabel)}</div>
          <div class="preview-caption">${escapeHtml(image.title || 'Gallery image')}</div>
          <div class="preview-status">${image.modifiedAt ? new Date(image.modifiedAt).toLocaleString() : 'Recently added'}</div>
        </div>
        <div class="image-card-actions">
          <button class="replace-btn" type="button" data-action="replace">Replace</button>
          <button class="delete-btn" type="button" data-action="delete">Delete</button>
        </div>
      `;
      const replaceButton = card.querySelector('[data-action="replace"]');
      const deleteButton = card.querySelector('[data-action="delete"]');
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = '.jpg,.jpeg,.png,.webp,.svg,image/jpeg,image/png,image/webp,image/svg+xml';
      fileInput.className = 'hidden';
      fileInput.addEventListener('change', () => {
        const files = Array.from(fileInput.files || []);
        if (files.length) {
          queuePendingUploads(files, 'replace', image);
        }
        fileInput.value = '';
      });
      replaceButton.addEventListener('click', () => fileInput.click());
      deleteButton.addEventListener('click', () => deleteImage(image));
      card.appendChild(fileInput);
      galleryList.appendChild(card);
    });
  }

  async function refreshGalleryImages() {
    try {
      let baseEntries = [];
      try {
        const response = await fetch('../img/gallery/gallery.json', { cache: 'no-cache' });
        if (response.ok) {
          const data = await response.json().catch(() => []);
          baseEntries = Array.isArray(data) ? data.map((item, index) => normalizeGalleryEntry(item, `base-${index}`)) : [];
        }
      } catch (error) {
        console.warn('Unable to load gallery manifest', error);
      }

      const localEntries = loadLocalGalleryEntries().map((entry, index) => normalizeGalleryEntry(entry, `local-${index}`));
      const merged = [];
      const seen = new Set();

      baseEntries.forEach((item, index) => {
        const override = localEntries.find(entry => entry.replaceTarget && (entry.replaceTarget === item.id || entry.replaceTarget === item.path || entry.replaceTarget === item.src || entry.replaceTarget === item.title));
        const resolved = override ? { ...item, ...override, id: item.id, title: override.title || item.title, src: override.src || item.src, path: override.path || item.path, local: true, source: 'local' } : item;
        const key = resolved.src || resolved.title || `${index}`;
        if (!seen.has(key)) {
          seen.add(key);
          merged.push(resolved);
        }
      });

      localEntries.filter(entry => !entry.replaceTarget).forEach((entry) => {
        const key = entry.src || entry.title;
        if (!seen.has(key)) {
          seen.add(key);
          merged.push(entry);
        }
      });

      galleryImages = merged;
      renderGalleryImages();
    } catch (error) {
      console.error('Unable to refresh gallery images', error);
      showToast('Gallery refresh is unavailable right now. Please refresh the page and try again.', 'error');
    }
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
      const res = await fetch(resolveSiteUrl('/data/sermons.json'));
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
      const mdRes = await fetch(resolveSiteUrl(`/content/sermons/${item.id}.md`));
      let md = '';
      if (mdRes.ok) md = await mdRes.text();
      editorForm.innerHTML = `
        <div class="form-card">
          <div class="form-row"><label>Title</label><input id="eTitle" type="text" value="${escapeHtml(item.title)}"></div>
          <div class="form-row"><label>Speaker</label><input id="eSpeaker" type="text" value="${escapeHtml(item.speaker)}"></div>
          <div class="form-row"><label>Date</label><input id="eDate" type="text" value="${escapeHtml(item.date)}"></div>
          <div class="form-row">
            <label>Body</label>
            <textarea id="eBody" rows="15" placeholder="Type the sermon content here. You can use plain paragraphs and line breaks.">${escapeHtml(stripFrontmatter(md) || '')}</textarea>
            <div class="preview-caption" style="margin-top: 6px;">Simple text editor — no Markdown required.</div>
          </div>
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
    const body = normalizeBodyText(document.getElementById('eBody').value);

    const md = `---\nid: ${id}\ntitle: "${escapeYaml(title)}"\nspeaker: "${escapeYaml(speaker)}"\ndate: "${escapeYaml(date)}"\n---\n\n${body}\n`;

    try {
      if (window.location.protocol === 'file:') {
        const filePath = `content/sermons/${id}.md`;
        const result = await fetch(resolveSiteUrl('/api/save-file'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path: filePath, content: md })
        });
        const data = await result.json().catch(() => ({}));
        if (result.ok) {
          showToast('Sermon saved successfully.', 'success');
        } else {
          showToast('Save failed: ' + (data && data.error ? data.error : result.statusText), 'error');
        }
        return;
      }

      const endpoints = [resolveSiteUrl('/api/save-file'), resolveSiteUrl('/.netlify/functions/save-file')];
      let res;
      let data = {};
      let lastError;

      for (const endpoint of endpoints) {
        try {
          res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ path:`content/sermons/${id}.md`, content: md })
          });
          data = await res.json().catch(() => ({}));
          if (res.ok) {
            break;
          }
          lastError = new Error(data && data.error ? data.error : res.statusText);
        } catch (error) {
          lastError = error;
        }
      }

      if (res && res.ok) {
        showToast('Sermon saved successfully.', 'success');
      } else {
        showToast('Save failed: ' + (data && data.error ? data.error : (lastError ? lastError.message : 'Unknown error')), 'error');
      }
    } catch(e) {
      console.error(e);
      showToast('Save request failed. See console.', 'error');
    }
  }

  function stripFrontmatter(md){
    if (!md) return md;
    return md.replace(/^---[\s\S]*?---\s*/,'');
  }

  function escapeHtml(str){ return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  function escapeYaml(str){ return String(str).replace(/"/g,'\\"'); }
  function normalizeBodyText(value){
    return String(value || '').replace(/\r\n?/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
  }
  function resolveSiteUrl(pathname) {
    if (!pathname || typeof pathname !== 'string') return pathname;
    const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`;
    if (window.location.protocol === 'file:') {
      return `http://localhost:3000${normalized}`;
    }
    return normalized;
  }
  refreshBtn.addEventListener('click', async ()=>{ const items = await loadSermons(); renderList(items); });

  (async ()=>{ const items = await loadSermons(); renderList(items); renderEmptyState(); renderImageManager(); await refreshGalleryImages(); })();

})();

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result);
    fr.onerror = reject;
    fr.readAsDataURL(file);
  });
}
