const CACHE_NAME = "formlift-cache-v2";

const ASSETS = [
    "./",
    "./index.html",
    "./offline.html",
    "./style.css",
    "./script.js",
    "./manifest.json"
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
    );
    self.skipWaiting();
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            )
        )
    );
    self.clients.claim();
});

self.addEventListener("fetch", event => {
    const req = event.request;

    // Only use offline.html for full page navigations
    if (req.mode === "navigate") {
        event.respondWith(
            fetch(req).catch(() =>
                caches.match(req).then(res => res || caches.match("./offline.html"))
            )
        );
        return;
    }

    // For CSS/JS/etc: try network, fall back to cache, but NEVER offline.html
    event.respondWith(
        fetch(req)
            .then(res => {
                const resClone = res.clone();
                caches.open(CACHE_NAME).then(cache => cache.put(req, resClone));
                return res;
            })
            .catch(() => caches.match(req))
    );
});
