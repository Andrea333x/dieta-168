// ============================================================
// Service Worker — Dieta 16:8 PWA
// Strategia: network-first con fallback cache (gli aggiornamenti
// dei file arrivano subito; offline si usa il precache).
// Bump della versione CACHE a ogni release.
// ============================================================
'use strict';

const CACHE = 'dieta-v8';

const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/app.css',
  './js/app.js',
  './js/assistant.js',
  './js/data/diet.js',
  './js/data/recipes.js',
  './js/data/tips.js',
  './icons/icon-180.png',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      // allSettled: un singolo file mancante non deve bloccare l'installazione
      .then((cache) => Promise.allSettled(ASSETS.map((a) => cache.add(a))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  event.respondWith(
    // network-first: prova la rete e aggiorna la cache; se offline usa la cache
    fetch(req).then((res) => {
      try {
        const sameOrigin = new URL(req.url).origin === self.location.origin;
        if (res && res.ok && sameOrigin) {
          const clone = res.clone();
          caches.open(CACHE).then((c) => c.put(req, clone));
        }
      } catch (e) { /* noop */ }
      return res;
    }).catch(() => {
      return caches.match(req, { ignoreSearch: true }).then((hit) => {
        if (hit) return hit;
        if (req.mode === 'navigate') return caches.match('./index.html');
        return Response.error();
      });
    })
  );
});
