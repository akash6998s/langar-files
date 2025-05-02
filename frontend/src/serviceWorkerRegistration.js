// src/serviceWorkerRegistration.js

// This function registers the service worker
export function register() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        // Register service worker in the public folder
        navigator.serviceWorker
          .register('/service-worker.js') // This should point to the service-worker.js in the public folder
          .then((registration) => {
            console.log('Service Worker registered with scope:', registration.scope);
          })
          .catch((error) => {
            console.error('Service Worker registration failed:', error);
          });
      });
    }
  }
  