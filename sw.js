const CACHE_NAME = 'courier-calculators-v3';
const urlsToCache = [
    './',
    './index.html',
    './styles.css',
    './volumetric-calculator.html',
    './reverse-pickup.html',
    './rate-calculator.html',
    './manifest.json',
    './icon-192x192.png',
    './icon-512x512.png',
    'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
            .catch(() => {
                // Fallback for failed requests
                if (event.request.mode === 'navigate') {
                    return caches.match('./index.html');
                }
            })
    );
});