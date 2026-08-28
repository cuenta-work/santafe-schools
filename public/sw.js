// Service worker mínimo: no cachea nada, solo existe para que Chrome
// considere el sitio "instalable" (requisito para beforeinstallprompt).
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  event.respondWith(fetch(event.request));
});
