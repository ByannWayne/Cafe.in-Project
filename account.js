// Halaman login dan halaman daftar pengguna (admin).

function viewLogin(){
 root.innerHTML=`<div class="wrap" style="max-width:420px"><button data-a="home">← Kembali</button><h1 style="margin-top:20px">Masuk ke Cafe.in</h1><p class="mute">Login dibutuhkan untuk menambah cafe, mengisi menu dan foto, serta memberi rating. Cuma lihat-lihat cafe tidak perlu login.</p>${S.sent?`<div class="banner">Link masuk sudah dikirim ke <b>${esc(S.sent)}</b>. Buka email kamu lalu klik linknya (cek folder spam juga). Setelah diklik, halaman ini terbuka lagi dalam keadaan login.</div>`:`<label for="un">Email</label><input id="un" type="email" autocomplete="email" placeholder="nama@email.com"><div class="row" style="margin-top:16px"><button class="p" data-a="dologin" style="flex:1;padding:13px">Kirim link masuk</button></div><p class="mute" style="font-size:12px;margin-top:14px">Tanpa password. Kami kirim link sekali pakai ke email kamu.</p>`}</div>`;return
}

function viewUsers(){
 root.innerHTML=`<div class="wrap" style="max-width:640px"><button data-a="home">← Kembali</button><h1 style="margin-top:16px">Pengguna terdaftar</h1><p class="mute">${S.users?S.users.length+" akun":"Memuat…"}</p>${(S.users||[]).map(u=>`<div class="row" style="justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--line)"><span>${esc(u.email||"-")}</span><span class="tag">${u.role==="admin"?"Admin":"User"}</span></div>`).join("")}</div>`;return
}
