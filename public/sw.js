self.addEventListener('install', (e) => {
  console.log('[Service Worker] Install');
});

self.addEventListener('fetch', (e) => {
  // Pass-through strategy for now to allow normal operation
  e.respondWith(fetch(e.request));
});
