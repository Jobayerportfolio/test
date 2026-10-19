const V = "linkup-v1", FILES = ["link-up.html", "manifest.webmanifest", "icon.svg", "icon-192.png", "icon-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(V).then(c => Promise.all(FILES.map(f => c.add(f).catch(() => {})))).then(() => self.skipWaiting())) });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== V).map(x => caches.delete(x)))).then(() => self.clients.claim())) });
self.addEventListener("fetch", e => {
  const r = e.request, u = new URL(r.url);
  const ok = u.origin === location.origin || u.host === "fonts.googleapis.com" || u.host === "fonts.gstatic.com";
  if (r.method !== "GET" || !ok) return;
  e.respondWith(fetch(r).then(res => { const copy = res.clone(); caches.open(V).then(c => c.put(r, copy)); return res }).catch(() => caches.match(r).then(m => m || caches.match("link-up.html"))));
});
