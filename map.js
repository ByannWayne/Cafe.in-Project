// Halaman peta besar (Leaflet + OpenStreetMap).

function viewMap(){
 S.map=null;root.innerHTML=`<div id="mapv"><div class="bar"><button data-a="home">← Kembali</button><b id="mt" style="flex:1">${S.pick?"Pilih lokasi cafe":"Cari di peta"}</b>${S.pick?"":`<button data-a="add">+ Tambah</button>`}</div><div id="mw"><div id="lm" style="position:absolute;inset:0"></div>${S.pick?`<div id="hint">Ketuk peta untuk menaruh titik</div>`:""}<div class="ctl"><button data-a="me" style="width:auto;padding:0 10px;font-size:13px">Lokasiku</button>${S.pick?"":`<button data-a="area" style="width:auto;padding:0 10px;font-size:13px">Cari di area ini</button>`}</div><div id="sheet"></div></div></div>`;drawMap();sheet();return
}

function drawMap(){
 if(!window.L){const e=$("#lm");if(e)e.innerHTML='<p style="padding:16px">Peta gagal dimuat. Cek koneksi internet.</p>';return}
 if(!S.map){const v=S.mv||(S.near?{c:[S.near.lat,S.near.lng],z:15}:{c:[-2.5,118],z:5});
  S.map=L.map("lm").setView(v.c,v.z);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19,attribution:"© OpenStreetMap"}).addTo(S.map);
  S.layer=L.layerGroup().addTo(S.map);
  S.map.on("moveend",()=>{const c=S.map.getCenter();S.mv={c:[c.lat,c.lng],z:S.map.getZoom()};clearTimeout(S.mt);S.mt=setTimeout(autoPull,700)});
  S.map.on("click",e=>{if(S.pick){S.pt={lat:+e.latlng.lat.toFixed(5),lng:+e.latlng.lng.toFixed(5)};S.view="add";render()}else{S.peek=null;sheet();drawMap()}});
  setTimeout(()=>S.map&&S.map.invalidateSize(),150)}
 S.layer.clearLayers();const tt=document.querySelector("#mt");if(tt&&!S.pick)tt.textContent="Cari di peta · "+S.cafes.filter(c=>c.by!=="seed").length+" cafe"+(S.busy?" · memuat…":"");
 const nn=S.near?[...S.cafes].sort((a,b)=>dm(a)-dm(b)).slice(0,3).map(c=>c.id):[];
 for(const c of S.cafes){const n=nn.includes(c.id),on=c.id===S.peek;
  L.circleMarker([c.lat,c.lng],{radius:n||on?11:9,color:n?"#888":"#fff",weight:n?4:2,fillColor:on?"#888":"#111",fillOpacity:.95}).on("click",e=>{L.DomEvent.stopPropagation(e);S.peek=c.id;sheet();drawMap()}).bindTooltip(esc(c.name)).addTo(S.layer)}
 if(S.near)L.circleMarker([S.near.lat,S.near.lng],{radius:7,color:"#fff",weight:3,fillColor:"#555",fillOpacity:1}).addTo(S.layer);
 if(S.pt)L.circleMarker([S.pt.lat,S.pt.lng],{radius:9,color:"#111",weight:3,fillOpacity:0}).addTo(S.layer)}

function sheet(){const e=$("#sheet");if(!e)return;const c=S.cafes.find(x=>x.id===S.peek);if(!c||S.pick){e.style.display="none";return}e.style.display="block";e.innerHTML=`<b>${esc(c.name)}</b> <span class="mute">${esc(c.city)}${S.near?" · "+dtxt(c):""}</span><div class="row" style="margin-top:8px"><button class="p" data-a="open" data-id="${esc(c.id)}">Lihat detail</button><a href="https://www.google.com/maps/search/?api=1&query=${c.lat},${c.lng}" target="_blank" rel="noopener"><button>Google Maps</button></a></div>`}
