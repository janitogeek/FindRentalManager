const CACHE_NAME = 'bookdirectstays-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/src/main.tsx',
  '/src/index.css'
];

// Pre-load all data as soon as service worker is installed
async function preloadAllData() {
  try {
    console.log('🚀 Service Worker: Starting background data pre-load...');
    
    // Get the API base URL from the current origin
    const baseUrl = self.location.origin;
    
    // Fetch and cache all submissions data
    const submissionsResponse = await fetch(`${baseUrl}/api/airtable-submissions`);
    if (submissionsResponse.ok) {
      const submissionsData = await submissionsResponse.json();
      
      // Store in localStorage equivalent for service worker (use IndexedDB)
      // For now, we'll trigger the main app's data preloader by setting a flag
      await caches.open('bds-preload-cache').then(cache => {
        return cache.put('/api/preload-trigger', new Response(JSON.stringify({
          preloaded: true,
          timestamp: Date.now(),
          submissionsCount: submissionsData.length
        })));
      });
      
      console.log(`✅ Service Worker: Pre-loaded ${submissionsData.length} submissions`);
    }
    
    console.log('🎯 Service Worker: Data pre-loading completed!');
  } catch (error) {
    console.error('❌ Service Worker: Pre-loading failed:', error);
  }
}

// Install event - cache resources AND pre-load data
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      // Cache static resources
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(urlsToCache);
      }),
      // Pre-load all data in background
      preloadAllData()
    ])
  );
});

// Fetch event - serve from cache when possible
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});


