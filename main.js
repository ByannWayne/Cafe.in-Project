// Titik awal: dijalankan paling akhir saat halaman dibuka.

(()=>{try{S.osm=JSON.parse(localStorage.getItem("ci_osm"))||[]}catch(x){S.osm=[]}try{S.fav=JSON.parse(localStorage.getItem("ci_fav"))||[]}catch(x){S.fav=[]}build();render();getLoc();initAuth();loadDb()})();
