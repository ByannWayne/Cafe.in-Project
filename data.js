// Data: ambil cafe dari OpenStreetMap, baca/tulis Supabase, gabungkan jadi daftar cafe.

function getLoc(){const dflt=()=>pull("around:5000,-6.2088,106.8456");if(!navigator.geolocation){S.loc="no";dflt();return}S.loc="ask";navigator.geolocation.getCurrentPosition(p=>{S.near={lat:p.coords.latitude,lng:p.coords.longitude};S.loc="ok";if(S.map)S.map.setView([S.near.lat,S.near.lng],15);pull("around:5000,"+S.near.lat+","+S.near.lng)},()=>{S.loc="denied";dflt()},{timeout:15000})}

function region(a,g){let b="Lainnya",m=40;for(const k in CEN){const d=km(g,a,CEN[k][1],CEN[k][0]);if(d<m){m=d;b=k}}return b}

function fromOsm(e){const t=e.tags||{},la=e.lat??e.center.lat,ln=e.lon??e.center.lon;
 return{id:"osm"+e.type[0]+e.id,name:t.name,city:region(la,ln),budget:"",address:[t["addr:street"],t["addr:housenumber"],t["addr:city"]].filter(Boolean).join(" "),
 desc:"Cafe terdaftar di OpenStreetMap."+(t.cuisine?" Sajian: "+t.cuisine+".":"")+" Menu dan foto belum ada, tambahkan lewat tombol di bawah.",phone:t.phone||t["contact:phone"]||"",website:t.website||t["contact:website"]||(t["contact:instagram"]?"@"+t["contact:instagram"].replace(/^@/,""):""),hours:t.opening_hours||"",features:[/^(wlan|wifi|yes)$/.test(t.internet_access||"")?"WiFi":"",t.outdoor_seating==="yes"?"Area outdoor":"",t.indoor_seating==="yes"?"Indoor":"",/^(yes|only)$/.test(t.takeaway||"")?"Bawa pulang":"",t.air_conditioning==="yes"?"AC":"",t.wheelchair==="yes"?"Ramah kursi roda":""].filter(Boolean),
 lat:la,lng:ln,menu:[],photos:[],ratings:{},video:"",by:"osm"}}

async function pull(q){S.busy=true;S.err="";S.tryN=1;upd();let why="",ok=false;
 const qs=`[out:json][timeout:25];(node["amenity"="cafe"]["name"](${q});way["amenity"="cafe"]["name"](${q}););out center 120;`;
 const one=async u=>{const ac=new AbortController(),t=setTimeout(()=>ac.abort(),25000);
  try{const r=await fetch(u,{method:"POST",signal:ac.signal,headers:{"Content-Type":"application/x-www-form-urlencoded"},body:"data="+encodeURIComponent(qs)});
   if(!r.ok)throw new Error("HTTP "+r.status);const j=await r.json();if(!j.elements)throw new Error("respon kosong");return j}
  finally{clearTimeout(t)}};
 for(let k=0;k<3&&!ok;k++){
  if(k){S.tryN=k+1;upd();await new Promise(r=>setTimeout(r,3000*k))}
  try{const j=await Promise.any(OVP.map(one));
   for(const e of j.elements){const id="osm"+e.type[0]+e.id;if(!S.osm.some(c=>c.id===id))S.osm.push(fromOsm(e))}
   persist();build();ok=true}
  catch(x){why=(x.errors||[x]).map(e=>e.name==="AbortError"?"waktu habis":e.message).join(", ")}}
 S.tryN=0;
 if(!ok){build();const have=S.cafes.some(c=>c.by!=="seed");S.err="Server OpenStreetMap sedang sibuk ("+why+"). "+(have?"Cafe yang sudah tersimpan tetap ditampilkan.":"Sementara yang tampil data contoh.")}
 S.busy=false;upd()}

// Khusus admin: simpan cafe OpenStreetMap di area peta ke database, supaya semua pengguna memuatnya dari database.
async function importArea(){const m=S.map;if(!m||!sb||!S.admin)return;const b=m.getBounds(),s=b.getSouth(),w=b.getWest(),n=b.getNorth(),e=b.getEast();
 const list=S.cafes.filter(c=>!c.dbId&&c.by==="osm"&&c.lat>=s&&c.lat<=n&&c.lng>=w&&c.lng<=e);
 if(!list.length)return alert("Tidak ada cafe OpenStreetMap baru di area ini. Zoom ke level kecamatan atau kota, tekan “Cari di area ini”, tunggu sampai titiknya muncul, lalu coba lagi.");
 if(!confirm("Simpan "+list.length+" cafe di area peta ini ke database? Setelah itu semua pengguna memuatnya langsung dari database, tanpa menunggu server OpenStreetMap."))return;
 const rows=list.map(c=>({osm_id:c.id,name:c.name.slice(0,80),city:c.city,address:c.address||null,description:c.desc||null,phone:c.phone||null,website:c.website||null,hours:c.hours||null,features:c.features||[],lat:c.lat,lng:c.lng}));
 const btn=$("#imp");
 try{for(let i=0;i<rows.length;i+=100){if(btn)btn.textContent="Menyimpan "+Math.min(i+100,rows.length)+" dari "+rows.length+"…";const r=await sb.from("cafes").upsert(rows.slice(i,i+100),{onConflict:"osm_id",ignoreDuplicates:true});if(r.error)throw r.error}
  await loadDb();alert(rows.length+" cafe tersimpan ke database.")}
 catch(x){alert("Gagal menyimpan: "+(x.message||x))}
 if(btn)btn.textContent="Simpan cafe area ini ke database"}

