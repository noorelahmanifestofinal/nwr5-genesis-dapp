
self.addEventListener("install", function(e) {
  e.waitUntil(
    caches.open("nwr5-badge").then(function(cache) {
      return cache.addAll(["/", "/index.html", "/style.css", "/dapp.js"]);
    })
  );
});
self.addEventListener("fetch", function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});
