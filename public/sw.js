const CACHE = "app-cache";
const offlineFallbackPage = "/offline";
const CACHE_FIRST_DOMAINS = ['raw.githack.com', 'raw.githubusercontent.com'];

importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener('install', async (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.add(offlineFallbackPage))
  );
});

if (workbox.navigationPreload.isSupported()) {
  workbox.navigationPreload.enable();
}

workbox.routing.registerRoute(
  ({ url }) => CACHE_FIRST_DOMAINS.includes(url.hostname),
  new workbox.strategies.CacheFirst({
    cacheName: CACHE
  })
);

workbox.routing.registerRoute(
  ({ url }) => !CACHE_FIRST_DOMAINS.includes(url.hostname),
  new workbox.strategies.NetworkFirst({
    cacheName: CACHE
  })
);

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        return await fetch(event.request);
      } catch (error) {
        const cache = await caches.open(CACHE);
        const cachedResp = await cache.match(offlineFallbackPage);
        return cachedResp;
      }
    })());
  }
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});