// Login, peran (user/admin), dan penjaga aksi yang butuh login.

function gate(fn){if(S.user)return fn();S.pend=fn;S.sent="";S.prev=S.view;S.view="login";render()}

async function loadRole(id){try{const r=await sb.from("profiles").select("role").eq("id",id).single();S.admin=!r.error&&!!r.data&&r.data.role==="admin"}catch(x){S.admin=false}upd()}

function initAuth(){if(!sb)return;const set=s=>{const u=s&&s.user;S.uid=u?u.id:"tamu";S.user=u?(u.email||"akun").split("@")[0]:"";S.email=u?(u.email||""):"";if(!u)S.admin=false;else loadRole(u.id)};
 sb.auth.getSession().then(r=>{set(r.data&&r.data.session);upd()});
 sb.auth.onAuthStateChange((ev,s)=>{set(s);upd()})}
