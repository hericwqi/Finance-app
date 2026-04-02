self.addEventListener('install', (event) => {
  console.log('[Service Worker] Install');
});

self.addEventListener('fetch', (event) => {
  // Basic fetch handler to satisfy PWA requirements
});
