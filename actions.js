// Semua klik, ketikan, dan perubahan input dari pengguna.

root.addEventListener("click",async e=>{const b=e.target.closest("[data-a]");if(!b){if(S.menu){S.menu=false;const m=document.querySelector(".um");if(m)m.remove()}return}if(S.menu&&b.dataset.a!=="user"&&b.dataset.a!=="logout")S.menu=false;const a=b.dataset.a;
 if(a==="login"){S.pend=null;S.sent="";S.prev=S.view;S.view="login";render()}
 else if(a==="dologin"){const em=($("#un").value||"").trim();if(!/^\S+@\S+\.\S+$/.test(em))return alert("Isi email yang valid.");if(!sb)return alert("Layanan login belum siap. Muat ulang halaman.");b.disabled=true;const r=await sb.auth.signInWithOtp({email:em,options:{emailRedirectTo:location.origin+location.pathname}});if(r.error){b.disabled=false;return alert("Gagal mengirim link: "+r.error.message)}S.sent=em;render()}
 else if(a==="user"){S.menu=!S.menu;render()}
 else if(a==="logout"){try{await sb.auth.signOut()}catch(x){}S.user="";S.email="";S.admin=false;S.uid="tamu";S.menu=false;render()}
 else if(a==="retry2")loadDb()
 else if(a==="rs"){const k=b.dataset.k,s=+b.dataset.s;S.rv[k]=S.rv[k]===s?0:s;b.parentElement.querySelectorAll("button").forEach(x=>x.classList.toggle("on",+x.dataset.s<=S.rv[k]))}
 else if(a==="sendrv"){gate(async()=>{const t=document.getElementById("rt");if(t)S.rv.text=t.value;if(!S.rv.stars)return alert("Pilih bintang keseluruhan dulu.");const c=S.cafes.find(x=>x.id===S.sel);if(!c||!sb)return;try{const id=await ensureDb(c);const r=await sb.from("ratings").upsert({cafe_id:id,user_id:S.uid,stars:S.rv.stars,service:S.rv.service||null,food:S.rv.food||null,worth:S.rv.worth||null,comment:(S.rv.text||"").trim().slice(0,1000)||null,author:S.user.slice(0,2)+"•••"},{onConflict:"cafe_id,user_id"});if(r.error)throw r.error;S.sel=id;S.rvFor=null;await loadDb();render()}catch(e){alert("Gagal menyimpan ulasan: "+(e.message||e))}})}
 else if(a==="delrv"){const c=S.cafes.find(x=>x.id===S.sel);if(!c||!c.dbId||!confirm("Hapus ulasan ini?"))return;const r=await sb.from("ratings").delete().eq("cafe_id",c.dbId).eq("user_id",b.dataset.u);if(r.error)return alert("Gagal menghapus: "+r.error.message);S.rvFor=null;await loadDb()}
 else if(a==="users"){S.menu=false;S.view="users";S.users=null;render();const r=await sb.from("profiles").select("email,role,created_at").order("created_at");if(r.error)alert("Gagal memuat: "+r.error.message);S.users=r.error?[]:r.data;render()}
 else if(a==="delcafe"){const c=S.cafes.find(x=>x.id===S.sel);if(!c||!c.dbId)return;if(!confirm("Hapus cafe ini beserta semua foto, menu, dan ratingnya? Kalau cafe ini berasal dari OpenStreetMap, hanya data tambahan dari Cafe.in yang terhapus."))return;const paths=(c.pm||[]).concat(c.mpm||[]).map(x=>x.path);const r=await sb.from("cafes").delete().eq("id",c.dbId);if(r.error)return alert("Gagal menghapus: "+r.error.message);try{if(paths.length)await sb.storage.from("cafe-photos").remove(paths)}catch(x){}S.view="home";S.sel=null;await loadDb();render()}
 else if(a==="delm"){if(!confirm("Hapus menu ini?"))return;const r=await sb.from("menu_items").delete().eq("id",b.dataset.id);if(r.error)return alert("Gagal menghapus: "+r.error.message);await loadDb()}
 else if(a==="delph"){if(!confirm("Hapus foto ini?"))return;const c=S.cafes.find(x=>x.id===S.sel),m=c&&(c.pm||[]).concat(c.mpm||[]).find(x=>x.id===b.dataset.id);if(!m)return;const r=await sb.from("photos").delete().eq("id",m.id);if(r.error)return alert("Gagal menghapus: "+r.error.message);try{await sb.storage.from("cafe-photos").remove([m.path])}catch(x){}await loadDb()}
 else if(a==="fav"){const id=b.dataset.id,k=S.fav.indexOf(id);k<0?S.fav.push(id):S.fav.splice(k,1);try{localStorage.setItem("ci_fav",JSON.stringify(S.fav))}catch(x){}b.textContent=S.fav.includes(id)?"♥":"♡"}
 else if(a==="sl"){b.closest(".sec").querySelector(".rs").scrollBy({left:+b.dataset.d*480,behavior:"smooth"})}
 else if(a==="reg"){S.region=b.dataset.r;S.fo=false;render();scrollTo(0,0)}
 else if(a==="reset"){S.region="Semua";S.budget="Semua";S.q="";render()}
 else if(a==="home"){S.view="home";S.pick=false;S.editId=null;render()}
 else if(a==="open"){S.sel=b.dataset.id;S.view="detail";S.pick=false;render();scrollTo(0,0)}
 else if(a==="fo"){S.fo=!S.fo;render()}
 else if(a==="bud"){S.budget=b.dataset.k;render()}
 else if(a==="loc"){getLoc();render()}
 else if(a==="map"){S.view="map";S.peek=null;S.pick=false;render()}
 else if(a==="add"){gate(()=>{S.draft={};S.pt=null;S.photos=[];S.mphotos=[];S.editId=null;S.view="add";render()})}
 else if(a==="edit"){gate(()=>{const c=S.cafes.find(x=>x.id===S.sel);S.draft={menu:""};S.pt={lat:c.lat,lng:c.lng};S.photos=[];S.mphotos=[];S.editId=c.id;S.view="add";render()})}
 else if(a==="useme"){collect();if(S.near){S.pt={lat:+S.near.lat.toFixed(5),lng:+S.near.lng.toFixed(5)};render()}else alert("Lokasimu belum tersedia. Izinkan akses lokasi dulu.")}
 else if(a==="pickmap"){collect();S.pick=true;S.view="map";render()}
 else if(a==="save")save();
 else if(a==="area")areaPull();
 else if(a==="retry")getLoc();
 else if(a==="me"){if(S.near&&S.map)S.map.setView([S.near.lat,S.near.lng],15);else{getLoc();alert("Mengambil lokasi… izinkan akses lokasi di browser.")}}});

root.addEventListener("input",e=>{if(e.target.id==="q"){S.q=e.target.value;const p=e.target.selectionStart;render();const n=$("#q");n.focus();n.setSelectionRange(p,p)}});

root.addEventListener("change",async e=>{if(e.target.id==="fr"){S.region=e.target.value;render()}if(e.target.id==="ph"){collect();S.photos=[];for(const f of[...e.target.files].slice(0,3))S.photos.push(await shrink(f));render()}
if(e.target.id==="mph"){collect();S.mphotos=[];for(const f of[...e.target.files].slice(0,3))S.mphotos.push(await shrink(f,1200));render()}});

addEventListener("resize",()=>{S.map&&S.map.invalidateSize()});
