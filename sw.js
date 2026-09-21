// Timer PWA — Service Worker
// Caches all app files on install so the timer works 100% offline.

const CACHE_NAME = 'timer-pwa-v2';
const ASSETS = [
  './index.html',
  './timer.html',
  './manifest.json',
  './icon.svg'
];

// Install: pre-cache all assets
// Using Promise.allSettled so one failed fetch doesn't abort the whole install
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      Promise.allSettled(ASSETS.map(url => cache.add(url)))
    )
  );
  self.skipWaiting();
});

// Activate: delete old caches from previous versions
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// Fetch: cache-first strategy — serve from cache, fall back to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
