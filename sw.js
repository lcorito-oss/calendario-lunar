const CACHE = "calendario-lunar-v5";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./assets/moon-surface.png",
  "./assets/favicon.svg",
  "./assets/favicon-32.png",
  "./assets/favicon-32-dark.png",
  "./assets/favicon-180.png",
  "./assets/favicon-192.png",
  "./assets/favicon-512.png",
  "./assets/favicon.ico"
];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(hit => hit || fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
      return res;
    }).catch(() => caches.match("./index.html")))
  );
});
