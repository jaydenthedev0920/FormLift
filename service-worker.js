const CACHE_NAME = "formlift-cache-v1";

const ASSETS = [
    "/",
    "/index.html",
    "/offline.html",
    "/style.css",
    "/script.js",
    "/manifest.json"
];

// Install
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
    );
});

// Fetch
self.addEventListener("fetch", event => {
    event.respondWith(
        fetch(event.request).catch(() => caches.match(event.request).then(res => {
            return res || caches.match("/offline.html");
        }))
    );
});
