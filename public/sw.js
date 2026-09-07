// Service Worker untuk Les Vita PWA
// Handles caching untuk offline support halaman admin

const CACHE_NAME = 'les-vita-admin-v1';
const OFFLINE_URL = '/admin';

// Asset yang di-cache saat install
const PRECACHE_ASSETS = [
  '/admin',
  '/admin/attendance',
  '/admin/homework',
  '/admin/live-report',
  '/manifest.json',
  '/logo.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch(() => {
        // Lanjutkan meski ada asset yang gagal di-cache
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Strategi: Network First, fallback ke cache
self.addEventListener('fetch', (event) => {
  // Hanya handle GET requests
  if (event.request.method !== 'GET') return;

  // Skip API requests (biarkan langsung ke network)
  if (event.request.url.includes('/api/')) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Simpan respons ke cache jika berhasil
        if (response.ok) {
          const cloned = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, cloned);
          });
        }
        return response;
      })
      .catch(() => {
        // Network gagal, coba dari cache
        return caches.match(event.request).then((cached) => {
          return cached || caches.match(OFFLINE_URL);
        });
      })
  );
});
