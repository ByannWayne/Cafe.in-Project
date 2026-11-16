// Halaman peta besar (Leaflet + peta dasar abu-abu terang), titik cafe berupa "pil" seperti Airbnb.

function viewMap(){
 S.map=null;root.innerHTML=`<div id="mapv"><div class="mtop"><button class="rb0" data-a="home" aria-label="Kembali">←</button><b id="mt" class="mtt">${S.pick?"Pilih lokasi cafe":"Peta cafe"}</b>${S.pick?"":`<button data-a="add">+ Tambah</button>`}</div><div id="mw"><div id="lm"></div>${S.pick?`<div id="hint">Ketuk peta untuk menaruh titik cafe</div>`:`<button id="area" class="pillb" data-a="area">Cari di area ini</button>${S.admin?`<button id="imp" class="pillb" style="top:64px;font-size:13px" data-a="import">Simpan cafe area ini ke database</button><button class="pillb" style="top:110px;font-size:13px" data-a="sql">Salin SQL area ini</button>`:""}`}<div class="mctl"><button class="rb0" data-a="me" aria-label="Ke lokasiku">➤</button><div class="zg"><button data-a="zin" aria-label="Perbesar">+</button><button data-a="zout" aria-label="Perkecil">−</button></div></div><div id="sheet"></div></div></div>`;drawMap();sheet()
}

function pillIcon(c,cls){const a=avg(c),nm=c.name.length>24?c.name.slice(0,23)+"…":c.name;return L.divIcon({className:"mk "+cls,html:"<span>"+esc(nm)+(a?" · ★ "+a.toFixed(1):"")+"</span>",iconSize:[0,0]})}

function drawMap(){
 if(!window.L){const e=$("#lm");if(e)e.innerHTML='<p style="padding:16px">Peta gagal dimuat. Cek koneksi internet.</p>';return}
 if(!S.map){const v=S.mv||(S.near?{c:[S.near.lat,S.near.lng],z:15}:{c:[-2.5,118],z:5});
  S.map=L.map("lm",{zoomControl:false}).setView(v.c,v.z);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19,attribution:"© OpenStreetMap"}).addTo(S.map);
  S.layer=L.layerGroup().addTo(S.map);
  S.map.on("moveend",()=>{const c=S.map.getCenter();S.mv={c:[c.lat,c.lng],z:S.map.getZoom()};clearTimeout(S.mt);S.mt=setTimeout(autoPull,700)});
  S.map.on("zoomend",()=>drawMap());
  S.map.on("click",e=>{if(S.pick){S.pt={lat:+e.latlng.lat.toFixed(5),lng:+e.latlng.lng.toFixed(5)};S.view="add";render()}else if(S.peek){S.peek=null;sheet();drawMap()}});
  setTimeout(()=>S.map&&S.map.invalidateSize(),150)}
 S.layer.clearLayers();
 const real=S.cafes.filter(c=>c.by!=="seed"),tt=$("#mt");if(tt&&!S.pick)tt.textContent=real.length+" cafe di peta";
 const ab=$("#area");if(ab)ab.textContent=S.busy?"Memuat cafe…":"Cari di area ini";
 const nn=S.near?[...S.cafes].sort((a,b)=>dm(a)-dm(b)).slice(0,3).map(c=>c.id):[],far=S.map.getZoom()<14;
 for(const c of S.cafes){const on=c.id===S.peek,nr=nn.includes(c.id);
  L.marker([c.lat,c.lng],{icon:pillIcon(c,(on?"on ":"")+(nr?"nr ":"")+(far&&!on&&!nr?"dot":"")),zIndexOffset:on?1000:nr?500:0})
   .on("click",e=>{L.DomEvent.stopPropagation(e);S.peek=c.id;S.pi=0;sheet();drawMap()}).addTo(S.layer)}
 if(S.near)L.marker([S.near.lat,S.near.lng],{icon:L.divIcon({className:"mk me",html:"<span></span>",iconSize:[0,0]}),interactive:false}).addTo(S.layer);
 if(S.pt)L.marker([S.pt.lat,S.pt.lng],{icon:L.divIcon({className:"mk on",html:"<span>Lokasi cafe</span>",iconSize:[0,0]}),interactive:false}).addTo(S.layer)}

function sheet(){const e=$("#sheet");if(!e)return;const c=S.cafes.find(x=>x.id===S.peek);if(!c||S.pick){e.style.display="none";return}
 const ph=c.photos||[],i=Math.min(S.pi||0,Math.max(ph.length-1,0)),a=avg(c),n=Object.keys(c.ratings||{}).length;
 e.style.display="block";
 e.innerHTML=`<div class="mc"><div class="mci" style="${ph[i]?`background-image:url(${esc(ph[i])})`:""}">${ph[i]?"":`<span class="em">☕</span>`}<button class="mcb x1" data-a="mcx" aria-label="Tutup">×</button><button class="mcb hr1" data-a="fav" data-id="${esc(c.id)}" aria-label="Simpan cafe">${S.fav.includes(c.id)?"♥":"♡"}</button>${ph.length>1?`<button class="mcb pv" data-a="mnx" data-d="-1" aria-label="Foto sebelumnya">‹</button><button class="mcb nx" data-a="mnx" data-d="1" aria-label="Foto berikutnya">›</button><div class="dots">${ph.map((_,k)=>`<i class="${k===i?"on":""}"></i>`).join("")}</div>`:""}</div><div class="mcb2"><div class="row" style="justify-content:space-between;flex-wrap:nowrap"><b class="mcn">${esc(c.name)}</b><span style="white-space:nowrap">${a?"★ "+a.toFixed(2)+" ("+n+")":"Baru"}</span></div><div class="mute">${esc(c.city)} · ${BUD[c.budget]||"Budget belum diisi"}${S.near?" · "+dtxt(c):""}</div><div class="row" style="margin-top:10px"><button class="p" data-a="open" data-id="${esc(c.id)}">Lihat detail</button><a href="https://www.google.com/maps/search/?api=1&query=${c.lat},${c.lng}" target="_blank" rel="noopener"><button>Google Maps</button></a></div></div></div>`}
