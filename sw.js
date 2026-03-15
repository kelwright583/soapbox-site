/* ============================================
   Service Worker - Soapbox PWA
   Cache-first for assets, network-first for HTML
   ============================================ */

const CACHE_NAME = 'soapbox-v6';
const OFFLINE_PAGE = '/offline.html';

// Core shell files to precache
const PRECACHE_FILES = [
  '/index.html',
  '/about.html',
  '/book.html',
  '/correspondence.html',
  '/dispatches/index.html',
  '/css/styles.css',
  '/js/main.js',
  '/js/sw-register.js',
  '/data/dispatches.json',
  '/offline.html'
];

// Install event - precache core files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(PRECACHE_FILES);
      })
      .then(() => {
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker install error:', error);
      })
  );
});

// Activate event - clean up old caches
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
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Listen for messages to invalidate cache
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'INVALIDATE_CACHE') {
    const urls = event.data.urls || [];
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        return Promise.all(
          urls.map((url) => cache.delete(url))
        );
      }).then(() => {
        // Notify all clients that cache was invalidated
        return self.clients.matchAll().then((clients) => {
          clients.forEach((client) => {
            client.postMessage({
              type: 'CACHE_INVALIDATED',
              urls: urls
            });
          });
        });
      })
    );
  }
});

// Fetch event - caching strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip cross-origin requests
  if (url.origin !== self.location.origin) {
    return;
  }

  // Skip service worker for favicon and icon requests - let browser handle directly
  // This prevents service worker from interfering with icon loading
  const pathname = url.pathname.toLowerCase();
  if (
    pathname.includes('favicon') ||
    pathname.includes('/assets/icons/')
  ) {
    // Don't intercept - let browser handle these requests naturally
    return;
  }

  // Cache-first for CSS, JS, images, fonts
  if (
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'image' ||
    request.destination === 'font'
  ) {
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          return fetch(request)
            .then((response) => {
              // Only cache successful responses
              if (response && response.status === 200) {
                const responseToCache = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                  cache.put(request, responseToCache);
                });
              }
              return response;
            })
            .catch((error) => {
              // If fetch fails, try network one more time without caching
              return fetch(request, { cache: 'no-store' });
            });
        })
        .catch(() => {
          // If cache match fails, try network
          return fetch(request);
        })
    );
    return;
  }

  // Network-first for HTML pages and JSON data files
  if (
    request.destination === 'document' || 
    url.pathname.endsWith('.html') ||
    url.pathname.endsWith('.json')
  ) {
    // For JSON files with cache-busting query params, always fetch fresh
    const hasCacheBuster = url.pathname.endsWith('.json') && url.search.includes('t=');
    
    event.respondWith(
      fetch(request, {
        cache: hasCacheBuster ? 'no-store' : 'default'
      })
        .then((response) => {
          if (response.status === 200) {
            // Only cache if there's no cache-buster
            if (!hasCacheBuster) {
              const responseToCache = response.clone();
              // Use pathname without query for cache key to ensure consistent caching
              const cacheKey = new Request(url.pathname, { method: 'GET' });
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(cacheKey, responseToCache);
              });
            }
          }
          return response;
        })
        .catch(() => {
          // Network failed, try cache (using pathname without query)
          const cacheKey = new Request(url.pathname, { method: 'GET' });
          return caches.match(cacheKey).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // If no cache and it's HTML, return offline page
            if (request.destination === 'document' || url.pathname.endsWith('.html')) {
              return caches.match(OFFLINE_PAGE);
            }
            // For JSON, return error response
            return new Response(JSON.stringify({ error: 'Failed to load data' }), {
              status: 503,
              headers: { 'Content-Type': 'application/json' }
            });
          });
        })
    );
    return;
  }

  // Default: try cache, then network
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request).then((response) => {
          if (response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return response;
        });
      })
  );
});

