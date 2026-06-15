/* ── Theme ── */
const ThemeKey = 'rhudesi_theme';
function applyTheme(t){
  document.documentElement.setAttribute('data-theme', t);
  const btn = document.getElementById('themeBtn');
  if(btn) btn.textContent = t === 'light' ? '🌙' : '☀️';
  localStorage.setItem(ThemeKey, t);
  document.body.style.background = t === 'light' ? '#f4f4f5' : '';
  if(t === 'light'){
    document.documentElement.style.setProperty('--bg','#f4f4f5');
    document.documentElement.style.setProperty('--bg-surface','#ffffff');
    document.documentElement.style.setProperty('--bg-elevated','#f0f0f3');
    document.documentElement.style.setProperty('--bg-hover','#e8e8ec');
    document.documentElement.style.setProperty('--bg-active','#dfdfe4');
    document.documentElement.style.setProperty('--border','rgba(0,0,0,0.08)');
    document.documentElement.style.setProperty('--border-strong','rgba(0,0,0,0.14)');
    document.documentElement.style.setProperty('--text','#111113');
    document.documentElement.style.setProperty('--text-2','#52525b');
    document.documentElement.style.setProperty('--text-muted','#a1a1aa');
    document.documentElement.style.setProperty('--shadow','0 2px 12px rgba(0,0,0,0.08)');
    document.documentElement.style.setProperty('--shadow-lg','0 8px 32px rgba(0,0,0,0.12)');
  } else {
    document.documentElement.style.setProperty('--bg','#111113');
    document.documentElement.style.setProperty('--bg-surface','#18181b');
    document.documentElement.style.setProperty('--bg-elevated','#212126');
    document.documentElement.style.setProperty('--bg-hover','#27272d');
    document.documentElement.style.setProperty('--bg-active','#2e2e36');
    document.documentElement.style.setProperty('--border','rgba(255,255,255,0.07)');
    document.documentElement.style.setProperty('--border-strong','rgba(255,255,255,0.13)');
    document.documentElement.style.setProperty('--text','#eeede6');
    document.documentElement.style.setProperty('--text-2','#a3a29c');
    document.documentElement.style.setProperty('--text-muted','#585753');
    document.documentElement.style.setProperty('--shadow','0 2px 12px rgba(0,0,0,0.45)');
    document.documentElement.style.setProperty('--shadow-lg','0 8px 32px rgba(0,0,0,0.55)');
  }
}
function toggleTheme(){
  applyTheme(document.documentElement.getAttribute('data-theme')==='dark'?'light':'dark');
}
(function(){
  const saved = localStorage.getItem(ThemeKey);
  const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  applyTheme(saved || preferred);
})();

/* ── Sidebar ── */
function toggleSidebar(){ const sb=document.getElementById('sidebar'),ov=document.getElementById('sbOverlay'),o=sb.classList.toggle('open');ov.classList.toggle('open',o); }
function closeSidebar(){ document.getElementById('sidebar').classList.remove('open');document.getElementById('sbOverlay').classList.remove('open'); }

