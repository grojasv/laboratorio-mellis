// Offline support. Pages and code (HTML/JS/CSS) come from the network first, so a
// new version shows on the next page open; the cache is the fallback when offline
// or when the network takes more than NET_TIMEOUT. Images and fonts are served from
// the cache straight away and refreshed in the background.
// When you add a game, add its files to PRECACHE (or they get cached on first visit).
// Every release: bump CACHE here and VERSION in shared/app.js.
const CACHE = 'mellis-v23';
const NET_TIMEOUT = 3000;
const PRECACHE = [
  './',
  './games.js',
  './families/families.css',
  './families/families.js',
  './families/index.html',
  './games/clock/clock.css',
  './games/clock/clock.js',
  './games/clock/index.html',
  './games/detective/detective.css',
  './games/detective/detective.js',
  './games/detective/index.html',
  './games/memory/index.html',
  './games/memory/memory.css',
  './games/memory/memory.js',
  './learn/town/index.html',
  './learn/town/town.css',
  './learn/town/town-data.js',
  './learn/town/town.js',
  './learn/friends/index.html',
  './learn/friends/friends.css',
  './learn/friends/friends-data.js',
  './learn/friends/friends.js',
  './learn/body/index.html',
  './learn/body/body.css',
  './learn/body/body-data.js',
  './learn/body/body.js',
  './learn/animals/index.html',
  './learn/animals/animals.css',
  './learn/animals/animals-data.js',
  './learn/animals/animals.js',
  './games/radio/index.html',
  './games/radio/radio.css',
  './games/radio/radio-stories.js',
  './games/radio/radio.js',
  './games/passport/index.html',
  './games/passport/passport.css',
  './games/passport/passport.js',
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
  // cache: 'reload' skips the browser's HTTP cache, so the new version gets fresh files
  const reqs = PRECACHE.map((u) => new Request(u, { cache: 'reload' }));
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(reqs)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys()
    .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});

// Revalidate with the server (ETag) instead of trusting the HTTP cache. A navigation
// request can't be copied with options, so fetch its URL (falling back to the original
// request if the server redirects, which a navigation response must not be).
async function fetchFresh(req) {
  if (req.mode !== 'navigate') return fetch(req, { cache: 'no-cache' });
  const res = await fetch(req.url, { cache: 'no-cache', credentials: 'same-origin' });
  return res.redirected ? fetch(req) : res;
}

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const ours = url.origin === location.origin;
  const fonts = /fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);
  if (!ours && !fonts) return;
  const networkFirst = ours && !/\.(png|jpe?g|svg|ico|webp|woff2?)$/i.test(url.pathname);
  e.respondWith(caches.open(CACHE).then(async (cache) => {
    // Folder URLs (games/memory/) are precached as their index.html
    const cached = await cache.match(req, { ignoreSearch: ours })
      || (ours && url.pathname.endsWith('/') ? await cache.match(url.pathname + 'index.html') : undefined);
    const fresh = (networkFirst ? fetchFresh(req) : fetch(req)).then((res) => {
      if (res.ok || res.type === 'opaque') cache.put(req, res.clone());
      return res.ok || !cached ? res : cached;
    });
    e.waitUntil(fresh.catch(() => {}));
    const fallback = fresh.catch(() => cached || Response.error());
    if (!cached) return fallback;
    if (!networkFirst) return cached;
    const slow = new Promise((r) => setTimeout(() => r(cached), NET_TIMEOUT));
    return Promise.race([fallback, slow]);
  }));
});
