/* ---- app: UI, screens, guide, form, check, save ----
   Nothing in this file contains user-facing text. Every string comes from
   t('key') (lang-*.js) and every piece of teaching content comes from
   PHASES / PANDUAN / EXAMPLES / CHECKS (content-*.js), which i18n.js puts on
   window before calling App.boot().
*/

var EXPAND_SVG='<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.1 9.2a3 3 0 015.7 1.1c0 2-3 2.6-3 2.6"/><line x1="12" y1="17.2" x2="12" y2="17.2"/></svg>';
var LOCK='<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M12 1a5 5 0 00-5 5v3H6a2 2 0 00-2 2v9a2 2 0 002 2h12a2 2 0 002-2v-9a2 2 0 00-2-2h-1V6a5 5 0 00-5-5zm3 8H9V6a3 3 0 016 0v3z"/></svg>';
var GLOBE='<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm6.9 6h-2.5a15.7 15.7 0 00-1.4-3.6A8 8 0 0118.9 8zM12 4c.8 1.1 1.4 2.5 1.8 4h-3.6C10.6 6.5 11.2 5.1 12 4zM4.3 14a7.9 7.9 0 010-4h2.9a17.6 17.6 0 000 4H4.3zm.8 2h2.5c.3 1.3.8 2.5 1.4 3.6A8 8 0 015.1 16zm2.5-8H5.1a8 8 0 013.9-3.6A15.7 15.7 0 007.6 8zM12 20c-.8-1.1-1.4-2.5-1.8-4h3.6c-.4 1.5-1 2.9-1.8 4zm2.2-6H9.8a15.5 15.5 0 010-4h4.4a15.5 15.5 0 010 4zm.4 5.6c.6-1.1 1.1-2.3 1.4-3.6h2.5a8 8 0 01-3.9 3.6zM16.8 14a17.6 17.6 0 000-4h2.9a7.9 7.9 0 010 4h-2.9z"/></svg>';

/* textarea id -> hint key (lang pack) and -> content field key (content pack) */
var HINT_KEY={f_tagline:'hint.tagline',f_kepribadian:'hint.personality',f_info:'hint.publicInfo',f_bio:'hint.biography',
  f_pesan:'hint.firstMessage',f_npc:'hint.npc',f_pedoman:'hint.guidelines',f_catatan:'hint.creatorNotes'};
var FIELD_MAP={f_tagline:"tagline",f_kepribadian:"kepribadian",f_info:"infoPublik",f_bio:"biografi",f_pesan:"pesan",
  f_npc:"npc",f_pedoman:"pedoman",f_catatan:"catatan"};

/* internal field key -> label key. The keys on the left are stored in
   Supabase and are identical in every market; never rename them. */
var SAVED_FIELDS=[['name','label.name'],['gender','label.gender'],['hashtags','label.hashtag'],['tagline','label.tagline'],
  ['kepribadian','label.personality'],['info','label.publicInfo'],['bio','label.biography'],['pesan','label.firstMessage'],
  ['npc','label.npc'],['gaya','label.style'],['pedoman','label.guidelines'],['catatan','label.creatorNotes']];

/* ---------- screens ---------- */
function showScreen(id){
  document.querySelectorAll('.screen').forEach(function(s){s.hidden=(s.id!==id);});
  window.scrollTo(0,0);
}
function homeTab(btn,secId){
  document.querySelectorAll('.htab').forEach(function(x){x.classList.remove('active');});
  btn.classList.add('active');
  var c=document.getElementById('screen-home'),el=document.getElementById(secId),top=document.querySelector('.home-top');
  var off=(top?top.offsetHeight:0)+10;
  var y=el.getBoundingClientRect().top-c.getBoundingClientRect().top+c.scrollTop-off;
  c.scrollTo({top:y<0?0:y,behavior:'smooth'});
}
function toggleAdv(btn){var adv=btn.parentNode;adv.classList.toggle('open');var b=adv.querySelector('.adv-body');b.hidden=!b.hidden;}
function setAdv(open){var adv=document.getElementById('advBlock');if(!adv)return;adv.classList.toggle('open',open);var b=adv.querySelector('.adv-body');if(b)b.hidden=!open;}

/* ---------- guide ---------- */
function badgeHtml(v,r){
  var vis=v==='pub'?'<span class="badge pub">'+t('badge.public')+'</span>'
        :v==='set'?'<span class="badge opt">'+t('badge.setting')+'</span>'
                  :'<span class="badge dpr">'+t('badge.aiOnly')+'</span>';
  var req=r==='wjb'?'<span class="badge wjb">'+t('badge.required')+'</span>'
                   :'<span class="badge opt">'+t('badge.optional')+'</span>';
  return vis+req;
}
function exampleKeys(){return Object.keys(EXAMPLES);}
function liveExampleKeys(){return exampleKeys().filter(function(k){return !EXAMPLES[k].draft;});}
function shortName(key){return EXAMPLES[key].name.split(' | ')[0];}

