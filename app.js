const DEFAULT_PRODUCTS = [
 {id:1,name:"Nasi Hainan",price:15000,icon:"🍚"},
 {id:2,name:"Ayam Yakitori",price:18000,icon:"🍗"},
 {id:3,name:"Curry Katsu",price:22000,icon:"🍛"},
 {id:4,name:"Paket Hainan + Ayam",price:28000,icon:"🍱"},
 {id:5,name:"Es Teh Manis",price:5000,icon:"🧋"},
 {id:6,name:"Air Mineral",price:4000,icon:"💧"},
 {id:7,name:"Lemon Tea",price:8000,icon:"🍋"},
 {id:8,name:"Kentang Goreng",price:12000,icon:"🍟"}
];
const $=id=>document.getElementById(id);
const money=n=>new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(n||0);
const load=(key,def)=>{try{return JSON.parse(localStorage.getItem(key))??def}catch{return def}};
const safe=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
let cashier=sessionStorage.getItem("kasir_name")||"", products=load("kasir_products",DEFAULT_PRODUCTS), cart=[], transactions=load("kasir_transactions",[]);

function init(){
 $("login").classList.toggle("hidden",!!cashier);$("app").classList.toggle("hidden",!cashier);
 $("cashierName").textContent=cashier;$("today").textContent=new Date().toLocaleDateString("id-ID",{dateStyle:"full"});
 renderProducts();renderCart();renderHistory();
}
$("loginForm").addEventListener("submit",e=>{e.preventDefault();if($("pinInput").value!=="1234"){$("loginError").textContent="PIN salah. Gunakan PIN demo 1234.";return}cashier=$("cashierInput").value.trim()||"Kasir";sessionStorage.setItem("kasir_name",cashier);init()});
$("logout").addEventListener("click",()=>{sessionStorage.removeItem("kasir_name");cashier="";cart=[];init()});
document.querySelectorAll(".nav").forEach(btn=>btn.addEventListener("click",()=>{document.querySelectorAll(".nav").forEach(x=>x.classList.remove("active"));btn.classList.add("active");document.querySelectorAll(".view").forEach(v=>v.classList.add("hidden"));$(btn.dataset.view).classList.remove("hidden");$("heading").textContent=btn.dataset.view==="historyView"?"Riwayat transaksi":"Transaksi penjualan";if(btn.dataset.view==="historyView")renderHistory()}));
$("search").addEventListener("input",renderProducts);
function renderProducts(){const q=$("search").value.toLowerCase(),list=products.filter(p=>p.name.toLowerCase().includes(q));$("productCount").textContent=list.length+" produk";$("products").innerHTML=list.map(p=>`<button class="product" data-id="${p.id}"><div><div class="product-icon">${p.icon}</div><b>${safe(p.name)}</b></div><span class="price">${money(p.price)}</span></button>`).join("")||'<div class="empty">Produk tidak ditemukan.</div>';document.querySelectorAll(".product").forEach(b=>b.addEventListener("click",()=>add(Number(b.dataset.id))))}
function add(id){const p=products.find(x=>x.id===id);if(!p)return;const found=cart.find(x=>x.id===id);found?found.qty++:cart.push({...p,qty:1});renderCart()}
function total(){return cart.reduce((s,p)=>s+p.price*p.qty,0)}
function renderCart(){$("cartItems").innerHTML=cart.length?cart.map(p=>`<div class="cart-row"><div><b>${safe(p.name)}</b><small>${money(p.price)} × ${p.qty} = ${money(p.price*p.qty)}</small></div><div class="qty"><button data-op="minus" data-id="${p.id}">−</button><span>${p.qty}</span><button data-op="plus" data-id="${p.id}">+</button></div></div>`).join(""):'<div class="empty">🛒<b>Keranjang masih kosong</b><span>Pilih menu di sebelah kiri.</span></div>';document.querySelectorAll("[data-op]").forEach(b=>b.addEventListener("click",()=>{const p=cart.find(x=>x.id===Number(b.dataset.id));if(!p)return;p.qty+=b.dataset.op==="plus"?1:-1;if(p.qty<=0)cart=cart.filter(x=>x.id!==p.id);renderCart()}));$("subtotal").textContent=money(total());$("total").textContent=money(total());paymentUpdate()}
function paymentUpdate(){const paid=Number($("paid").value)||0;$("change").textContent=money(Math.max(0,paid-total()));$("save").disabled=!cart.length||paid<total()||total()===0}
$("paid").addEventListener("input",paymentUpdate);
$("clear").addEventListener("click",()=>{cart=[];$("paid").value="";renderCart()});
$("save").addEventListener("click",()=>{const sum=total(),paid=Number($("paid").value)||0;if(!cart.length||paid<sum)return;const tx={id:"TRX-"+Date.now().toString().slice(-8),date:new Date().toISOString(),cashier,items:cart.map(p=>({...p})),total:sum,paid,change:paid-sum};transactions.unshift(tx);localStorage.setItem("kasir_transactions",JSON.stringify(transactions));cart=[];$("paid").value="";renderCart();renderHistory();showReceipt(tx);notify("Transaksi berhasil disimpan.")});
function renderHistory(){$("noHistory").classList.toggle("hidden",transactions.length>0);$("history").innerHTML=transactions.map(t=>`<tr><td><b>${t.id}</b></td><td>${new Date(t.date).toLocaleString("id-ID")}</td><td>${safe(t.cashier)}</td><td>${money(t.total)}</td><td>${money(t.paid)}</td><td>${money(t.change)}</td><td><button class="table-link" data-receipt="${t.id}">Lihat</button></td></tr>`).join("");document.querySelectorAll("[data-receipt]").forEach(b=>b.addEventListener("click",()=>{const tx=transactions.find(t=>t.id===b.dataset.receipt);if(tx)showReceipt(tx)}))}
function showReceipt(t){$("receipt").innerHTML=`<h2>KASIRKU</h2><p>Terima kasih telah berbelanja</p><hr><div class="receipt-line"><span>No. transaksi</span><b>${t.id}</b></div><div class="receipt-line"><span>Tanggal</span><span>${new Date(t.date).toLocaleString("id-ID")}</span></div><div class="receipt-line"><span>Kasir</span><span>${safe(t.cashier)}</span></div><hr>${t.items.map(p=>`<div class="receipt-line"><span>${safe(p.name)} × ${p.qty}</span><span>${money(p.price*p.qty)}</span></div>`).join("")}<hr><div class="receipt-line"><b>TOTAL</b><b>${money(t.total)}</b></div><div class="receipt-line"><span>Tunai</span><span>${money(t.paid)}</span></div><div class="receipt-line"><b>Kembalian</b><b>${money(t.change)}</b></div><hr><p>*** Terima kasih ***</p>`;$("receiptModal").classList.remove("hidden")}
function closeReceipt(){$("receiptModal").classList.add("hidden")}
$("closeReceipt").addEventListener("click",closeReceipt);$("done").addEventListener("click",closeReceipt);$("print").addEventListener("click",()=>window.print());
$("csv").addEventListener("click",()=>{if(!transactions.length){notify("Belum ada data transaksi.");return}const rows=[["ID","Tanggal","Kasir","Total","Bayar","Kembalian"],...transactions.map(t=>[t.id,new Date(t.date).toLocaleString("id-ID"),t.cashier,t.total,t.paid,t.change])];const csv=rows.map(r=>r.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(",")).join("\n");const blob=new Blob(["\ufeff"+csv],{type:"text/csv;charset=utf-8"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="riwayat-transaksi.csv";a.click();URL.revokeObjectURL(a.href)});
let toastTimer;function notify(msg){$("toast").textContent=msg;$("toast").classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>$("toast").classList.remove("show"),2200)}
init();
