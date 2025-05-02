self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('v1').then((cache) => {
      return cache.addAll([
        '/index.html',   // Always cache the essential HTML
        '/logo192.png',  // Cache the logo for PWA
        '/logo512.png',  // Cache the logo for PWA
        // Dynamically cache all the static assets generated during build
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;  // Serve from cache
      }

      // Otherwise, fetch the request and cache it for future use
      return fetch(event.request).then((response) => {
        if (event.request.url.indexOf('http') === 0) {
          caches.open('v1').then((cache) => {
            cache.put(event.request, response.clone());
          });
        }
        return response;
      });
    })
  );
});
