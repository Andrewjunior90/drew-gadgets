const CACHE_NAME = "drew-gadgets-v2";

const urlsToCache = [
  "/",
  "/index.html",
  "/logo.png.jpg",
  "/offline.html"
];

// Install
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// Activate
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
});

// Fetch (network first, fallback to cache, then offline page)
self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request)
      .then(res => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, res.clone());
          return res;
        });
      })
      .catch(() => {
        return caches.match(event.request)
          .then(res => res || caches.match("/offline.html"));
      })
  );
});
