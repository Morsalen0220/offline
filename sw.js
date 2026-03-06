const CACHE_NAME = 'quick-math-offline-v3';
const OFFLINE_FALLBACK = './index.html';
const FILES_TO_CACHE = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.webmanifest'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    (async () => {
      try {
        const networkResponse = await fetch(event.request);

        const cache = await caches.open(CACHE_NAME);
        cache.put(event.request, networkResponse.clone());

        return networkResponse;
      } catch (_error) {
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }

        if (event.request.mode === 'navigate') {
          return caches.match(OFFLINE_FALLBACK);
        }

        return new Response('Offline and resource not cached.', {
          status: 503,
          statusText: 'Service Unavailable'
        });
      }
    })()
  );
});
