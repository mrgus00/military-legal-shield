// MilitaryLegalShield Service Worker
const CACHE_NAME = 'military-legal-shield-v1.0.0';
const STATIC_CACHE = 'static-v1.0.0';
const DYNAMIC_CACHE = 'dynamic-v1.0.0';

// Files to cache for offline functionality
const STATIC_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/urgent-match',
  '/ai-case-analysis',
  '/find-attorneys',
  '/document-generator',
  '/resources',
  '/education',
  '/legal-resources',
  '/emergency-consultation'
];

// API endpoints to cache for offline access
const API_CACHE_PATTERNS = [
  '/api/attorneys',
  '/api/legal-resources',
  '/api/emergency-contacts',
  '/api/seo/status'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('Service Worker: Static files cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Error caching static files', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated successfully');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }

  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(handleNavigationRequest(request));
    return;
  }

  // Handle other requests (assets, etc.)
  event.respondWith(handleStaticRequest(request));
});

// Handle API requests with cache-first strategy for specific endpoints
async function handleApiRequest(request) {
  const url = new URL(request.url);
  const shouldCache = API_CACHE_PATTERNS.some(pattern => 
    url.pathname.startsWith(pattern)
  );

  if (shouldCache) {
    try {
      const cache = await caches.open(DYNAMIC_CACHE);
      const cachedResponse = await cache.match(request);

      if (cachedResponse) {
        // Return cached version and update in background
        fetchAndCache(request, cache);
        return cachedResponse;
      }

      // Fetch from network and cache
      const networkResponse = await fetch(request);
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    } catch (error) {
      console.error('Service Worker: API request failed', error);
      return new Response(JSON.stringify({
        error: 'Network unavailable',
        offline: true,
        message: 'Please check your internet connection and try again.'
      }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // For non-cached API requests, just try network
  try {
    return await fetch(request);
  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Network unavailable',
      offline: true
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Handle navigation requests - serve index.html for SPA routing
async function handleNavigationRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    return networkResponse;
  } catch (error) {
    // Fallback to cached index.html for offline SPA routing
    const cache = await caches.open(STATIC_CACHE);
    const cachedResponse = await cache.match('/index.html');
    return cachedResponse || new Response('Offline - Please check your connection', {
      status: 503,
      headers: { 'Content-Type': 'text/html' }
    });
  }
}

// Handle static requests with cache-first strategy
async function handleStaticRequest(request) {
  try {
    const cache = await caches.open(STATIC_CACHE);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('Service Worker: Static request failed', error);
    return new Response('Resource unavailable offline', { status: 503 });
  }
}

// Background fetch and cache update
async function fetchAndCache(request, cache) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
  } catch (error) {
    console.error('Service Worker: Background fetch failed', error);
  }
}

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received');
  
  let notificationData = {
    title: 'MilitaryLegalShield',
    body: 'You have a new update',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    tag: 'military-legal-notification',
    requireInteraction: true,
    actions: [
      {
        action: 'open',
        title: 'Open App',
        icon: '/icons/open-icon.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/icons/dismiss-icon.png'
      }
    ]
  };

  if (event.data) {
    try {
      const pushData = event.data.json();
      notificationData = {
        ...notificationData,
        ...pushData
      };
    } catch (error) {
      console.error('Service Worker: Error parsing push data', error);
    }
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, notificationData)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked');
  
  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  // Default action or 'open' action
  event.waitUntil(
    clients.matchAll({ type: 'window' })
      .then((clientList) => {
        // If app is already open, focus it
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Otherwise open new window
        if (clients.openWindow) {
          const urlToOpen = event.notification.data?.url || '/';
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered', event.tag);
  
  if (event.tag === 'emergency-consultation') {
    event.waitUntil(syncEmergencyConsultations());
  } else if (event.tag === 'case-analysis') {
    event.waitUntil(syncCaseAnalysis());
  }
});

// Sync emergency consultations when back online
async function syncEmergencyConsultations() {
  try {
    // Retrieve stored emergency requests from IndexedDB
    const storedRequests = await getStoredEmergencyRequests();
    
    for (const request of storedRequests) {
      try {
        const response = await fetch('/api/emergency-consultation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(request.data)
        });
        
        if (response.ok) {
          await removeStoredRequest(request.id);
          console.log('Service Worker: Emergency request synced successfully');
        }
      } catch (error) {
        console.error('Service Worker: Failed to sync emergency request', error);
      }
    }
  } catch (error) {
    console.error('Service Worker: Background sync failed', error);
  }
}

// Sync case analysis when back online
async function syncCaseAnalysis() {
  try {
    const storedAnalysis = await getStoredCaseAnalysis();
    
    for (const analysis of storedAnalysis) {
      try {
        const response = await fetch('/api/ai/analyze-case', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(analysis.data)
        });
        
        if (response.ok) {
          await removeStoredAnalysis(analysis.id);
          console.log('Service Worker: Case analysis synced successfully');
        }
      } catch (error) {
        console.error('Service Worker: Failed to sync case analysis', error);
      }
    }
  } catch (error) {
    console.error('Service Worker: Case analysis sync failed', error);
  }
}

// IndexedDB helpers for offline storage
async function getStoredEmergencyRequests() {
  // Implementation would connect to IndexedDB to retrieve stored requests
  return [];
}

async function removeStoredRequest(id) {
  // Implementation would remove synced request from IndexedDB
  console.log('Removing synced request:', id);
}

async function getStoredCaseAnalysis() {
  // Implementation would connect to IndexedDB to retrieve stored analysis
  return [];
}

async function removeStoredAnalysis(id) {
  // Implementation would remove synced analysis from IndexedDB
  console.log('Removing synced analysis:', id);
}

// Skip waiting for immediate activation during development
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('Service Worker: Script loaded successfully');