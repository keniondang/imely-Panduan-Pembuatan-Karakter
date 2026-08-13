/* ---- auth: email + password sign-in. All strings via t(). ---- */

/* ---------- session bootstrap ---------- */
async function initAuth(){
  if(!SUPA_READY){renderAccount();buildSavedShelf();return;}
  try{var r=await sb.auth.getSession();currentUser=r.data.session?r.data.session.user:null;}catch(e){currentUser=null;}
  renderAccount();buildSavedShelf();
  sb.auth.onAuthStateChange(function(_e,session){currentUser=session?session.user:null;renderAccount();buildSavedShelf();});
}
/* The account block lives in the Settings screen now, not the header. */
function renderAccount(){
  var box=document.getElementById('setAccount');if(!box)return;
  if(!SUPA_READY){
    box.innerHTML='<div class="set-row"><div class="set-main"><strong>'+escHtml(t('settings.demo'))+'</strong><small>'+escHtml(t('settings.demo.desc'))+'</small></div></div>';
    return;
  }
  if(currentUser){
    var em=currentUser.email||t('auth.account');var ini=(em[0]||'?').toUpperCase();
    box.innerHTML='<div class="set-row"><span class="set-ava">'+escHtml(ini)+'</span><div class="set-main"><span class="set-email">'+escHtml(em)+'</span></div></div>'+
      '<button class="set-row danger" onclick="signOut()">'+escHtml(t('auth.signOut'))+'</button>';
  }else{
    box.innerHTML='<button class="set-row" onclick="openSignin()"><div class="set-main"><strong>'+escHtml(t('auth.signIn'))+'</strong><small>'+escHtml(t('settings.signedOut'))+'</small></div>'+
      '<svg class="tick" style="display:block;color:var(--chev)" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M9 6l6 6-6 6"/></svg></button>';
  }
}
var signingOut=false;
async function signOut(){
  if(signingOut)return;
  signingOut=true;
  currentUser=null;renderAccount();buildSavedShelf();showScreen('screen-home');toast(t('toast.signedOut'));
  if(SUPA_READY){try{await sb.auth.signOut();}catch(e){}}
  signingOut=false;
}
function signinForm(){
  return '<p class="signin-lead">'+escHtml(t('auth.lead'))+'</p>'+
    '<input class="signin-email" id="signinEmail" type="email" placeholder="'+escHtml(t('auth.email.ph'))+'" autocomplete="email">'+
    '<input class="signin-email" id="signinPass" type="password" placeholder="'+escHtml(t('auth.pass.ph'))+'" autocomplete="current-password">'+
    '<button class="submit" onclick="signIn()">'+escHtml(t('auth.signIn'))+'</button>';
}
/* Remembers where the sheet was opened from, so signing in from Settings
   returns to Settings rather than dumping the user on Home. */
var cameFromSettings=false;
function openSignin(){
  cameFromSettings=!document.getElementById('screen-settings').hidden;
  document.getElementById('signinBody').innerHTML=signinForm();
  document.getElementById('signinSheet').hidden=false;
}
function closeSignin(){document.getElementById('signinSheet').hidden=true;}
var signingIn=false;
async function signIn(){
  if(signingIn)return;
  var email=(document.getElementById('signinEmail').value||'').trim();
  var pass=document.getElementById('signinPass').value||'';
  if(!email||!pass){toast(t('toast.needCreds'));return;}
  var btn=document.querySelector('#signinBody .submit');
  signingIn=true;if(btn){btn.disabled=true;btn.textContent=t('auth.signingIn');}
  try{
    if(!SUPA_READY){closeSignin();showScreen(cameFromSettings?'screen-settings':'screen-home');toast(t('toast.demoLogin'));return;}
    var r=await sb.auth.signInWithPassword({email:email,password:pass});
    if(r.error){toast(t('toast.badCreds'));return;}
    closeSignin();showScreen(cameFromSettings?'screen-settings':'screen-home');
  }catch(e){toast(t('toast.signInFail'));}
  finally{signingIn=false;if(btn){btn.disabled=false;btn.textContent=t('auth.signIn');}}
}
function requireAuth(fn){if(!SUPA_READY||currentUser){fn();return;}openSignin();}
function tryBuat(){requireAuth(function(){loadForm('empty');});}