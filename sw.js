const CACHE_NAME = 'courier-calculators-v2'; // Cache name-ஐ மாற்றவும் (v1 → v2)

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
    // Service Worker-ஐ உடனடியாக activate செய்ய
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    // Clients-ஐ உடனடியாக control செய்ய
    self.clients.claim();
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache-ல் இருந்தால் அதை பயன்படுத்தவும், இல்லையென்றால் network-ல் இருந்து பெறவும்
                if (response) {
                    // Network-ல் புதிய பதிப்பு உள்ளதா என்று சரிபார்க்க
                    fetch(event.request).then(networkResponse => {
                        if (networkResponse.ok) {
                            caches.open(CACHE_NAME).then(cache => {
                                cache.put(event.request, networkResponse.clone());
                            });
                        }
                    }).catch(() => {});
                    return response;
                }
                return fetch(event.request).then(networkResponse => {
                    if (networkResponse.ok) {
                        caches.open(CACHE_NAME).then(cache => {
                            cache.put(event.request, networkResponse.clone());
                        });
                    }
                    return networkResponse;
                });
            })
    );
});