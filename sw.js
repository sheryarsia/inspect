/* Inspection. Built by Sheryar Khan. Network first; after 3 seconds or when offline, the cached copy, only if it is this exact page. */
const C="lontl-inspection-0.5.1",H="9bbc8027b0b7271372b5f02d67af942533bc662b9d832866e1d8f0e631bfec9a";
const hex=b=>Array.from(new Uint8Array(b),x=>(x<16?"0":"")+x.toString(16)).join("");
const ok=b=>crypto.subtle.digest("SHA-256",b).then(d=>hex(d)===H);
const page=b=>new Response(b,{headers:{"content-type":"text/html; charset=utf-8"}});
const scope=()=>new URL(self.registration.scope).pathname;
const mine=u=>u.origin===location.origin&&(u.pathname===scope()||u.pathname===scope()+"index.html");
const acc=u=>u.origin===location.origin&&u.pathname===scope()+"access.json";
const cached=q=>caches.open(C).then(c=>c.match(q,{ignoreSearch:true})).then(r=>r?r.arrayBuffer().then(b=>ok(b).then(g=>g?page(b):null)):null).catch(()=>null);
const cachedAcc=q=>caches.open(C).then(c=>c.match(q,{ignoreSearch:true})).then(r=>r||null).catch(()=>null);
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>Promise.all(["./","./index.html"].map(u=>fetch(new Request(u,{cache:"reload"})).then(r=>r.arrayBuffer().then(b=>ok(b).then(g=>{if(!r.ok||!g)throw new Error("page");return c.put(u,page(b))}))))).then(()=>fetch(new Request("./access.json",{cache:"reload"})).then(r=>{if(r.ok)return c.put("./access.json",r)}).catch(()=>{}))).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C&&x.indexOf("lontl-inspection-")===0).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{const q=e.request;if(q.method!=="GET")return;const u=new URL(q.url);if(acc(u)){e.respondWith(new Promise(res=>{let done=false;const give=r=>{if(!done&&r){done=true;res(r)}};const t=setTimeout(()=>{cachedAcc(q).then(give)},3000);fetch(q,{cache:"no-store"}).then(r=>{clearTimeout(t);if(r&&r.ok){caches.open(C).then(c=>c.put(q,r.clone())).catch(()=>{})}give(r)}).catch(()=>{clearTimeout(t);cachedAcc(q).then(r=>give(r||Response.error()))})}));return}if(!mine(u))return;e.respondWith(new Promise(res=>{let done=false;const give=r=>{if(!done&&r){done=true;res(r)}};const t=setTimeout(()=>{cached(q).then(give)},3000);fetch(q,{cache:"no-store"}).then(r=>{clearTimeout(t);if(r&&r.ok){r.clone().arrayBuffer().then(b=>ok(b).then(g=>{if(g)return caches.open(C).then(c=>c.put(q,page(b)))})).catch(()=>{})}give(r)}).catch(()=>{clearTimeout(t);cached(q).then(r=>give(r||Response.error()))})}))});
