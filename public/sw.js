// Service Worker for Wake Force Alarm App
// Handles background alarm functionality when app is not active

const CACHE_NAME = 'wake-force-v1';
const ALARM_AUDIO_CACHE = 'alarm-audio-v1';

// Cache essential files for offline alarm functionality
const STATIC_CACHE_FILES = [
  '/',
  '/index.html',
  '/sounds/placeholder.txt',
  '/manifest.json'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching static files');
      return cache.addAll(STATIC_CACHE_FILES);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== ALARM_AUDIO_CACHE) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached version or fetch from network
      return response || fetch(event.request);
    })
  );
});

// Handle background sync for alarm scheduling
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync-alarms') {
    console.log('Background sync for alarms');
    event.waitUntil(syncAlarms());
  }
});

// Handle push notifications for alarms
self.addEventListener('push', (event) => {
  console.log('Push notification received');
  
  let notificationData = {};
  
  if (event.data) {
    try {
      notificationData = event.data.json();
    } catch (e) {
      notificationData = {
        title: 'Wake Force Alarm',
        body: 'Time to wake up!',
        icon: '/favicon.ico'
      };
    }
  }

  const options = {
    title: notificationData.title || 'Wake Force Alarm',
    body: notificationData.body || 'Time to wake up!',
    icon: notificationData.icon || '/favicon.ico',
    badge: '/favicon.ico',
    vibrate: [200, 100, 200, 100, 200, 100, 200],
    requireInteraction: true,
    persistent: true,
    actions: [
      {
        action: 'dismiss',
        title: 'Dismiss'
      },
      {
        action: 'snooze',
        title: 'Snooze'
      }
    ],
    data: {
      alarmId: notificationData.alarmId,
      soundName: notificationData.soundName,
      timestamp: Date.now()
    }
  };

  event.waitUntil(
    self.registration.showNotification(options.title, options)
  );
});

// Handle notification click events
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event.action);
  
  event.notification.close();

  if (event.action === 'dismiss') {
    // Handle dismiss action
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        if (clientList.length > 0) {
          return clientList[0].postMessage({
            type: 'ALARM_DISMISSED',
            alarmId: event.notification.data.alarmId
          });
        }
      })
    );
  } else if (event.action === 'snooze') {
    // Handle snooze action
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        if (clientList.length > 0) {
          return clientList[0].postMessage({
            type: 'ALARM_SNOOZED',
            alarmId: event.notification.data.alarmId
          });
        }
      })
    );
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        // Focus existing window or open new one
        if (clientList.length > 0) {
          return clientList[0].focus();
        } else {
          return clients.openWindow('/');
        }
      })
    );
  }
});

// Background alarm sync function
async function syncAlarms() {
  try {
    console.log('Syncing alarms in background...');
    
    // Get stored alarms from IndexedDB or local storage
    const alarms = await getStoredAlarms();
    
    // Check if any alarms should trigger now
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    alarms.forEach(alarm => {
      if (alarm.isActive && alarm.time === currentTime) {
        // Trigger alarm notification
        triggerAlarm(alarm);
      }
    });
    
  } catch (error) {
    console.error('Error syncing alarms:', error);
  }
}

// Get stored alarms (you'll need to implement storage)
async function getStoredAlarms() {
  // This would typically read from IndexedDB
  // For now, return empty array
  return [];
}

// Trigger alarm function
function triggerAlarm(alarm) {
  console.log('Triggering alarm:', alarm);
  
  // Show notification
  self.registration.showNotification('Wake Force Alarm', {
    body: alarm.label || 'Time to wake up!',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    vibrate: [500, 110, 500, 110, 450, 110, 200, 110, 170, 40, 450, 110, 200, 110, 170, 40, 500],
    requireInteraction: true,
    persistent: true,
    actions: [
      { action: 'dismiss', title: 'Dismiss' },
      { action: 'snooze', title: 'Snooze 5 min' }
    ],
    data: {
      alarmId: alarm.id,
      soundName: alarm.soundName,
      timestamp: Date.now()
    }
  });

  // Try to wake the app
  clients.matchAll({ type: 'window' }).then((clientList) => {
    clientList.forEach(client => {
      client.postMessage({
        type: 'ALARM_TRIGGERED',
        alarm: alarm
      });
    });
  });
}

console.log('Service Worker loaded successfully');