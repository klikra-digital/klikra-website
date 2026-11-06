// One-time migration: retire the former root-scoped SARPRAS ADMIN 002 service worker.
self.addEventListener('install', event => {
  event.waitUntil(self.skipWaiting());
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    await caches.delete('sarpras-admin-002-pwa-v1');
    await self.registration.unregister();
  })());
});
