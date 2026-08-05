/* ---- store: Supabase config + swappable storage layer ---- */

/* ---------- CONFIG: paste your Supabase values, then deploy ---------- */
var SUPABASE_URL='https://qtgkwrkbmpuajaqweyta.supabase.co';
var SUPABASE_ANON_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0Z2t3cmtibXB1YWphcXdleXRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU5MDkxNTgsImV4cCI6MjEwMTQ4NTE1OH0.6Ayng7ns8ollk7DoIV8tVn5TnXUOWx7bZRA8jI1qjbM';

var SUPA_READY=(SUPABASE_URL.indexOf('YOUR-PROJECT')<0 && SUPABASE_ANON_KEY.indexOf('YOUR-ANON')<0 && typeof supabase!=='undefined');
var sb=null;
if(SUPA_READY){try{sb=supabase.createClient(SUPABASE_URL,SUPABASE_ANON_KEY);}catch(e){SUPA_READY=false;}}
var currentUser=null,pendingAction=null,currentSavedChar=null;

/* ---------- storage: Supabase when logged in, else localStorage (guest/preview) ---------- */
function rowToChar(r){return {id:r.id,name:r.name,score:r.score,values:r.values,savedAt:new Date(r.created_at).getTime()};}
var Store=(function(){
  var KEY='imely_chars_v1',mem=null;
  function lsRead(){if(mem!==null)return mem;try{var raw=localStorage.getItem(KEY);mem=raw?JSON.parse(raw):[];}catch(e){mem=[];}return mem;}
  function lsWrite(l){mem=l;try{localStorage.setItem(KEY,JSON.stringify(l));}catch(e){}}
  function online(){return SUPA_READY&&currentUser;}
  return {
    list:async function(){
      if(online()){try{var r=await sb.from('characters').select('*').order('created_at',{ascending:false});if(r.error)return [];return r.data.map(rowToChar);}catch(e){return [];}}
      return lsRead().slice().sort(function(a,b){return b.savedAt-a.savedAt;});
    },
    get:async function(id){
      if(online()){try{var r=await sb.from('characters').select('*').eq('id',id).single();return r.data?rowToChar(r.data):null;}catch(e){return null;}}
      var a=lsRead();for(var i=0;i<a.length;i++){if(a[i].id===id)return a[i];}return null;
    },
    save:async function(o){
      if(online()){
        var row={name:o.name,score:o.score,values:o.values};
        if(o.id){try{await sb.from('characters').update(row).eq('id',o.id);}catch(e){}return o.id;}
        row.user_id=currentUser.id;
        try{var r=await sb.from('characters').insert(row).select('id').single();return (r.data&&r.data.id)||null;}catch(e){return null;}
      }
      var a=lsRead(),f=-1;for(var i=0;i<a.length;i++){if(a[i].id===o.id){f=i;break;}}if(f>=0)a[f]=o;else a.push(o);lsWrite(a);return o.id;
    },
    remove:async function(id){
      if(online()){try{await sb.from('characters').delete().eq('id',id);}catch(e){}return;}
      lsWrite(lsRead().filter(function(c){return c.id!==id;}));
    }
  };
})();
