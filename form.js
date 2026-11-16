// Form tambah cafe / tambah menu & foto, plus proses simpan ke Supabase.

function viewAdd(){
 const d=S.draft;root.innerHTML=`<div class="wrap"><button data-a="home">← Batal</button><h1 style="margin-top:12px">${S.editId?"Tambah menu &amp; foto":"Tambah cafe"}</h1>
 ${S.editId?"<div hidden>":""}<label>Nama cafe</label><input id="n" type="text" maxlength="60" value="${esc(d.name)}">
 <label>Daerah</label><select id="r">${REG.map(r=>`<option ${r===(d.city||"Jakarta")?"selected":""}>${r}</option>`).join("")}</select>
 <label>Budget</label><select id="b">${Object.entries(BUD).map(([k,v])=>`<option value="${k}" ${k===(d.budget||"menengah")?"selected":""}>${v}</option>`).join("")}</select>
 <label>Alamat</label><input id="ad" type="text" maxlength="120" value="${esc(d.address)}"><label>Telepon</label><input id="tel" type="text" maxlength="30" value="${esc(d.phone)}"><label>Website atau Instagram</label><input id="web" type="text" maxlength="120" value="${esc(d.website)}"><label>Jam buka (contoh: Senin-Jumat 08.00-22.00)</label><input id="hrs" type="text" maxlength="120" value="${esc(d.hours)}"><label>Fasilitas</label><div class="row chips">${FEAT.map(f=>`<label style="margin:0;display:flex;gap:4px;align-items:center;color:var(--ink)"><input type="checkbox" class="ft" value="${f}" ${(d.features||[]).includes(f)?"checked":""}> ${f}</label>`).join("")}</div>
 <label>Deskripsi lengkap</label><textarea id="d" maxlength="600">${esc(d.desc)}</textarea>
 ${S.editId?"</div>":""}<label>Foto menu (maks 3, foto daftar menu cafe)</label><input id="mph" type="file" accept="image/*" multiple><div class="photos">${S.mphotos.map(p=>`<img src="${p}" alt="">`).join("")}</div>
 <label>Foto cafe (maks 3)</label><input id="ph" type="file" accept="image/*" multiple><div class="photos">${S.photos.map(p=>`<img src="${p}" alt="">`).join("")}</div>
 ${S.editId?"<div hidden>":""}<label>Link video</label><input id="v" type="url" placeholder="https://" value="${esc(d.video)}">
 <label>Lokasi</label><div class="row"><button data-a="useme">Pakai lokasi saya</button><button data-a="pickmap">Pilih di peta</button><span class="mute">${S.pt?S.pt.lat+", "+S.pt.lng:"belum dipilih"}</span></div>
 ${S.editId?"</div>":""}<div class="row" style="margin-top:18px"><button class="p" data-a="save">Simpan cafe</button></div></div>`;return
}

function collect(){const g=i=>{const e=document.getElementById(i);return e?e.value:""};S.draft={name:g("n"),city:g("r"),budget:g("b"),address:g("ad"),desc:g("d"),menu:g("m"),video:g("v"),phone:g("tel"),website:g("web"),hours:g("hrs"),features:[...document.querySelectorAll(".ft:checked")].map(x=>x.value)}}

function shrink(f,mx){return new Promise(r=>{const i=new Image();i.onload=()=>{const s=Math.min(1,(mx||800)/Math.max(i.width,i.height)),c=document.createElement("canvas");c.width=i.width*s;c.height=i.height*s;c.getContext("2d").drawImage(i,0,0,c.width,c.height);r(c.toDataURL("image/jpeg",.7))};i.src=URL.createObjectURL(f)})}

async function save(){collect();const d=S.draft;
 if(!S.editId){if(!d.name.trim())return alert("Nama cafe wajib diisi.");if(!S.pt)return alert("Pilih lokasi dulu.")}
 if(!sb||!S.user)return alert("Belum terhubung ke database atau belum login.");
 const menu=d.menu.split("\n").map(l=>l.trim()).filter(Boolean).map(l=>{const i=l.lastIndexOf("-");const p=i>0?l.slice(i+1).replace(/\D/g,""):"";return{n:(i>0?l.slice(0,i):l).trim(),p:p?+p:0}});
 const btn=document.querySelector('[data-a="save"]');if(btn){btn.disabled=true;btn.textContent="Menyimpan…"}
 try{let id;
  if(S.editId){id=await ensureDb(S.cafes.find(x=>x.id===S.editId))}
  else{const r=await sb.from("cafes").insert({name:d.name.trim().slice(0,80),city:d.city||"Jakarta",budget:d.budget||"menengah",address:d.address.trim(),description:d.desc.trim(),video:d.video.trim(),phone:(d.phone||"").trim()||null,website:(d.website||"").trim()||null,hours:(d.hours||"").trim()||null,features:d.features||[],lat:S.pt.lat,lng:S.pt.lng}).select("id").single();if(r.error)throw r.error;id=r.data.id}
  if(menu.length){const r=await sb.from("menu_items").insert(menu.map(m=>({cafe_id:id,name:m.n.slice(0,80),price:m.p})));if(r.error)throw r.error}
  for(const [p,kind] of [...S.photos.slice(0,3).map(p=>[p,"cafe"]),...S.mphotos.slice(0,3).map(p=>[p,"menu"])]){const bl=await (await fetch(p)).blob(),path=id+"/"+Date.now()+Math.random().toString(36).slice(2,7)+".jpg";const u=await sb.storage.from("cafe-photos").upload(path,bl,{contentType:"image/jpeg"});if(u.error)throw u.error;const r=await sb.from("photos").insert({cafe_id:id,path,kind});if(r.error)throw r.error}
  S.sel=id;await loadDb();S.editId=null;S.draft={};S.pt=null;S.photos=[];S.mphotos=[];S.view="detail";render()}
 catch(e){alert("Gagal menyimpan: "+(e.message||e));render()}}
