/* ===== helpers ===== */
const $ = (s,r=document) => r.querySelector(s), $$ = (s,r=document) => [...r.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const toastEl = $("#toast"); let tt;
function toast(t){toastEl.textContent=T(t);toastEl.classList.add("o");clearTimeout(tt);tt=setTimeout(()=>toastEl.classList.remove("o"),2600)}
function waLink(msg){return "https://wa.me/"+whatsappNumber.replace(/\D/g,"")+"?text="+encodeURIComponent(msg)}
function openWA(msg){ if(!whatsappNumber){toast("WhatsApp number not set yet. Add it in the member config.");return} window.open(waLink(msg),"_blank","noopener") }
const I = {
  globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
  leaf:'<path d="M5 19C5 10 10 5 20 4c0 10-5 15-15 15zM5 19l8-8"/>',
  sprout:'<path d="M12 21v-8M12 13c0-4-3-6-7-6 0 4 3 6 7 6zM12 11c0-3 2-5 6-5 0 3-2 5-6 5z"/>',
  users:'<circle cx="9" cy="8" r="3.5"/><path d="M2 20c0-4 3-6 7-6s7 2 7 6M17 4.5a3.5 3.5 0 010 7M22 20c0-3-2-5-4-5.5"/>',
  chat:'<path d="M21 12a8 8 0 01-12 7l-5 1.5L5 16a8 8 0 1116-4z"/>',
  compass:'<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
  bolt:'<path d="M13 3L5 14h6l-1 7 8-11h-6z"/>',
  hand:'<path d="M12 21s-8-5-8-11a4.5 4.5 0 018-2.5A4.5 4.5 0 0120 10c0 6-8 11-8 11z"/>',
  cup:'<path d="M5 8h12v5a5 5 0 01-5 5h-2a5 5 0 01-5-5zM17 9h2a2 2 0 010 4h-2M8 3v2M12 3v2"/>'
};
const svg = k => `<svg viewBox="0 0 24 24">${I[k]}</svg>`;
const icoCard = (k,t,p) => `<article class="card"><div class="ic">${svg(k)}</div><h3>${t}</h3><p>${p}</p></article>`;

/* ===== render config-driven bits ===== */
$$("[data-m]").forEach(el => el.textContent = member[el.dataset.m]);
document.title = member.name + " | " + member.title;
if(member.photo) $$("[data-photo]").forEach(el => el.innerHTML = `<img src="${esc(member.photo)}" alt="Portrait of ${esc(member.name)}">`);
$("#dxncards").innerHTML =
  icoCard("globe","Global presence","DXN operates internationally through independent members.")+
  icoCard("sprout","Wellness products","A range of products across coffee, beverages, supplements and more.")+
  icoCard("leaf","Natural ingredients","DXN is known for products developed around natural ingredients. See official labels for details.")+
  icoCard("users","Member community","Products are shared through a community of independent members.");
$("#why").innerHTML =
  icoCard("hand","Personal assistance","Questions are answered by Jihan directly.")+
  icoCard("compass","Product guidance","Help finding products that match what you are looking for.")+
  icoCard("chat","Easy communication","Reach out through the channel you prefer.")+
  icoCard("bolt","Direct WhatsApp support","Send a message and get a personal reply.");
$$("[data-wa]").forEach(a => a.addEventListener("click",e=>{e.preventDefault();openWA(a.dataset.wa)}));
$("#fw").onclick = () => openWA("Hello Jihan, I would like to ask about DXN products.");
$$(".join").forEach(b => b.onclick = e => { e.preventDefault(); member.membershipLink ? window.open(member.membershipLink,"_blank","noopener") : toast("Membership link not set yet. Add it in the member config.") });

const socialLinks = {instagram:"",facebook:"",youtube:"",tektok:"",whatsapp:""};
Object.assign(socialLinks, member.social, {whatsapp: whatsappNumber});
const socHTML = ["instagram","facebook","youtube","tektok","whatsapp"].map(k=>`<a class="btn ${socialLinks[k]?"":"off"}" href="#" data-s="${k}">${k[0].toUpperCase()+k.slice(1)}</a>`).join("");
["social","social2","social3"].forEach(id => { const el=$("#"+id); el.innerHTML=socHTML; });
$$("[data-s]").forEach(a => a.addEventListener("click",e=>{e.preventDefault();const k=a.dataset.s,v=socialLinks[k];
  if(!v) return toast("This link is not set yet. Add it in the member config.");
  k==="whatsapp" ? openWA("Hello Jihan, I would like to ask about DXN products.") : window.open(v,"_blank","noopener")}));

/* ===== catalog ===== */
let cat = "All", term = "";
const chips = $("#chips"), pg = $("#pg");
chips.innerHTML = ["All",...categories].map(c=>`<button class="chip${c==="All"?" on":""}" data-c="${c}">${c}</button>`).join("");
chips.onclick = e => { const b=e.target.closest(".chip"); if(!b) return; cat=b.dataset.c; $$(".chip").forEach(x=>x.classList.toggle("on",x===b)); draw(true) };
$("#q").oninput = e => { term=e.target.value.trim().toLowerCase(); draw() };
const prodImg = p => p.image ? `<img src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy">` : `<svg viewBox="0 0 24 24" fill="none">${I.cup}</svg><span class="cap">Image coming soon</span>`;
function draw(load){
  const run = () => {
    const list = products.filter(p => (cat==="All"||p.category===cat) && (!term || (p.name+p.description+p.category).toLowerCase().includes(term)));
    pg.innerHTML = list.length ? list.map(p=>`<article class="pc"><div class="pi"><span class="tag">${p.category}</span>${prodImg(p)}</div><div class="pb"><h3>${esc(p.name)}</h3><p>${esc(p.description)}</p><div class="pr${p.price?"":" na"}">${p.price?esc(p.price):"Price on request"}</div><div class="pa"><button class="btn b2" data-d="${p.id}">View Details</button><button class="btn b3" data-o="${p.id}">Order via WhatsApp</button></div></div></article>`).join("") : `<div class="empty">No products match your search. Try another name or choose All.</div>`;
  };
  if(load){pg.innerHTML=`<div class="load">Loading products…</div>`;setTimeout(run,250)} else run();
}
const msgFor = p => p.whatsappMessage || `Hello Jihan, I would like to ask about ${p.name}.`;
pg.onclick = e => { const d=e.target.closest("[data-d]"), o=e.target.closest("[data-o]");
  if(d) openModal(+d.dataset.d); if(o) openWA(msgFor(products.find(p=>p.id==o.dataset.o))) };
const ov = $("#ov"), md = $("#md"); let focusP = null;
function openModal(id){
  const p = products.find(x=>x.id===id); focusP = p;
  md.innerHTML = `<button class="x" aria-label="Close">×</button><div class="pi">${prodImg(p)}</div><div class="mb"><span class="badge" style="align-self:flex-start">${p.category}</span><h2 style="font-size:1.9rem">${esc(p.name)}</h2><p style="color:var(--mut)">${esc(p.description)}</p><dl style="margin:0"><dt>Ingredients</dt><dd>${esc(p.ingredients||NA)}</dd><dt>Usage</dt><dd>${esc(p.usage||NA)}</dd><dt>Price</dt><dd>${p.price?esc(p.price):"Price on request"}</dd></dl><button class="btn b3" data-o>Order via WhatsApp</button><p class="note">Information is for general reference only and is not medical advice.</p></div>`;
  ov.classList.add("o"); history.replaceState(null,"","#product-"+p.id);
  $(".x",md).focus(); $("[data-o]",md).onclick = () => openWA(msgFor(p)); $(".x",md).onclick = closeModal;
}
function closeModal(){ov.classList.remove("o");history.replaceState(null,"","#products")}
ov.onclick = e => { if(e.target===ov) closeModal() }; document.addEventListener("keydown",e=>{ if(e.key==="Escape"){closeModal();$("#drawer").classList.remove("o")} });
draw();

/* ===== AI assistant: answers ONLY from the product list above ===== */
const SUGG = ["Which coffee products are available?","Tell me about this product.","What are the ingredients?","How should this product be used?","What products are available in this category?","I need help choosing a product."];
const MED = /(cure|treat|heal|disease|diabetes|cancer|pain|symptom|diagnos|prescri|medicat|dose|pregnan|illness|sick|blood pressure|علاج|دواء|مرض|ألم|سكري|سرطان|حمل|ضغط)/i;
function answer(q){
  if(MED.test(q)) return "I can’t give medical advice or say whether a product helps with a health condition. Please consult a qualified healthcare professional. I can share the product information that is available on this site.";
  const l = q.toLowerCase().replace(/قهوة/g,"coffee").replace(/مكونات|مكون/g,"ingredient").replace(/استخدام|استعمال/g,"usage").replace(/سعر|أسعار|بكم/g,"price").replace(/مشروبات|مشروب/g,"beverages").replace(/مكملات|مكمل/g,"supplements").replace(/عناية/g,"personal care").replace(/غذاء|طعام/g,"food");
  const named = products.find(p => l.includes(p.name.toLowerCase())) || (/this product|it\b/.test(l) ? focusP : null);
  const c = categories.find(c => l.includes(c.toLowerCase().replace(" products","")) || (c==="Coffee"&&l.includes("coffee")));
  if(/ingredient/.test(l)) return named ? (named.ingredients ? `Ingredients for ${named.name}: ${named.ingredients}` : `${named.name}: ${NA}`) : "Which product would you like ingredients for? Open a product and ask again, or name it.";
  if(/(use|usage|how should|take)/.test(l)) return named ? (named.usage ? `Usage for ${named.name}: ${named.usage}` : `${named.name}: ${NA}`) : "Which product do you mean? Open a product or name it and I’ll share any usage information available.";
  if(/price|cost/.test(l)) return named ? (named.price ? `${named.name}: ${named.price}` : "Prices are not currently available here. Please ask Jihan on WhatsApp.") : "Prices are not currently listed. Please ask Jihan on WhatsApp.";
  if(named && !c) return `${named.name} (${named.category}): ${named.description}`;
  if(c){ const L = products.filter(p=>p.category===c); return L.length ? `Available in ${c}:\n`+L.map(p=>"• "+p.name).join("\n") : `No ${c} products are listed yet.`; }
  if(/choos|help|recommend|which/.test(l)) return "Tell me which category interests you: "+categories.join(", ")+". For personal guidance, you can also message Jihan on WhatsApp.";
  return "I don’t have information on that yet. I can help with the products listed on this site, or you can ask Jihan directly.";
}
async function ask(q){
  // Later: if(AI_ENDPOINT) return (await fetch(AI_ENDPOINT,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({question:q})})).json().then(d=>d.answer);
  return answer(q);
}
function mountChat(root){
  root.innerHTML = `<div class="ch"><span>Jihan’s AI Assistant</span><button type="button" data-clr>Clear conversation</button></div><div class="msgs" aria-live="polite"></div><div class="sg">${SUGG.map(s=>`<button type="button" data-q="${s}">${s}</button>`).join("")}</div><div class="cf"><input placeholder="Ask about a product" aria-label="Message"><button type="button">Send</button></div>`;
  const box=$(".msgs",root), inp=$("input",root);
  const add=(t,c)=>{const d=document.createElement("div");d.className="m "+c;d.textContent=T(t);box.appendChild(d);box.scrollTop=box.scrollHeight;return d};
  const hello=()=>{box.innerHTML="";add("Hello! I’m Jihan’s assistant. I answer only from the product information on this site.","a")};
  async function send(t){ t=t.trim(); if(!t) return; add(t,"u"); inp.value="";
    const ty=document.createElement("div");ty.className="m a";ty.innerHTML='<span class="dots"><i></i><i></i><i></i></span>';box.appendChild(ty);box.scrollTop=box.scrollHeight;
    const a=await ask(t); await new Promise(r=>setTimeout(r,600)); ty.remove(); add(a,"a") }
  $(".sg",root).onclick=e=>{if(e.target.tagName==="BUTTON")send(e.target.dataset.q)};
  $(".cf button",root).onclick=()=>send(inp.value); inp.onkeydown=e=>{if(e.key==="Enter")send(inp.value)};
  $("[data-clr]",root).onclick=hello; hello();
}
mountChat($("#inline")); mountChat($("#drawer"));
$("#fa").onclick = () => $("#drawer").classList.toggle("o");
$("#lang").onclick = () => setLang(lang==="ar" ? "en" : "ar");

/* ===== nav, reveal, form, SEO ===== */
const hd=$("#hd"),ham=$("#ham"),links=$("#links");
addEventListener("scroll",()=>hd.classList.toggle("s",scrollY>20),{passive:true});
ham.onclick=()=>{const o=links.classList.toggle("o");ham.classList.toggle("o",o);ham.setAttribute("aria-expanded",o)};
links.onclick=e=>{if(e.target.tagName==="A"){links.classList.remove("o");ham.classList.remove("o")}};
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}}),{threshold:.15});
$$(".rv").forEach(el=>io.observe(el));
$("#cf").onsubmit=e=>{e.preventDefault();const f=e.target;
  if(!f.name.value.trim()||!/\S+@\S+\.\S+/.test(f.email.value)||!f.message.value.trim()) return toast("Please enter your name, a valid email and a message.");
  // Later: POST FormData to your backend or email service here.
  toast("Thanks. Form is ready; connect a backend to deliver messages."); f.reset()};
$("#ld").textContent = JSON.stringify({"@context":"https://schema.org","@graph":[
  {"@type":"Person","name":member.name,"jobTitle":member.title},
  ...products.map(p=>({"@type":"Product","name":p.name,"category":p.category,"description":p.description}))]});
