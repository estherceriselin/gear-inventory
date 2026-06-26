// Service worker — network-first so updates always come through when online,
// cache only used as an offline fallback for the app shell.
var CACHE = "gear-inventory-v1";
var SHELL = ["./index.html", "./manifest.json", "./icon-192.png", "./icon-512.png"];

self.addEventListener("install", function(e) {
  e.waitUntil(caches.open(CACHE).then(function(c) { return c.addAll(SHELL); }));
  self.skipWaiting();
});

self.addEventListener("activate", function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.filter(function(k) { return k !== CACHE; })
        .map(function(k) { return caches.delete(k); }));
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", function(e) {
  // Never touch the Google Apps Script API — always go to network for data.
  if (e.request.url.indexOf("script.google.com") !== -1) return;
  // Only handle same-origin GET requests for the app shell.
  if (e.request.method !== "GET") return;

  e.respondWith(
    fetch(e.request).then(function(resp) {
      var copy = resp.clone();
      caches.open(CACHE).then(function(c) { c.put(e.request, copy); });
      return resp;
    }).catch(function() {
      return caches.match(e.request).then(function(hit) {
        return hit || caches.match("./index.html");
      });
    })
  );
});
