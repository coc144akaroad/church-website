// Minimal admin app that loads sermons from data/sermons.json and allows editing sermon markdown files via fetch
(function(){
  const listEl = document.getElementById('sermonList');
  const editorArea = document.getElementById('editorArea');
  const refreshBtn = document.getElementById('refreshBtn');

  async function loadSermons(){
    try{
      const res = await fetch('/data/sermons.json');
      const data = await res.json();
      return Array.isArray(data)?data:[];
    }catch(e){console.error('loadSermons error',e);return[]}
  }

  function renderList(items){
    listEl.innerHTML='';
    items.forEach(item=>{
      const div = document.createElement('div');
      div.className='list-item';
      div.textContent = `${item.id} — ${item.title}`;
      div.addEventListener('click', ()=>openEditor(item));
      listEl.appendChild(div);
    });
  }

  async function openEditor(item){
    editorArea.innerHTML = `<h2>Editing: ${item.title}</h2><div id="editorForm">Loading content...</div>`;
    const editorForm = document.getElementById('editorForm');
    try{
      const mdRes = await fetch(`/content/sermons/${item.id}.md`);
      let md = '';
      if (mdRes.ok) md = await mdRes.text();
      editorForm.innerHTML = `
        <div class="form-row"><label>Title</label><input id="eTitle" type="text" value="${escapeHtml(item.title)}"></div>
        <div class="form-row"><label>Speaker</label><input id="eSpeaker" type="text" value="${escapeHtml(item.speaker)}"></div>
        <div class="form-row"><label>Date</label><input id="eDate" type="text" value="${escapeHtml(item.date)}"></div>
        <div class="form-row"><label>Body (markdown)</label><textarea id="eBody" rows="15">${escapeHtml(stripFrontmatter(md) || '')}</textarea></div>
        <div class="form-row"><button id="saveBtn">Save</button><button id="cancelBtn" class="secondary">Cancel</button></div>
      `;

      document.getElementById('cancelBtn').addEventListener('click', ()=>{ editorArea.innerHTML = '<p>Select a sermon to edit or refresh the list.</p>'; });
      document.getElementById('saveBtn').addEventListener('click', ()=>saveSermon(item.id));
    }catch(e){console.error(e); editorForm.textContent = 'Failed to load content.'}
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
  function escapeYaml(str){ return String(str).replace(/"/g,'\"'); }

  refreshBtn.addEventListener('click', async ()=>{ const items = await loadSermons(); renderList(items); });

  // initial load
  (async ()=>{ const items = await loadSermons(); renderList(items); })();

})();
