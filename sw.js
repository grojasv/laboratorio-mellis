// Offline support. Pages and assets are served from the cache straight away
// and refreshed in the background, so a new version shows on the next visit.
// When you add a game, add its files to PRECACHE (or they get cached on first visit).
const CACHE = 'mellis-v8';
const PRECACHE = [
  './',
  './games.js',
  './games/detective/detective.css',
  './games/detective/detective.js',
  './games/detective/index.html',
  './games/memory/index.html',
  './games/memory/memory.css',
  './games/memory/memory.js',
  './games/monsters/index.html',
  './games/monsters/monsters.css',
  './games/monsters/monsters.js',
  './games/potions/index.html',
  './games/potions/potions.css',
  './games/potions/potions.js',
  './games/reading/index.html',
  './games/puppets/art.js',
  './games/puppets/index.html',
  './games/puppets/puppets.css',
  './games/puppets/puppets.js',
  './games/reading/reading.css',
  './games/reading/reading.js',
  './games/reading/stories.js',
  './icons/apple-touch-icon.png',
  './icons/favicon-32.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/maskable-192.png',
  './icons/maskable-512.png',
  './index.html',
  './manifest.webmanifest',
  './news.js',
  './shared/app.js',
  './shared/game.css',
  './shared/styles.css',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys()
    .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const ours = url.origin === location.origin;
  const fonts = /fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);
  if (!ours && !fonts) return;
  e.respondWith(caches.open(CACHE).then(async (cache) => {
    const cached = await cache.match(req, { ignoreSearch: ours });
    const fresh = fetch(req).then((res) => {
      if (res.ok || res.type === 'opaque') cache.put(req, res.clone());
      return res;
    }).catch(() => cached);
    return cached || fresh;
  }));
});
