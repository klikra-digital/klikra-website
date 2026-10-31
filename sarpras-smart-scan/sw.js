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
    event.respondWith(
      fetch(request).then(response => {
        if (response && response.ok) {
          const copy = response.clone();
          event.waitUntil(caches.open(CACHE_NAME).then(cache =>
            cache.put(new URL("index.html", self.registration.scope).href, copy)
          ));
        }
        return response;
      }).catch(() => caches.match(new URL("index.html", self.registration.scope).href))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(cached => cached || fetch(request))
  );
});