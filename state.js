// State aplikasi (objek S) dan fungsi bantu kecil (esc, avg, km, dst).

const S={view:"home",fav:[],user:"",cafes:[],sel:null,uid:"tamu",name:"",near:null,loc:"",region:"Semua",budget:"Semua",q:"",draft:{},pt:null,photos:[],pick:false,peek:null};

S.admin=false;

S.users=null;

S.rv={stars:0,service:0,food:0,worth:0,text:""};

S.rvFor=null;

S.mphotos=[];

S.osm=[];

S.db={cafes:[],menu:[],photos:[],ratings:[]};

const $=s=>document.querySelector(s),root=$("#root");

const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

const avg=c=>{const v=Object.values(c.ratings||{});return v.length?v.reduce((a,b)=>a+b,0)/v.length:0};

const km=(a,b,c,d)=>{const r=Math.PI/180,x=(c-a)*r*Math.cos((b+d)*r/2),y=(d-b)*r;return Math.sqrt(x*x+y*y)*6371};

const dtxt=c=>{if(!S.near)return"";const m=Math.round(km(S.near.lng,S.near.lat,c.lng,c.lat)*1000);return m<1000?m+" m":(m/1000).toFixed(1)+" km"};

const dm=c=>S.near?km(S.near.lng,S.near.lat,c.lng,c.lat):1e9;

const rp=n=>n?"Rp "+Number(n).toLocaleString("id-ID"):"";