/* ── Core API ── */
const R = {
  csrf(){ return document.cookie.split(';').map(c=>c.trim()).find(c=>c.startsWith('csrftoken='))?.split('=')[1]||''; },
  async post(url, data={}, json=false){
    try{
      if(json){ const r=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json','X-CSRFToken':R.csrf()},body:JSON.stringify(data)}); return await r.json(); }
      const fd=new FormData(); Object.entries(data).forEach(([k,v])=>{ if(Array.isArray(v))v.forEach(x=>fd.append(k,x)); else fd.append(k,String(v)); }); fd.append('csrfmiddlewaretoken',R.csrf());
      const r=await fetch(url,{method:'POST',body:fd}); return await r.json();
    }catch(e){ return {error:'Network error'}; }
  },
  modal(id,open=true){ const el=document.getElementById(id); if(el)el.classList.toggle('open',open); },
  toast(msg,type='info'){
    const ct=document.getElementById('toast-container');
    const t=document.createElement('div');
    const icons={ok:'✓',err:'✕',warn:'⚠',info:'ℹ'};
    t.className=`toast toast-${type==='info'?'':type}`.trim();
    t.innerHTML=`<div class="toast-icon">${icons[type]||'·'}</div><span>${msg}</span>`;
    ct.appendChild(t);
    requestAnimationFrame(()=>requestAnimationFrame(()=>t.classList.add('show')));
    setTimeout(()=>{ t.classList.remove('show'); setTimeout(()=>t.remove(),220); },3200);
  }
};
const C = { csrf:()=>R.csrf(), post:(u,d)=>R.post(u,d), modal:(id,open)=>R.modal(id,open), toggle:(id)=>{ const el=document.getElementById(id); if(el)el.classList.toggle('hidden'); }, toast:(msg,type)=>{ const m={ok:'ok',err:'err',warn:'warn'}; R.toast(msg,m[type]||'info'); } };

/* ── Tabs ── */
document.querySelectorAll('.tab[data-group]').forEach(tab=>{
  tab.addEventListener('click',()=>{
    const g=tab.dataset.group,t=tab.dataset.tab;
    document.querySelectorAll(`.tab[data-group="${g}"]`).forEach(x=>x.classList.remove('active'));
    document.querySelectorAll(`[data-panel="${g}"]`).forEach(x=>x.classList.remove('active'));
    tab.classList.add('active');
    const p=document.getElementById(t); if(p)p.classList.add('active');
  });
});

/* ── Escape closes modals ── */
document.addEventListener('keydown',e=>{ if(e.key==='Escape') document.querySelectorAll('.overlay.open').forEach(o=>o.classList.remove('open')); });
document.querySelectorAll('.overlay').forEach(o=>o.addEventListener('click',e=>{ if(e.target===o)o.classList.remove('open'); }));

/* ── Drug search ── */
function mkDrugSearch(inputId,dropId,onSelect){
  const inp=document.getElementById(inputId),drop=document.getElementById(dropId);
  if(!inp||!drop)return;
  let tm;
  const doSearch=async()=>{
    const q=inp.value.trim();
    try{ const r=await fetch(`/records/api/drug-search/?q=${encodeURIComponent(q)}`); const data=await r.json();
      drop.innerHTML=''; if(!data.results?.length){drop.classList.remove('open');return;}
      data.results.forEach(d=>{ const item=document.createElement('div'); item.className='sd-item';
        item.innerHTML=`<div class="sd-name">${d.name}${d.strength?` <span class="text-muted">(${d.strength})</span>`:''}</div><div class="sd-sub">₦${Number(d.price).toLocaleString()} · ${d.form||''}${d.is_injection?' · 💉':''}</div>`;
        item.onclick=()=>{ onSelect(d); inp.value=''; drop.classList.remove('open'); }; drop.appendChild(item); });
      drop.classList.add('open');
    }catch(e){}
  };
  inp.addEventListener('input',()=>{ clearTimeout(tm); tm=setTimeout(doSearch,80); });
  inp.addEventListener('focus',doSearch); inp.addEventListener('click',()=>{ if(!inp.value.trim())doSearch(); });
  document.addEventListener('click',e=>{ if(!inp.contains(e.target)&&!drop.contains(e.target))drop.classList.remove('open'); });
  return {open:doSearch};
}

/* ── Lab test search ── */
function mkTestSearch(inputId,dropId,onSelect){
  const inp=document.getElementById(inputId),drop=document.getElementById(dropId);
  if(!inp||!drop)return;
  let tm;
  const doSearch=async()=>{
    const q=inp.value.trim();
    try{ const r=await fetch(`/records/api/lab-test-search/?q=${encodeURIComponent(q)}`); const data=await r.json();
      drop.innerHTML=''; if(!data.results?.length){drop.classList.remove('open');return;}
      data.results.forEach(t=>{ const item=document.createElement('div'); item.className='sd-item';
        item.innerHTML=`<div class="sd-name">${t.name}</div><div class="sd-sub">${t.category||'—'} · ₦${Number(t.price).toLocaleString()}</div>`;
        item.onclick=()=>{ onSelect(t); inp.value=''; drop.classList.remove('open'); }; drop.appendChild(item); });
      drop.classList.add('open');
    }catch(e){}
  };
  inp.addEventListener('input',()=>{ clearTimeout(tm); tm=setTimeout(doSearch,80); });
  inp.addEventListener('focus',doSearch); inp.addEventListener('click',()=>{ if(!inp.value.trim())doSearch(); });
  document.addEventListener('click',e=>{ if(!inp.contains(e.target)&&!drop.contains(e.target))drop.classList.remove('open'); });
  return {open:doSearch};
}

/* ── Patient search ── */
function mkPatientSearch(inputId,dropId,onSelect){
  const inp=document.getElementById(inputId),drop=document.getElementById(dropId);
  if(!inp||!drop)return; let tm;
  inp.addEventListener('input',()=>{ clearTimeout(tm); tm=setTimeout(async()=>{
    const q=inp.value.trim(); if(!q){drop.classList.remove('open');return;}
    try{ const r=await fetch(`/api/search-patient/?q=${encodeURIComponent(q)}`); const data=await r.json();
      drop.innerHTML=''; if(!data.results?.length){drop.classList.remove('open');return;}
      data.results.forEach(p=>{ const item=document.createElement('div'); item.className='sd-item';
        item.innerHTML=`<div class="sd-name">${p.name}</div><div class="sd-sub">@${p.username}</div>`;
        item.onclick=()=>{ onSelect(p); inp.value=p.name; drop.classList.remove('open'); }; drop.appendChild(item); });
      drop.classList.add('open');
    }catch(e){} },120); });
  document.addEventListener('click',e=>{ if(!inp.contains(e.target)&&!drop.contains(e.target))drop.classList.remove('open'); });
}

/* ── Doctor search ── */
function mkDoctorSearch(inputId,dropId,onSelect,getDtype,getSpec){
  const inp=document.getElementById(inputId),drop=document.getElementById(dropId);
  if(!inp||!drop)return; let tm;
  const doSearch=async()=>{
    const q=inp.value.trim(),dtype=typeof getDtype==='function'?getDtype():(getDtype||''),spec=typeof getSpec==='function'?getSpec():(getSpec||'');
    try{ const r=await fetch(`/api/search-doctors/?q=${encodeURIComponent(q)}&type=${dtype}&specialization=${encodeURIComponent(spec)}`); const data=await r.json();
      drop.innerHTML=''; if(!data.results?.length){drop.classList.remove('open');return;}
      data.results.forEach(d=>{ const item=document.createElement('div'); item.className='sd-item';
        const dot=d.available?`<span class="text-teal">●</span>`:`<span class="text-muted">○</span>`;
        item.innerHTML=`<div class="sd-name">${dot} ${d.name}</div><div class="sd-sub">${d.specialization||d.type||'General'}${d.room?' · '+d.room:''}</div>`;
        item.onclick=()=>{ onSelect(d); inp.value=d.name; drop.classList.remove('open'); }; drop.appendChild(item); });
      drop.classList.add('open');
    }catch(e){}
  };
  inp.addEventListener('input',()=>{ clearTimeout(tm); tm=setTimeout(doSearch,120); });
  inp.addEventListener('focus',doSearch);
  document.addEventListener('click',e=>{ if(!inp.contains(e.target)&&!drop.contains(e.target))drop.classList.remove('open'); });
  return {refresh:doSearch};
}

/* ── Bed loader ── */
async function loadBeds(wardElId,gridId,hiddenId,calcFn){
  const w=document.getElementById(wardElId)?.value;
  if(!w){document.getElementById(gridId).innerHTML='<span class="text-xs text-muted">Select a ward first</span>';return;}
  try{ const r=await fetch('/records/api/ward-occupancy/'); const data=await r.json();
    const wd=data[w]; const grid=document.getElementById(gridId); grid.innerHTML='';
    for(let b=1;b<=wd.capacity;b++){ const taken=wd.occupied.includes(b); const d=document.createElement('div');
      d.className='bed'+(taken?' bed-taken':'');
      d.innerHTML=`<span>🛏</span><span>Bed ${b}</span>`;
      if(!taken)d.onclick=()=>{ grid.querySelectorAll('.bed').forEach(x=>x.classList.remove('bed-selected')); d.classList.add('bed-selected'); document.getElementById(hiddenId).value=b; if(calcFn)calcFn(); };
      grid.appendChild(d); }
  }catch(e){ R.toast('Could not load bed data','err'); }
}

/* ── Availability toggle ── */
async function toggleField(field,cb){
  const r=await R.post('/api/toggle-availability/',{field});
  if(r.status==='ok'){ if(cb)cb.checked=r.value; }
  else{ R.toast('Could not update','err'); if(cb)cb.checked=!cb.checked; }
}