function buildExampleGrid(){
  var grid=document.getElementById('exGrid');if(!grid)return;
  grid.innerHTML='';
  exampleKeys().forEach(function(key){
    var d=EXAMPLES[key];
    var chips=(d.tags||[]).map(function(x){return '<span>'+escHtml(x)+'</span>';}).join('');
    var card=document.createElement('button');card.className='ex-card'+(d.draft?' is-draft':'');
    card.onclick=function(){openPreview(key);};
    card.innerHTML=
      '<div class="ex-thumb" style="'+(d.img?'background-image:url(\''+d.img+'\'), '+d.grad+';background-size:cover;background-position:center;':'background:'+d.grad)+'">'+(d.img?'':'<span class="em">'+d.emoji+'</span>')+
        '<span class="ex-count"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.4 8.4 0 01-9 8.4 9 9 0 01-3.9-.9L3 20l1-4.1A8.4 8.4 0 1121 11.5z"/></svg>'+d.count+'</span></div>'+
      '<div class="ex-info"><strong>'+escHtml(shortName(key))+'</strong><p class="tl">'+escHtml(d.tagline)+'</p><div class="chips">'+chips+'</div></div>';
    grid.appendChild(card);
  });
}
function buildPanduan(){
  var box=document.getElementById('panList');if(!box)return;
  box.innerHTML='';
  PHASES.forEach(function(ph,pi){
    var head=document.createElement('div');head.className='pan-phase';
    head.innerHTML='<span class="ph-num">'+ph.num+'</span><h3>'+ph.title+'</h3><p>'+ph.note+'</p>';
    box.appendChild(head);
    PANDUAN.filter(function(k){return k.phase===pi;}).forEach(function(k){
      var idx=PANDUAN.indexOf(k);
      var row=document.createElement('button');row.className='pan-row';row.onclick=function(){openPanduan(idx);};
      row.innerHTML='<span class="n">'+String(k.n).padStart(2,'0')+'</span><span class="mid"><strong>'+k.name+'</strong><span class="badges">'+badgeHtml(k.vis,k.req)+'</span></span>'+
        '<span class="chev"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M9 6l6 6-6 6"/></svg></span>';
      box.appendChild(row);
    });
  });
}
function renderBlocks(blocks){
  return blocks.map(function(b){
    if(b.h) return '<p class="sec-h'+(b.hType?' '+b.hType:'')+'">'+b.h+'</p>';
    if(b.p) return '<p class="lead">'+b.p+'</p>';
    if(b.steps) return '<ol class="pan-ol">'+b.steps.map(function(s){return '<li>'+s.t+(s.ex?'<span class="mini-ex">'+s.ex+'</span>':'')+'</li>';}).join('')+'</ol>';
    if(b.bullets) return '<ul>'+b.bullets.map(function(x){return '<li>'+x+'</li>';}).join('')+'</ul>';
    if(b.table) return '<div class="pan-table"><table><thead><tr>'+b.table.head.map(function(h){return '<th>'+h+'</th>';}).join('')+'</tr></thead><tbody>'+b.table.rows.map(function(r){return '<tr>'+r.map(function(c){return '<td>'+c+'</td>';}).join('')+'</tr>';}).join('')+'</tbody></table></div>';
    if(b.ex) return '<div class="ex-box'+(b.exType?' '+b.exType:'')+'"><span class="lbl">'+(b.exLabel||t('ex.label'))+'</span>'+b.ex+'</div>';
    if(b.note) return '<div class="pan-note '+(b.noteType||'tip')+'">'+b.note+'</div>';
    return '';
  }).join('');
}
function renderGrouped(blocks){
  var lead=[],panels=[],cur=null;
  blocks.forEach(function(b){
    if(b.h){cur={title:b.h,body:[]};panels.push(cur);}
    else if(cur){cur.body.push(b);}
    else{lead.push(b);}
  });
  var html=renderBlocks(lead);
  panels.forEach(function(pn){
    html+='<div class="acc"><button class="acc-head" onclick="toggleAcc(this)"><span>'+pn.title+'</span>'+
      '<svg class="acc-chev" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 9l6 6 6-6"/></svg></button>'+
      '<div class="acc-body">'+renderBlocks(pn.body)+'</div></div>';
  });
  return html;
}
function toggleAcc(btn){btn.parentNode.classList.toggle('open');}
function navBtn(i,dir){
  var k=PANDUAN[i];var isNext=dir==='next';
  return '<button class="'+(isNext?'next':'prev')+'" onclick="openPanduan('+i+')">'+
    (isNext?'':'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke-width="2.4" stroke-linecap="round"><path d="M15 18l-6-6 6-6"/></svg>')+
    '<span><span class="lbl2">'+(isNext?t('nav.next'):t('nav.prev'))+'</span><span class="nm">'+String(k.n).padStart(2,'0')+' '+k.name+'</span></span>'+
    (isNext?'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke-width="2.4" stroke-linecap="round"><path d="M9 6l6 6-6 6"/></svg>':'')+
    '</button>';
}
function openPanduan(i){
  var k=PANDUAN[i];
  document.getElementById('panTitle').textContent=String(k.n).padStart(2,'0')+' \u00b7 '+k.name;
  var html='<div class="head-badges">'+badgeHtml(k.vis,k.req)+'</div>';
  html+=k.collapsible?renderGrouped(k.blocks):renderBlocks(k.blocks);
  html+=seeExBtn(i);
  var body=document.getElementById('panBody');body.innerHTML=html;
  var prev=PANDUAN[i-1],next=PANDUAN[i+1];
  document.getElementById('panNav').innerHTML='<div class="pan-nav">'+(prev?navBtn(i-1,'prev'):'<span style="flex:1"></span>')+(next?navBtn(i+1,'next'):'<span style="flex:1"></span>')+'</div>';
  showScreen('screen-panduan');
}

/* ---------- shared field helpers ---------- */
function count(el){var c=el.closest('.ta-box').querySelector('.count');if(c)c.textContent=t('form.chars',{n:el.value.length});}
function setVal(id,val){var el=document.getElementById(id);if(!el)return;el.value=val||'';var c=el.closest('.ta-box')?el.closest('.ta-box').querySelector('.count'):null;if(c)c.textContent=t('form.chars',{n:val?val.length:0});}