function autoPull(){const m=S.map;if(!m||S.pick||S.busy||m.getZoom()<14)return;const c=m.getCenter();if(S.lc&&km(S.lc.lng,S.lc.lat,c.lng,c.lat)<0.8)return;S.lc={lat:c.lat,lng:c.lng};const b=m.getBounds();pull([b.getSouth(),b.getWest(),b.getNorth(),b.getEast()].join(","))}

function areaPull(){const m=S.map;if(!m)return;if(m.getZoom()<13)return alert("Zoom lebih dekat dulu (zoom ke level kota/kecamatan), lalu cari lagi.");const b=m.getBounds();pull([b.getSouth(),b.getWest(),b.getNorth(),b.getEast()].join(","))}

async function ensureDb(c){if(c.dbId)return c.dbId;if(c.by==="seed")throw new Error("Ini data contoh, belum bisa diubah. Pakai cafe asli dari OpenStreetMap.");
 let r=await sb.from("cafes").upsert({osm_id:c.id,phone:c.phone||null,website:c.website||null,hours:c.hours||null,features:c.features||[],name:c.name.slice(0,80),city:c.city,address:c.address||null,description:c.desc||null,lat:c.lat,lng:c.lng},{onConflict:"osm_id",ignoreDuplicates:true});if(r.error)throw r.error;
 r=await sb.from("cafes").select("id").eq("osm_id",c.id).single();if(r.error)throw r.error;return r.data.id}

function persist(){try{localStorage.setItem("ci_osm",JSON.stringify(S.osm))}catch(x){}}

function pubUrl(p){return sb.storage.from("cafe-photos").getPublicUrl(p).data.publicUrl}

function build(){const by={},osm={},L=[];
 for(const r of S.db.cafes){const c={id:r.id,dbId:r.id,name:r.name,city:r.city||"Lainnya",budget:r.budget||"",address:r.address||"",desc:r.description||"",video:r.video||"",lat:r.lat,lng:r.lng,by:r.created_by,phone:r.phone||"",website:r.website||"",hours:r.hours||"",features:r.features||[],reviews:[],menu:[],photos:[],pm:[],menuPh:[],mpm:[],ratings:{}};by[r.id]=c;if(r.osm_id)osm[r.osm_id]=c;L.push(c)}
 for(const m of S.db.menu)if(by[m.cafe_id])by[m.cafe_id].menu.push({id:m.id,n:m.name,p:m.price||0,by:m.created_by});
 for(const p of S.db.photos)if(by[p.cafe_id]){const t=p.kind==="menu",c=by[p.cafe_id];(t?c.menuPh:c.photos).push(pubUrl(p.path));(t?c.mpm:c.pm).push({id:p.id,path:p.path,by:p.created_by})}
 for(const r of S.db.ratings)if(by[r.cafe_id]){by[r.cafe_id].ratings[r.user_id]=r.stars;by[r.cafe_id].reviews.push(r)}
 for(const o of S.osm){const m=osm[o.id];if(m){m.desc=m.desc||o.desc;m.address=m.address||o.address;m.phone=m.phone||o.phone;m.website=m.website||o.website;m.hours=m.hours||o.hours;m.features=[...new Set([...(m.features||[]),...(o.features||[])])]}else L.push(o)}
 S.cafes=L.length?L:SEED.map(c=>({...c}))}

async function loadDb(){if(!sb)return;try{const q=t=>sb.from(t).select("*").limit(1000);const R=await Promise.all([q("cafes"),q("menu_items"),q("photos"),q("ratings")]);const e=R.find(x=>x.error);if(e)throw e.error;S.db={cafes:R[0].data,menu:R[1].data,photos:R[2].data,ratings:R[3].data};S.dbErr=""}catch(x){S.dbErr="Tidak bisa terhubung ke database ("+(x.message||"error")+")."}build();upd()}
