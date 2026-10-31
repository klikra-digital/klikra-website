const CACHE_NAME = "sarpras-smart-scan-001-pwa-v1";
const APP_FILES = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "jsQR.js",
  "icon-192.png",
  "icon-512.png",
  "icon-512.svg",
  "icon-512-maskable.svg"
];
const APP_URLS = APP_FILES.map(path => new URL(path, self.registration.scope).href);
const INDEX_URL = new URL("index.html", self.registration.scope).href;

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(key =>
          key.startsWith("sarpras-smart-scan-001-") && key !== CACHE_NAME
        ).map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        if (response && response.ok) {
          const cache = await caches.open(CACHE_NAME);
          await cache.put(INDEX_URL, response.clone());
        }
        return response;
      } catch {
        return await caches.match(INDEX_URL);
      }
    })());
    return;
  }

  event.respondWith(
    caches.match(request).then(cached => cached || fetch(request))
  );
});