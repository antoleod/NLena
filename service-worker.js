const CACHE_NAME = 'lena-cache-v1';

// Files to precache — keep relative paths as in the project
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/login.html',
  '/html/login.html',
  '/html/menu.html',
  '/html/juego.html',
  '/html/logros.html',
  '/html/poeme.html',
  '/html/sons.html',
  '/html/amenagements.html',

  // CSS
  '/css/style.css',
  '/css/login.css',
  '/css/menu.css',
  '/css/juego.css',
  '/css/juego_extras.css',
  '/css/logros.css',

  // JS
  '/js/avatarData.js',
  '/js/storage.js',
  '/js/login.js',
  '/js/menu.js',
  '/js/juego.js',
  '/js/juego_extras.js',
  '/js/logros.js',
  '/js/games/poeme.js',
  '/js/sons.js',
  '/js/amenagements.js',

  // Games
  '/games/dictee.js',
  '/games/puzzlemagique.js',
  '/games/repartis.js',


  // Assets
  '/assets/stickers/sticker1.png',
  '/assets/stickers/sticker2.png',
  '/assets/stickers/sticker3.png',
  '/assets/sounds/correct.wav',
  '/assets/sounds/level-up.wav',
  '/assets/avatars/dauphin.svg',
  '/assets/avatars/dragon.svg',
  '/assets/avatars/grenouille.svg',
  '/assets/avatars/hibou.svg',
  '/assets/avatars/licorne.svg',
  '/assets/avatars/lion.svg',
  '/assets/avatars/panda.svg',
  '/assets/avatars/pingouin.svg',
  '/assets/avatars/renard.svg',

  // offline fallback
  '/offline.html'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.map((key) => {
        if (key !== CACHE_NAME) return caches.delete(key);
      })
    ))
  );
  self.clients.claim();
});

// Cache-first strategy
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // only handle GET requests
  if (request.method !== 'GET') return;

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) {
        return cached;
      }
      return fetch(request).then((response) => {
        // if response is invalid, just pass it through
        if (!response || response.status !== 200 || response.type === 'opaque') {
          return response;
        }
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        return response;
      }).catch(() => {
        // Network failed — show offline page for navigation requests
        if (request.mode === 'navigate' || (request.headers.get('accept') || '').includes('text/html')) {
          return caches.match('/offline.html');
        }
        // else, try a matching image/icon or return nothing
        return caches.match('/assets/stickers/sticker1.png');
      });
    })
  );
});
