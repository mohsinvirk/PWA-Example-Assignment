const static_cache = "static-cache-01";
const dynaimcCache = "dynamic-cache-01";
const filesToCache = ["/", "/index.html", "/index.js", "/offline.html"];

self.addEventListener("install", e => {
  console.log("SW Registered!");
  e.waitUntil(
    caches.open(static_cache).then(cache => {
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener("activate", e => {
  console.log("SW Activated");
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== static_cache && key !== dynaimcCache) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    fetch(e.request)
      .then(response => {
        const clonedResponse = response.clone();
        if (
          e.request.url.indexOf(
            "https://api.github.com/users/defunkt/followers"
          ) !== -1
        ) {
          caches.open(dynaimcCache).then(cache => {
            cache.put(e.request, clonedResponse);
          });
        }
        if (e.request.destination === "image") {
          caches.open(dynaimcCache).then(cache => {
            cache.put(e.request, clonedResponse);
          });
        }
        console.log("Direct from Network", e.request);
        return response;
      })
      .catch(_ => {
        return caches.match(e.request).then(response => {
          if (response) {
            console.log("Direct from Cache", e.request);
            return response;
          }
          console.log("Offline", e.request);
          return caches.match("offline.html");
        });
      })
  );
});
