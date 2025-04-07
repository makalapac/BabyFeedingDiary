const CACHE_NAME = 'breastfeeding-tracker-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/src/main.tsx',
  '/src/App.tsx',
  '/src/components/FeedingScreen.tsx',
  '/src/components/HistoryScreen.tsx',
  '/src/components/WeightScreen.tsx',
  '/src/components/Navigation.tsx',
  '/src/services/storage.ts',
  '/src/types/index.ts',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
}); 