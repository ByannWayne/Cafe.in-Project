// Pemilih halaman: render() memanggil fungsi view sesuai S.view.

const VIEWS={login:viewLogin,users:viewUsers,map:viewMap,add:viewAdd,detail:viewDetail,home:viewHome};
function render(){(VIEWS[S.view]||VIEWS.home)()}

function upd(){if(S.view==="map")drawMap();else if(S.view==="home"||S.view==="detail")render()}
