/* ---------- auth (magic link) ---------- */
async function initAuth(){
  if(!SUPA_READY){renderAccount();buildSavedShelf();return;}
  try{var r=await sb.auth.getSession();currentUser=r.data.session?r.data.session.user:null;}catch(e){currentUser=null;}
  renderAccount();buildSavedShelf();
  sb.auth.onAuthStateChange(function(_e,session){currentUser=session?session.user:null;renderAccount();buildSavedShelf();
    if(currentUser&&pendingAction){var fn=pendingAction;pendingAction=null;fn();}});
}
function renderAccount(){
  var a=document.getElementById('acctArea');if(!a)return;
  if(!SUPA_READY){a.innerHTML='';return;}
  if(currentUser){
    var em=currentUser.email||'akun';var ini=(em[0]||'?').toUpperCase();
    a.innerHTML='<div class="acct-wrap"><button class="avatar-btn" onclick="toggleAcctMenu()">'+ini+'</button>'+
      '<div class="acct-menu" id="acctMenu" hidden><p class="acct-email">'+escHtml(em)+'</p><button class="acct-signout" onclick="signOut()">Keluar</button></div></div>';
  }else{a.innerHTML='<button class="masuk-btn" onclick="openSignin()">Masuk</button>';}
}
function toggleAcctMenu(){var m=document.getElementById('acctMenu');if(!m)return;if(m.hidden){openAcctMenu(m);}else{closeAcctMenu();}}
function openAcctMenu(m){
  m.hidden=false;
  setTimeout(function(){
    document.addEventListener('click',acctOutside,true);
    var sc=document.getElementById('screen-home');if(sc)sc.addEventListener('scroll',closeAcctMenu,{passive:true});
    window.addEventListener('scroll',closeAcctMenu,{passive:true});
  },0);
}
function closeAcctMenu(){
  var m=document.getElementById('acctMenu');if(m)m.hidden=true;
  document.removeEventListener('click',acctOutside,true);
  var sc=document.getElementById('screen-home');if(sc)sc.removeEventListener('scroll',closeAcctMenu);
  window.removeEventListener('scroll',closeAcctMenu);
}
function acctOutside(e){var w=document.querySelector('.acct-wrap');if(w&&!w.contains(e.target))closeAcctMenu();}
async function signOut(){closeAcctMenu();if(SUPA_READY){try{await sb.auth.signOut();}catch(e){}}currentUser=null;renderAccount();buildSavedShelf();showScreen('screen-home');toast('Keluar');}
var SIGNIN_FORM='<p class="signin-lead">Masuk pakai email & password yang dikasih. Baca panduan & contoh tetap bebas tanpa masuk.</p><input class="signin-email" id="signinEmail" type="email" placeholder="email kamu" autocomplete="email"><input class="signin-email" id="signinPass" type="password" placeholder="password" autocomplete="current-password"><button class="submit" onclick="signIn()">Masuk</button>';
function openSignin(){document.getElementById('signinBody').innerHTML=SIGNIN_FORM;document.getElementById('signinSheet').hidden=false;}
function closeSignin(){document.getElementById('signinSheet').hidden=true;}
async function signIn(){
  var email=(document.getElementById('signinEmail').value||'').trim();
  var pass=document.getElementById('signinPass').value||'';
  if(!email||!pass){toast('Isi email & password');return;}
  if(!SUPA_READY){closeSignin();toast('Mode demo: login dilewati');if(pendingAction){var fn=pendingAction;pendingAction=null;fn();}return;}
  try{var r=await sb.auth.signInWithPassword({email:email,password:pass});
    if(r.error){toast('Email atau password salah');return;}
    closeSignin();
  }catch(e){toast('Gagal masuk');}
}
function requireAuth(fn){if(!SUPA_READY||currentUser){fn();return;}pendingAction=fn;openSignin();}
function tryBuat(){requireAuth(function(){loadForm('empty');});}
