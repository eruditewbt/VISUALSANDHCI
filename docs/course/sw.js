const CACHE_PREFIX = "visualsandhci-app-shell-";
const CACHE_NAME = `${CACHE_PREFIX}v2`;

function appRoot() {
  return new URL("./", self.registration.scope);
}

function isAllowedStaticAsset(url) {
  const root = appRoot();
  if (url.origin !== root.origin || !url.pathname.startsWith(root.pathname)) return false;
  if (url.pathname === root.pathname || url.pathname.endsWith("/index.html")) return false;
  if (/\/(?:api|\.netlify)\//i.test(url.pathname)) return false;
  return /\.(?:js|css|svg|png|jpe?g|webp|gif|woff2?|ttf|ico|webmanifest|mp4|webm|vtt)$/i.test(url.pathname);
}

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.add(appRoot().href);
    try {
      const manifestResponse = await fetch(new URL("asset-manifest.json", appRoot()), { cache: "no-store" });
      if (manifestResponse.ok) {
        const manifest = await manifestResponse.json();
        const assetPaths = new Set();
        for (const entry of Object.values(manifest)) {
          if (entry?.file) assetPaths.add(entry.file);
          for (const file of entry?.css ?? []) assetPaths.add(file);
          for (const file of entry?.assets ?? []) assetPaths.add(file);
        }
        await Promise.all([...assetPaths].map(async (assetPath) => {
          const assetUrl = new URL(assetPath, appRoot());
          if (isAllowedStaticAsset(assetUrl)) {
            try { await cache.add(assetUrl.href); } catch { /* Keep shell installable if an optional asset fails. */ }
          }
        }));
      }
    } catch { /* Older deployments remain app-shell cacheable. */ }
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter((name) => name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME).map((name) => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (request.mode === "navigate" && url.origin === appRoot().origin && url.pathname.startsWith(appRoot().pathname)) {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        if (response.ok) {
          const cache = await caches.open(CACHE_NAME);
          await cache.put(appRoot().href, response.clone());
        }
        return response;
      } catch {
        return (await caches.match(appRoot().href)) || Response.error();
      }
    })());
    return;
  }
  if (!isAllowedStaticAsset(url) || request.headers.has("range")) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
    if (cached) return cached;
    try {
      const response = await fetch(request);
      if (response.ok && response.type === "basic") await cache.put(request, response.clone());
      return response;
    } catch {
      return Response.error();
    }
  })());
});
