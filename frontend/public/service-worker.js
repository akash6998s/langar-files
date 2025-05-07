self.addEventListener('fetch', event => {
  event.respondWith(
      fetch(event.request)
          .then(response => {
              // Clone the response before consuming the body
              const clonedResponse = response.clone();

              // Cache the cloned response
              caches.open('my-cache').then(cache => {
                  cache.put(event.request, clonedResponse);
              });

              // Return the original response (not the cloned one) to the browser
              return response;
          })
          .catch(error => {
              // If fetching fails (e.g., offline), serve from the cache
              return caches.match(event.request).then(cachedResponse => {
                  return cachedResponse || Response.error();
              });
          })
  );
});