function addHashRow(val){
  var wrap=document.getElementById('hashRows');
  var row=document.createElement('div');row.className='hashtag-input';row.style.marginBottom='12px';
  row.innerHTML='<input class="txt" type="text" placeholder="'+escHtml(t('form.hashtag.ph'))+'" value="'+(val?String(val).replace(/"/g,'&quot;'):'')+'">'+
    '<button class="clear" onclick="this.parentNode.remove()" aria-label="'+escHtml(t('form.remove'))+'"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button>';
  wrap.appendChild(row);
}

/* Style chips: the chip's data-key is the value, the visible label is
   whatever the market calls it. Renaming a chip can no longer break an
   example character or a saved one. */
function addSaran(chip){
  var ta=document.getElementById('styleTa');var val=t('chip.'+chip.dataset.key);var on=chip.classList.toggle('on');
  var parts=ta.value.split(',').map(function(s){return s.trim();}).filter(Boolean);
  if(on){if(parts.indexOf(val)===-1)parts.push(val);}else{parts=parts.filter(function(p){return p!==val;});}
  ta.value=parts.join(', ');
}
function setChips(keys){
  document.querySelectorAll('#chips .chip').forEach(function(c){c.classList.remove('on');});
  (keys||[]).forEach(function(k){
    var el=document.querySelector('#chips .chip[data-key="'+k+'"]');
    if(el)el.classList.add('on');
  });
}

/* ---------- load / clear form ---------- */
function clearForm(){
  ['f_name','f_tagline','f_kepribadian','f_info','f_bio','f_pesan','f_npc','styleTa','f_pedoman','f_catatan'].forEach(function(id){setVal(id,'');});
  var g=document.getElementById('f_gender');g.value='';g.classList.remove('filled');
  document.getElementById('hashRows').innerHTML='';
  setChips([]);
  document.getElementById('avatar').innerHTML='<input type="file" accept="image/*" hidden id="avatarInput"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 3l-1.5 2H5a2 2 0 00-2 2v11a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2h-2.5L15 3H9zm3 15a5 5 0 110-10 5 5 0 010 10z"/></svg><span>'+escHtml(t('field.avatar'))+'</span>';
  bindAvatar();
  pickPrivByVal('private');
}
/* Rows saved before localisation stored the Indonesian label as the value.
   Normalise on read so old characters still open correctly. */
var GENDER_LEGACY={'Pria':'male','Wanita':'female','Lainnya':'other'};
function normGender(v){return GENDER_LEGACY[v]||v||'';}
function setGender(v){var g=document.getElementById('f_gender');g.value=normGender(v);g.classList.toggle('filled',!!g.value);}

function applyExample(d){
  setVal('f_name',d.name);
  setGender(d.gender);
  (d.hashtags||[]).forEach(function(h){addHashRow(h);});
  setVal('f_tagline',d.tagline);
  setVal('f_kepribadian',d.kepribadian);
  setVal('f_info',d.infoPublik);
  setVal('f_bio',d.biografi);
  setVal('f_pesan',d.pesan);
  setVal('f_npc',d.npc);
  setVal('styleTa',d.gaya);
  setChips(d.chips);
  setVal('f_pedoman',d.pedoman);
  setVal('f_catatan',d.catatan);
  pickPrivByVal(d.privasi==='public'?'public':'private');
}
var currentFormKey=null;
function loadForm(key){
  currentFormKey=key;editingSavedId=null;
  clearForm();setFormLocked(false);setAdv(false);document.getElementById('ckBtn').textContent=t('form.check');
  if(key==='empty'){document.getElementById('formTitle').textContent=t('form.title.practice');addHashRow();}
  else{document.getElementById('formTitle').textContent=t('form.title.example',{name:shortName(key)});applyExample(EXAMPLES[key]);}
  showScreen('screen-form');
  document.querySelector('#screen-form .body').scrollTop=0;
}
function backFromForm(){
  if(currentFormKey==='saved'&&editingSavedId)openSavedDetail(editingSavedId);
  else if(currentFormKey&&currentFormKey!=='empty'&&currentFormKey!=='saved')openPreview(currentFormKey);
  else showScreen('screen-home');
}

/* ---------- preview ---------- */
var currentPreviewKey=null;
function openPreview(key){
  currentPreviewKey=key;
  var d=EXAMPLES[key];
  document.getElementById('pvName').textContent=shortName(key);
  document.getElementById('pvTopName').textContent=shortName(key);
  document.getElementById('pvEmoji').textContent=d.emoji||'';
  document.getElementById('pvHero').style.background=d.grad||'linear-gradient(150deg,#1c2a2f,#0e1518)';
  var himg=document.getElementById('pvHeroImg');if(d.img){himg.style.backgroundImage="url('"+d.img+"')";himg.hidden=false;}else{himg.hidden=true;himg.style.backgroundImage='';}
  var html='';
  html+='<div class="pv-tagbox"><p class="lbl">'+t('preview.tagline')+'</p><div class="q">'+
    '<svg width="22" height="22" viewBox="0 0 24 24" fill="var(--teal)"><path d="M7 7h4v4c0 2.5-1.5 4-4 4V13H5V9a2 2 0 012-2zm8 0h4v4c0 2.5-1.5 4-4 4V13h-2V9a2 2 0 012-2z"/></svg>'+
    '<p>'+escHtml(d.tagline)+'</p></div>'+
    '<div class="pv-tagchips">'+(d.tags||[]).map(function(x){return '<span>'+escHtml(x)+'</span>';}).join('')+'</div></div>';
  html+='<div class="pv-sec"><p class="lbl">'+t('preview.creator')+'</p><div class="pv-creator"><span class="ava">i</span><span class="nm">imely.ai</span>'+
    '<span class="chev"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M9 6l6 6-6 6"/></svg></span></div></div>';
  html+='<div class="pv-sec"><p class="lbl">'+t('preview.creatorNotes')+'</p><p class="val">'+escHtml(d.catatan)+'</p></div>';
  html+='<div class="pv-sec"><p class="lbl">'+t('preview.publicInfo')+'</p><p class="val">'+escHtml(d.infoPublik)+'</p></div>';
  html+='<div class="pv-sec"><p class="lbl">'+t('preview.biography')+'</p><p class="val">'+escHtml(d.biografi)+'</p></div>';
  html+='<div class="pv-sec"><p class="lbl">'+t('preview.firstMessage')+'</p><div class="pv-bubble"><span class="ava" style="background:'+(d.grad||'#1c2a2f')+'">'+(d.img?'<span class="ava-img" style="background-image:url('+d.img+')"></span>':(d.emoji||''))+'</span>'+
    '<div class="msg">'+escHtml(d.pesan)+'</div></div></div>';
  document.getElementById('pvBody').innerHTML=html;
  document.getElementById('pvScroll').scrollTop=0;
  showScreen('screen-preview');
}
function openFullExample(){viewExample(currentPreviewKey);}
function viewExample(key){
  currentFormKey=key;editingSavedId=null;
  clearForm();
  document.getElementById('formTitle').textContent=t('form.title.example',{name:shortName(key)});
  applyExample(EXAMPLES[key]);
  setAdv(true);setFormLocked(true);
  document.getElementById('ckBtn').textContent=t('form.checkExample');
  showScreen('screen-form');document.querySelector('#screen-form .body').scrollTop=0;
}
function setFormLocked(lock){
  formLocked=lock;
  var body=document.querySelector('#screen-form .body');if(!body)return;
  body.querySelectorAll('input,textarea').forEach(function(e){e.readOnly=lock;});
  var g=document.getElementById('f_gender');if(g)g.disabled=lock;
  body.querySelectorAll('#chips .chip, .btn-add, .hashtag-input .clear').forEach(function(b){b.style.pointerEvents=lock?'none':'';b.style.opacity=lock?'.45':'';});
  var av=document.getElementById('avatar');if(av)av.style.pointerEvents=lock?'none':'';
  var pr=body.querySelector('.priv-row');if(pr)pr.style.pointerEvents=lock?'none':'';
}

/* ---------- example popup ---------- */
var exField=null,exLabel='';
function closeEx(){document.getElementById('exModal').hidden=true;}
function openExampleChooser(fieldKey,label){
  exField=fieldKey;exLabel=label||'';
  document.getElementById('exTitle').textContent=label?t('ex.pickWith',{label:label}):t('ex.pick');
  var html='<div class="ex-chooser">';
  liveExampleKeys().forEach(function(key){
    var d=EXAMPLES[key];
    html+='<button class="ex-choose-btn" onclick="pickExampleChar(\''+key+'\')">'+
      '<span class="ec-ava" style="background:'+d.grad+'">'+(d.emoji||'')+(d.img?'<span class="ec-ava-img" style="background-image:url('+d.img+')"></span>':'')+'</span>'+
      '<span class="ec-name">'+escHtml(shortName(key))+'</span>'+
      '<svg class="ec-chev" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M9 6l6 6-6 6"/></svg></button>';
  });
  html+='</div>';
  var b=document.getElementById('exBody');b.innerHTML=html;b.scrollTop=0;
  document.getElementById('exModal').hidden=false;
}
function pickExampleChar(key){
  var val=EXAMPLES[key][exField];if(Array.isArray(val))val=val.map(function(x){return '#'+x;}).join('   ');
  document.getElementById('exTitle').textContent=(exLabel?exLabel+' \u2014 ':'')+shortName(key);
  document.getElementById('exBody').innerHTML='<button class="ex-back" onclick="openExampleChooser(exField,exLabel)">'+escHtml(t('ex.other'))+'</button><div class="ex-text">'+escHtml(val)+'</div>';
  document.getElementById('exBody').scrollTop=0;
}
function showPanduanExample(i){var k=PANDUAN[i];if(!k.field)return;openExampleChooser(k.field,k.name);}
function showExampleByField(fid){var fld=FIELD_MAP[fid];if(!fld)return;openExampleChooser(fld,'');}
function seeExBtn(i){var k=PANDUAN[i];if(!k.field||k.field==='gender'||!liveExampleKeys().length)return '';
  return '<button class="see-ex" onclick="showPanduanExample('+i+')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/></svg>'+escHtml(t('guide.seeExample'))+'</button>';}
function openPanduanPopup(idx){
  var k=PANDUAN[idx];
  document.getElementById('panModalTitle').textContent=String(k.n).padStart(2,'0')+' \u00b7 '+k.name;
  var b=document.getElementById('panModalBody');
  b.innerHTML='<div class="head-badges">'+badgeHtml(k.vis,k.req)+'</div>'+(k.collapsible?renderGrouped(k.blocks):renderBlocks(k.blocks))+seeExBtn(idx);
  b.scrollTop=0;document.getElementById('panModal').hidden=false;
}
function showPanduanForField(fid){
  var fld=FIELD_MAP[fid];if(!fld)return;
  for(var j=0;j<PANDUAN.length;j++){if(PANDUAN[j].field===fld){openPanduanPopup(j);return;}}
}
function closePanModal(){document.getElementById('panModal').hidden=true;}

/* ---------- editor popup ---------- */
var curTa=null;
function openEditor(el){
  var box=el.closest('.ta-box');curTa=box.querySelector('textarea');
  var field=curTa.closest('.field');var lbl=field.querySelector('label.lbl');
  document.getElementById('modalTitle').textContent=lbl?lbl.textContent.trim():'';
  var hint=document.getElementById('modalHint');var hk=HINT_KEY[curTa.id];
  if(hk){
    var links='';
    if(FIELD_MAP[curTa.id]){
      var bC=(formLocked||!liveExampleKeys().length)?'':'<button class="h-link" onclick="showExampleByField(\''+curTa.id+'\')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/></svg>'+escHtml(t('guide.seeExample'))+'</button>';
      var bP='<button class="h-link" onclick="showPanduanForField(\''+curTa.id+'\')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h9a3 3 0 013 3v13a2.5 2.5 0 00-2.5-2.5H4z"/><path d="M20 4h-4a3 3 0 00-3 3v13a2.5 2.5 0 012.5-2.5H20z"/></svg>'+escHtml(t('guide.seeGuide'))+'</button>';
      links='<div class="h-links">'+bC+bP+'</div>';
    }
    hint.innerHTML=t(hk)+links;hint.hidden=false;
  } else hint.hidden=true;
  var mta=document.getElementById('modalTa');mta.placeholder=curTa.placeholder;mta.value=curTa.value;mta.readOnly=formLocked;
  document.getElementById('modalFoot').innerHTML=formLocked
    ?'<button class="modal-done" onclick="closeEditor(false)">'+escHtml(t('modal.close'))+'</button>'
    :'<button class="modal-cancel" onclick="closeEditor(false)">'+escHtml(t('modal.cancel'))+'</button><button class="modal-done" onclick="closeEditor(true)">'+escHtml(t('modal.done'))+'</button>';
  document.getElementById('modal').hidden=false;if(!formLocked)setTimeout(function(){mta.focus();},50);
}
function closeEditor(save){
  if(save&&curTa){curTa.value=document.getElementById('modalTa').value;curTa.dispatchEvent(new Event('input'));}
  document.getElementById('modal').hidden=true;curTa=null;
}

/* ---------- privacy ---------- */
function openPriv(){document.getElementById('privSheet').hidden=false;}
function closePriv(){document.getElementById('privSheet').hidden=true;}
function pickPriv(el){pickPrivByVal(el.dataset.val);closePriv();}
function pickPrivByVal(val){
  document.querySelectorAll('.priv-opt').forEach(function(o){o.classList.toggle('selected',o.dataset.val===val);});
  document.getElementById('privLabel').textContent=(val==='public'?t('priv.public'):t('priv.private'));
  document.getElementById('privIcon').innerHTML=(val==='public'?GLOBE:LOCK);
}

/* ---------- settings ----------
   Holds account, language and appearance. Account rows are rendered by
   renderAccount() in auth.js so they stay in sync with the session. */
function openSettings(){renderSettings();showScreen('screen-settings');}

function renderSettings(){
  renderAccount();
  renderLanguageRows();
  renderAppearanceRows();
}
function renderLanguageRows(){
  var box=document.getElementById('setLanguage');if(!box)return;
  box.innerHTML=I18N.MARKETS.map(function(m){
    var on=m.code===I18N.lang;
    return '<button class="set-row'+(on?' on':'')+'" onclick="I18N.setLang(\''+m.code+'\')" aria-current="'+on+'">'+
      '<div class="set-main"><strong>'+escHtml(m.label)+'</strong></div>'+
      '<svg class="tick" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg></button>';
  }).join('');
}

/* Theme: 'light' | 'dark' | 'system'. No stored choice means system. */
var THEME_KEY='imely_theme';
function storedTheme(){try{return localStorage.getItem(THEME_KEY)||'system';}catch(e){return 'system';}}
function systemDark(){try{return matchMedia('(prefers-color-scheme: dark)').matches;}catch(e){return false;}}
function effectiveTheme(){var v=storedTheme();return v==='system'?(systemDark()?'dark':'light'):v;}
function applyTheme(){document.documentElement.setAttribute('data-theme',effectiveTheme());}
function setTheme(v){
  try{localStorage.setItem(THEME_KEY,v);}catch(e){}
  applyTheme();renderAppearanceRows();
}
function toggleDark(){setTheme(effectiveTheme()==='dark'?'light':'dark');}
function renderAppearanceRows(){
  var box=document.getElementById('setAppearance');if(!box)return;
  var dark=effectiveTheme()==='dark',isSystem=storedTheme()==='system';
  box.innerHTML=
    '<div class="set-row"><div class="set-main"><strong>'+escHtml(t('settings.dark'))+'</strong>'+
      '<small>'+escHtml(isSystem?t('settings.dark.system'):t('settings.dark.manual'))+'</small></div>'+
      '<button class="set-toggle" role="switch" aria-checked="'+dark+'" aria-label="'+escHtml(t('settings.dark'))+'" onclick="toggleDark()"></button></div>';
}
/* Follow the OS live, but only while the user hasn't picked a side. */
(function(){
  try{
    var mq=matchMedia('(prefers-color-scheme: dark)');
    var onChange=function(){if(storedTheme()==='system'){applyTheme();renderAppearanceRows();}};
    if(mq.addEventListener)mq.addEventListener('change',onChange);else if(mq.addListener)mq.addListener(onChange);
  }catch(e){}
})();

/* ---------- avatar ---------- */
function bindAvatar(){
  var inp=document.getElementById('avatarInput');if(!inp)return;
  inp.addEventListener('change',function(e){var f=e.target.files[0];if(!f)return;var url=URL.createObjectURL(f);document.getElementById('avatar').innerHTML='<img src="'+url+'" alt="avatar">';});
}

/* ---------- checking ---------- */
function escHtml(x){return (x||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
function gatherForm(){
  function v(id){var e=document.getElementById(id);return e?e.value.trim():'';}
  var hashtags=[];document.querySelectorAll('#hashRows input').forEach(function(i){if(i.value.trim())hashtags.push(i.value.trim());});
  return {name:v('f_name'),gender:document.getElementById('f_gender').value,hashtags:hashtags,
    tagline:v('f_tagline'),kepribadian:v('f_kepribadian'),info:v('f_info'),bio:v('f_bio'),
    pesan:v('f_pesan'),npc:v('f_npc'),gaya:v('styleTa'),pedoman:v('f_pedoman'),catatan:v('f_catatan')};
}
/* Replaces the old detectPron(). The rules live in CHECKS.registers in the
   market's content pack, because what signals distance differs by language:
   Indonesian marks it with pronouns, English marks it with address and
   diction. */
function detectRegister(txt){
  txt=(txt||'').toLowerCase();
  var rules=(typeof CHECKS!=='undefined'&&CHECKS.registers)||[];
  for(var i=0;i<rules.length;i++){
    var r=rules[i];
    if(r.none&&r.none.some(function(re){return re.test(txt);}))continue;
    if(r.all&&r.all.every(function(re){return re.test(txt);}))return r.id;
    if(r.any&&r.any.some(function(re){return re.test(txt);}))return r.id;
  }
  return null;
}
function hasAny(txt,words){txt=(txt||'').toLowerCase();return (words||[]).some(function(w){return txt.indexOf(w)>=0;});}

function runChecks(v){
  var r=[];function push(st,label,why,col){r.push({status:st,label:label,why:why,col:col});}
  push(v.name?'ok':'warn',t('label.name'),v.name?t('check.filled'):t('check.blank'),1);
  push(v.gender?'ok':'warn',t('label.gender'),v.gender?t('check.gender.ok'):t('check.gender.warn'),2);
  push(v.tagline?'ok':'warn',t('label.tagline'),v.tagline?t('check.filled'):t('check.blank'),4);
  push(v.kepribadian?'ok':'warn',t('check.personality.label'),v.kepribadian?t('check.filled'):t('check.personality.warn'),5);

  var arrows=(v.kepribadian.match(/\u2192|->/g)||[]).length;
  push(arrows>=5?'ok':'warn',t('check.reaction.label'),arrows>=5?t('check.reaction.ok',{n:arrows}):t('check.reaction.warn',{n:arrows}),5);

  var kk=hasAny(v.kepribadian,CHECKS.wantWords)&&hasAny(v.kepribadian,CHECKS.fearWords);
  push(kk?'ok':'warn',t('check.wantfear.label'),kk?t('check.wantfear.ok'):t('check.wantfear.warn'),5);

  push(v.info?'ok':'warn',t('label.publicInfo'),v.info?t('check.filled'):t('check.blank'),6);
  push(v.bio?'ok':'warn',t('label.biography'),v.bio?t('check.filled'):t('check.blank'),7);
  if(v.bio.length>700)push('warn',t('check.bioLong.label'),t('check.bioLong.warn'),7);
  push(v.pesan?'ok':'warn',t('label.firstMessage'),v.pesan?t('check.filled'):t('check.blank'),8);

  var fmt=v.pesan.indexOf('*')>=0&&v.pesan.indexOf('"')>=0;
  push(fmt?'ok':'warn',t('check.format.label'),fmt?t('check.format.ok'):t('check.format.warn'),8);

  var rg=detectRegister(v.gaya),rp=detectRegister(v.pesan);
  if(rg&&rp)push(rg===rp?'ok':'warn',t('check.register.label'),rg===rp?t('check.register.ok',{style:rg}):t('check.register.warn',{msg:rp,style:rg}),10);

  var safe=hasAny(v.pedoman,CHECKS.safetyWords);
  push(safe?'ok':'warn',t('check.safety.label'),safe?t('check.safety.ok'):t('check.safety.warn'),11);
  push(/\d/.test(v.pedoman)?'ok':'warn',t('check.length.label'),/\d/.test(v.pedoman)?t('check.length.ok'):t('check.length.warn'),11);

  if(!v.npc)push('tip',t('check.npc.label'),t('check.npc.tip'),9);
  if(!v.gaya)push('tip',t('check.style.label'),t('check.style.tip'),10);
  if(!v.catatan)push('tip',t('check.notes.label'),t('check.notes.tip'),12);
  return r;
}
function fieldDisplay(key,val){
  if(key==='gender')return val?t('gender.'+normGender(val)):'';
  if(Array.isArray(val))return val.map(function(x){return '#'+x;}).join(' ');
  return val||'';
}
function dumpFields(v){
  return SAVED_FIELDS.map(function(f){
    var val=fieldDisplay(f[0],v[f[0]]);
    return '<p class="dump-lbl">'+escHtml(t(f[1]))+'</p><p class="dump-val'+(val?'':' empty')+'">'+(val?escHtml(val):escHtml(t('check.dumpEmpty')))+'</p>';
  }).join('');
}
function renderEtalaseCard(d){
  var grad=d.grad||'linear-gradient(150deg,#12908a,#0e5b53)';
  var h='<div class="et-card"><div class="et-hero" style="background:'+grad+'">'+(d.emoji?'<span class="et-emoji">'+d.emoji+'</span>':'')+(d.img?'<span class="pv-hero-img" style="background-image:url('+d.img+')"></span>':'')+
    '<div class="et-hero-meta"><h3>'+escHtml(d.name||t('preview.yourChar'))+'</h3></div></div><div class="et-body">';
  h+='<div class="pv-tagbox"><p class="lbl">'+t('preview.tagline')+'</p><div class="q"><svg width="22" height="22" viewBox="0 0 24 24" fill="var(--teal)"><path d="M7 7h4v4c0 2.5-1.5 4-4 4V13H5V9a2 2 0 012-2zm8 0h4v4c0 2.5-1.5 4-4 4V13h-2V9a2 2 0 012-2z"/></svg><p>'+(d.tagline?escHtml(d.tagline):'\u2014')+'</p></div>';
  if(d.tags&&d.tags.length)h+='<div class="pv-tagchips">'+d.tags.map(function(x){return '<span>'+escHtml(x)+'</span>';}).join('')+'</div>';
  h+='</div>';
  h+='<div class="pv-sec"><p class="lbl">'+t('preview.creator')+'</p><div class="pv-creator"><span class="ava">i</span><span class="nm">imely.ai</span></div></div>';
  if(d.catatan)h+='<div class="pv-sec"><p class="lbl">'+t('preview.creatorNotes')+'</p><p class="val">'+escHtml(d.catatan)+'</p></div>';
  if(d.info)h+='<div class="pv-sec"><p class="lbl">'+t('preview.publicInfo')+'</p><p class="val">'+escHtml(d.info)+'</p></div>';
  if(d.bio)h+='<div class="pv-sec"><p class="lbl">'+t('preview.biography')+'</p><p class="val">'+escHtml(d.bio)+'</p></div>';
  if(d.pesan)h+='<div class="pv-sec"><p class="lbl">'+t('preview.firstMessage')+'</p><div class="pv-bubble"><span class="ava" style="background:'+grad+'">'+(d.img?'<span class="ava-img" style="background-image:url('+d.img+')"></span>':(d.emoji||''))+'</span><div class="msg">'+escHtml(d.pesan)+'</div></div></div>';
  h+='</div></div>';return h;
}
function cekKarakter(){
  var v=gatherForm();var checks=runChecks(v);
  var ok=checks.filter(function(c){return c.status==='ok';}).length;
  var warn=checks.filter(function(c){return c.status==='warn';}).length;
  var total=ok+warn;var allGood=warn===0;
  lastCek={values:v,ok:ok,total:total,warn:warn};
  var thm=(formLocked&&currentFormKey&&EXAMPLES[currentFormKey])?EXAMPLES[currentFormKey]:null;
  var html=renderEtalaseCard({name:v.name,tagline:v.tagline,tags:(v.hashtags||[]).map(function(x){return '#'+x;}),
    catatan:v.catatan,info:v.info,bio:v.bio,pesan:v.pesan,grad:thm?thm.grad:null,emoji:thm?thm.emoji:'',img:thm?thm.img:''});
  html+='<p class="ck-section-h">'+t('check.section')+'</p>';
  html+='<div class="ck-score'+(allGood?' good':'')+'">'+(allGood?'\uD83C\uDF89 ':'')+t('check.score',{ok:ok,total:total})+(warn?t('check.scoreWarn',{warn:warn}):'')+'</div>';
  html+='<div class="ck-list">';
  checks.forEach(function(c){
    var ic=c.status==='ok'?'<span class="ck-ic ok">\u2713</span>':c.status==='warn'?'<span class="ck-ic warn">!</span>':'<span class="ck-ic tip">i</span>';
    html+='<div class="ck-row"><span class="ck-ic-wrap">'+ic+'</span><div class="ck-txt"><strong>'+escHtml(c.label)+'</strong><p>'+escHtml(c.why)+'</p></div>'+
      (c.col!=null?'<button class="ck-link" onclick="openPanduanPopup('+c.col+')">'+escHtml(t('check.guideLink'))+'</button>':'')+'</div>';
  });
  html+='</div>';
  html+='<div class="acc"><button class="acc-head" onclick="toggleAcc(this)"><span>'+escHtml(t('check.seeAll'))+'</span><svg class="acc-chev" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 9l6 6 6-6"/></svg></button><div class="acc-body">'+dumpFields(v)+'</div></div>';
  var b=document.getElementById('checkBody');b.innerHTML=html;b.scrollTop=0;
  var ft=document.getElementById('ckFooter');
  if(formLocked){ft.className='footer';ft.innerHTML='<button class="submit" onclick="showScreen(\'screen-form\')">'+escHtml(t('check.back'))+'</button>';}
  else{ft.className='footer footer-2';ft.innerHTML='<button class="btn-ghost2" onclick="showScreen(\'screen-form\')">'+escHtml(t('check.backFix'))+'</button><button class="submit" onclick="saveCurrent()">'+escHtml(t('check.save'))+'</button>';}
  showScreen('screen-check');
}

var lastCek=null,editingSavedId=null,currentSavedId=null,formLocked=false;
function toast(msg){var el=document.getElementById('toast');el.textContent=msg;el.classList.add('show');setTimeout(function(){el.classList.remove('show');},1600);}

/* ---------- save / shelf / detail ---------- */
var savingNow=false;
async function saveCurrent(){
  if(!lastCek||savingNow)return;
  savingNow=true;
  var btn=document.querySelector('#ckFooter .submit');
  if(btn){btn.disabled=true;btn.textContent=t('check.saving');}
  try{
    var obj={id:editingSavedId||null,name:(lastCek.values.name||t('saved.noName')),score:{ok:lastCek.ok,total:lastCek.total},values:lastCek.values,savedAt:Date.now()};
    if(!obj.id&&!(SUPA_READY&&currentUser))obj.id='c'+Date.now();
    var id=await Store.save(obj);editingSavedId=id||obj.id;
    await buildSavedShelf();showScreen('screen-home');toast(t('toast.saved'));
  }catch(e){toast(t('toast.saveFail'));}
  finally{savingNow=false;if(btn){btn.disabled=false;btn.textContent=t('check.save');}}
}
var SV_GRADS=['linear-gradient(150deg,#1f2d34,#0f4b45)','linear-gradient(150deg,#2a1c3a,#5b3d6b)','linear-gradient(150deg,#16233a,#2c4a6b)','linear-gradient(150deg,#3a1c22,#6b3d3d)','linear-gradient(150deg,#1c2e1f,#3d6b4a)','linear-gradient(150deg,#2e2a1c,#6b5a3d)'];
function gradFor(id){var h=0;id=String(id);for(var i=0;i<id.length;i++){h=(h*31+id.charCodeAt(i))>>>0;}return SV_GRADS[h%SV_GRADS.length];}
function svSkeleton(n){var o='';for(var i=0;i<(n||3);i++){o+='<div class="sk-row"><div class="sk-row-head"><div class="sk sk-ava"></div><div class="sk sk-name"></div><div class="sk sk-score"></div></div><div class="sk sk-bio"></div><div class="sk sk-bio short"></div></div>';}return o;}
function svDetailSkeleton(){var o='<div class="sk sk-hint"></div>';for(var i=0;i<6;i++){o+='<div class="sk-dfield"><div class="sk sk-flbl"></div><div class="sk sk-fval"></div><div class="sk sk-fval short"></div></div>';}return o;}
async function buildSavedShelf(){
  var box=document.getElementById('savedSection');if(!box)return;
  if(SUPA_READY&&!currentUser){box.innerHTML='';return;}
  box.innerHTML='<p class="home-sec-label">'+t('home.sec.mine')+'</p><div class="sv-list">'+svSkeleton(3)+'</div>';
  var list=await Store.list();
  if(!list.length){box.innerHTML='';return;}
  var html='<p class="home-sec-label">'+t('home.sec.mine')+'</p><div class="sv-list">';
  list.forEach(function(c){
    var full=c.score&&c.score.ok===c.score.total;
    var ini=(c.name&&c.name.trim()?c.name.trim()[0].toUpperCase():'?');
    var bio=(c.values&&c.values.bio)?escHtml(c.values.bio):'';
    html+='<button class="sv-row" onclick="openSavedDetail(\''+c.id+'\')">'+
      '<div class="sv-row-head">'+
        '<span class="sv-ava" style="background:'+gradFor(c.id)+'">'+ini+'</span>'+
        '<strong class="sv-name">'+escHtml(c.name)+'</strong>'+
        '<span class="sv-score'+(full?' full':'')+'">'+(c.score?c.score.ok+'/'+c.score.total:'')+'</span>'+
      '</div>'+
      (bio?'<p class="sv-bio">'+bio+'</p>':'')+
    '</button>';
  });
  html+='</div>';box.innerHTML=html;
}
async function openSavedDetail(id){
  currentSavedId=id;
  document.getElementById('savedTitle').textContent=t('saved.loading');
  document.getElementById('savedBody').innerHTML=svDetailSkeleton();
  showScreen('screen-saved');
  var c=await Store.get(id);if(!c){showScreen('screen-home');return;}currentSavedChar=c;
  document.getElementById('savedTitle').textContent=c.name||t('saved.title');
  var html='<p class="saved-hint">'+escHtml(t('saved.hint'))+'</p>';
  SAVED_FIELDS.forEach(function(fd){
    var val=fieldDisplay(fd[0],c.values[fd[0]]);var empty=!val;
    html+='<div class="sv-field"><div class="sv-head"><span class="sv-lbl">'+escHtml(t(fd[1]))+'</span>'+
      (empty?'':'<button class="sv-copy" onclick="copyField(\''+fd[0]+'\',this)">'+escHtml(t('saved.copy'))+'</button>')+'</div>'+
      '<p class="sv-val'+(empty?' empty':'')+'">'+(empty?escHtml(t('saved.empty')):escHtml(val))+'</p></div>';
  });
  var b=document.getElementById('savedBody');b.innerHTML=html;b.scrollTop=0;
}
function copyToClipboard(text){
  try{if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(text);return;}}catch(e){}
  try{var ta=document.createElement('textarea');ta.value=text;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.focus();ta.select();document.execCommand('copy');document.body.removeChild(ta);}catch(e){}
}
function copyField(key,btn){
  var c=currentSavedChar;if(!c)return;
  copyToClipboard(fieldDisplay(key,c.values[key]));
  btn.textContent=t('saved.copied');btn.classList.add('done');
  setTimeout(function(){btn.textContent=t('saved.copy');btn.classList.remove('done');},1400);
}
async function editSaved(){
  var c=currentSavedChar||await Store.get(currentSavedId);if(!c)return;
  currentFormKey='saved';editingSavedId=c.id;clearForm();setFormLocked(false);setAdv(false);document.getElementById('ckBtn').textContent=t('form.check');
  document.getElementById('formTitle').textContent=t('form.title.edit',{name:c.name||t('saved.title')});
  applySaved(c.values);showScreen('screen-form');document.querySelector('#screen-form .body').scrollTop=0;
}
function applySaved(v){
  setVal('f_name',v.name);setGender(v.gender);
  (v.hashtags||[]).forEach(function(h){addHashRow(h);});
  setVal('f_tagline',v.tagline);setVal('f_kepribadian',v.kepribadian);setVal('f_info',v.info);
  setVal('f_bio',v.bio);setVal('f_pesan',v.pesan);setVal('f_npc',v.npc);setVal('styleTa',v.gaya);
  setVal('f_pedoman',v.pedoman);setVal('f_catatan',v.catatan);
}
var _confirmCb=null;
function showConfirm(o){
  document.getElementById('confirmTitle').textContent=o.title||t('confirm.title');
  document.getElementById('confirmMsg').textContent=o.msg||'';
  var ok=document.getElementById('confirmOk');ok.textContent=o.okLabel||t('confirm.delete.ok');ok.className='confirm-ok'+(o.danger?' danger':'');
  _confirmCb=o.onOk||null;
  document.getElementById('confirmModal').hidden=false;
}
function closeConfirm(){document.getElementById('confirmModal').hidden=true;_confirmCb=null;}
async function confirmOk(){
  var cb=_confirmCb;if(!cb){closeConfirm();return;}
  var ok=document.getElementById('confirmOk');var lbl=ok.textContent;
  ok.disabled=true;ok.textContent=t('confirm.deleting');
  try{await cb();}catch(e){}
  ok.disabled=false;ok.textContent=lbl;
  closeConfirm();
}
function deleteSaved(){
  showConfirm({title:t('confirm.delete.title'),msg:t('confirm.delete.msg'),okLabel:t('confirm.delete.ok'),danger:true,onOk:doDeleteSaved});
}
var deletingNow=false;
async function doDeleteSaved(){
  if(deletingNow)return;
  deletingNow=true;
  try{
    await Store.remove(currentSavedId);
    await buildSavedShelf();
    showScreen('screen-home');
    toast(t('toast.deleted'));
  }catch(e){toast(t('toast.deleteFail'));}
  finally{deletingNow=false;}
}

/* ---------- boot ----------
   Called by i18n.js once the market's packs are on window. Everything that
   used to run at parse time lives here, because none of it can run before
   the strings and the content exist. */
var App={
  boot:function(){
    document.querySelectorAll('.expand').forEach(function(e){
      e.innerHTML=EXPAND_SVG;e.setAttribute('role','button');e.setAttribute('aria-label',t('modal.help'));
      e.addEventListener('click',function(){openEditor(e);});
    });
    document.querySelectorAll('#chips .chip').forEach(function(c){c.textContent=t('chip.'+c.dataset.key);});
    pickPrivByVal('private');
    applyTheme();
    renderLanguageRows();
    renderAppearanceRows();
    buildPanduan();
    buildExampleGrid();
    bindAvatar();
    initAuth();   /* renders the account rows in Settings */
  }
};
