/// <reference lib="webworker" />

// This service worker can be customized!
// See https://developers.google.com/web/tools/workbox/modules
// for the list of available Workbox modules, or add any other
// code you'd like.
// You can also remove this file if you'd prefer not to use a
// service worker, and the Workbox build step will be skipped.

declare const self: ServiceWorkerGlobalScope

const CACHE_NAME = "job-card-app-v1"
const OFFLINE_URL = "/offline"

// Add an event listener to install the service worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        "/",
        "/offline",
        "/manifest.json",
        "/icons/icon-192x192.png",
        "/icons/icon-512x512.png",
        "/globals.css",
      ])
    }),
  )

  // Force the waiting service worker to become the active service worker
  self.skipWaiting()
})

// Add an event listener to activate the service worker
self.addEventListener("activate", (event) => {
  // Clean up old caches
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )

  // Tell the active service worker to take control of the page immediately
  self.clients.claim()
})

// Add an event listener to fetch requests
self.addEventListener("fetch", (event) => {
  // Skip cross-origin requests
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(OFFLINE_URL)
      }),
    )
  } else {
    event.respondWith(
      caches
        .match(event.request)
        .then((response) => {
          return (
            response ||
            fetch(event.request).then((fetchResponse) => {
              // Don't cache API calls or other dynamic content
              if (!event.request.url.includes("/api/") && !event.request.url.includes("chrome-extension")) {
                return caches.open(CACHE_NAME).then((cache) => {
                  cache.put(event.request, fetchResponse.clone())
                  return fetchResponse
                })
              }
              return fetchResponse
            })
          )
        })
        .catch(() => {
          // For image requests, return a default offline image
          if (event.request.destination === "image") {
            return caches.match("/icons/offline-image.png")
          }

          // For other requests, just return a response indicating offline
          return new Response("You are offline")
        }),
    )
  }
})

// This allows TypeScript to check that the event listeners are valid
export {}
