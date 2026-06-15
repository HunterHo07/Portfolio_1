const STATIC_CACHE = "hunter-static-v2.2.11";
const IMAGE_CACHE = "hunter-images-v2.2.11";
const STATIC_ASSETS = [
  "./",
  "./index.html",
  "./css/style.min.css?v=2.2.11",
  "./css/responsive.min.css?v=2.2.11",
  "./js/main.min.js?v=2.2.11",
  "./images/logo.svg",
  "./images/favicon.svg",
  "./images/favicon.webp",
  "./images/hero-options/option-c-three-source.webp",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  const expectedCaches = new Set([STATIC_CACHE, IMAGE_CACHE]);

  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(
          names
            .filter((name) => name.startsWith("hunter-") && !expectedCaches.has(name))
            .map((name) => caches.delete(name)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

function isSameOrigin(requestUrl) {
  return requestUrl.origin === self.location.origin;
}

function cacheFirst(request, cacheName) {
  return caches.match(request, { ignoreSearch: true }).then((cached) => {
    if (cached) {
      return cached;
    }

    return fetch(request).then((response) => {
      if (response && response.ok) {
        const clone = response.clone();
        caches.open(cacheName).then((cache) => cache.put(request, clone));
      }

      return response;
    });
  });
}

function staleWhileRevalidate(request, cacheName) {
  return caches.open(cacheName).then((cache) =>
    cache.match(request, { ignoreSearch: true }).then((cached) => {
      const network = fetch(request).then((response) => {
        if (response && response.ok) {
          cache.put(request, response.clone());
        }

        return response;
      });

      return cached || network;
    }),
  );
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const requestUrl = new URL(request.url);

  if (request.method !== "GET" || !isSameOrigin(requestUrl)) {
    return;
  }

  if (request.destination === "image") {
    event.respondWith(cacheFirst(request, IMAGE_CACHE));
    return;
  }

  if (
    request.destination === "style" ||
    request.destination === "script" ||
    request.mode === "navigate"
  ) {
    event.respondWith(staleWhileRevalidate(request, STATIC_CACHE));
  }
});
