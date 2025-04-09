const CACHE_NAME = 'baby-diary-v1';
const urlsToCache = [
  '/BabyFeedingDiary/',
  '/BabyFeedingDiary/index.html',
  '/BabyFeedingDiary/manifest.json',
  '/BabyFeedingDiary/assets/index.css',
  '/BabyFeedingDiary/icons/icon-72x72.png',
  '/BabyFeedingDiary/icons/icon-96x96.png',
  '/BabyFeedingDiary/icons/icon-128x128.png',
  '/BabyFeedingDiary/icons/icon-144x144.png',
  '/BabyFeedingDiary/icons/icon-152x152.png',
  '/BabyFeedingDiary/icons/icon-192x192.png',
  '/BabyFeedingDiary/icons/icon-384x384.png',
  '/BabyFeedingDiary/icons/icon-512x512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

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
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
}); 