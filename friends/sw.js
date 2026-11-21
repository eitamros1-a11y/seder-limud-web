// offline support: page from the network when possible, everything else from the cache first
const V="seder-friends-20cb50bc3f";
const CORE=["./","index.html","mishnah.js","manifest.webmanifest","icon-180.png"];
self.addEventListener("install",e=>{ e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())); });
self.addEventListener("activate",e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener("fetch",e=>{ const r=e.request; if(r.method!=="GET") return; const u=new URL(r.url); if(u.origin!==location.origin) return;
  const page=r.mode==="navigate"||u.pathname.endsWith("/")||u.pathname.endsWith("index.html");
  if(page){ e.respondWith(fetch(r).then(x=>{ const cp=x.clone(); caches.open(V).then(c=>c.put(r,cp)); return x; }).catch(()=>caches.match(r).then(m=>m||caches.match("index.html")))); return; }
  e.respondWith(caches.match(r).then(m=>m||fetch(r).then(x=>{ if(x.ok){ const cp=x.clone(); caches.open(V).then(c=>c.put(r,cp)); } return x; }))); });
