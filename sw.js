const CACHE_NAME = 'courier-calculators-v1';
const urlsToCache = [
    '/Courier_Web_Calculators/',
    '/Courier_Web_Calculators/index.html',
    '/Courier_Web_Calculators/volumetric-calculator.html',
    '/Courier_Web_Calculators/reverse-pickup.html',
    '/Courier_Web_Calculators/styles.css',
    '/Courier_Web_Calculators/manifest.json',
    '/Courier_Web_Calculators/icon-192x192.png',
    '/Courier_Web_Calculators/icon-512x512.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
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
    );
});