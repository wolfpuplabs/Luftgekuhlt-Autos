/* HOLOVIEW-style AR delivery.
   The page converts each .glb to .usdz in the browser and stores the bytes in
   Cache Storage under /ar-cache/<id>.usdz. iOS Quick Look will only open a .usdz
   from a *real* URL (not a blob:), so this worker intercepts those paths and
   serves the cached bytes with the correct MIME type. No server upload needed. */
const CACHE = 'holo-ar';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (url.origin === self.location.origin && url.pathname.startsWith('/ar-cache/')) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE);
      const hit = await cache.match(event.request, { ignoreSearch: true });
      return hit || new Response('AR asset not ready', {
        status: 404, headers: { 'Content-Type': 'text/plain' }
      });
    })());
  }
});
