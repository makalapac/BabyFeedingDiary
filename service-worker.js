const CACHE_NAME = 'baby-diary-v1';
const urlsToCache = [
  '/BabyFeedingDiary/',
  '/BabyFeedingDiary/index.html',
  '/BabyFeedingDiary/manifest.json',
  '/BabyFeedingDiary/vite.svg',
  '/BabyFeedingDiary/icons/icon-72x72.png',
  '/BabyFeedingDiary/icons/icon-96x96.png',
  '/BabyFeedingDiary/icons/icon-128x128.png',
  '/BabyFeedingDiary/icons/icon-144x144.png',
  '/BabyFeedingDiary/icons/icon-152x152.png',
  '/BabyFeedingDiary/icons/icon-192x192.png',
  '/BabyFeedingDiary/icons/icon-384x384.png',
  '/BabyFeedingDiary/icons/icon-512x512.png'
];

// Install service worker
self.addEventListener('install', (event) => {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  // Activate worker immediately
  self.skipWaiting();
});

// Activate the worker and clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Ensure service worker takes control immediately
  self.clients.claim();
});

// Cache and return requests
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        return fetch(event.request).then(
          (response) => {
            // Check if we received a valid response
            if(!response || response.status !== 200) {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            // Only cache same-origin requests
            if (event.request.url.startsWith(self.location.origin)) {
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                });
            }

            return response;
          }
        ).catch(() => {
          // If fetch fails, return a fallback response for HTML pages
          if (event.request.mode === 'navigate') {
            return caches.match('/BabyFeedingDiary/index.html');
          }
        });
      })
  );
}); 