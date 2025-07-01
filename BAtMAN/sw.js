const CACHE_NAME = 'batman-discipline-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'UPDATE_TASKS') {
    const now = new Date();
    
    event.data.tasks.forEach(task => {
      if (!task.completed && task.date && task.time) {
        const taskTime = new Date(`${task.date} ${task.time}`);
        const timeDiff = taskTime - now;
        
        if (timeDiff > 0 && timeDiff <= 10 * 60 * 1000) {
          self.registration.showNotification('BATMAN DISCIPLINE', {
            body: `Mission Alert: ${task.text}`,
            icon: 'https://placehold.co/96x96?text=BATMAN',
            badge: 'https://placehold.co/96x96?text=BATMAN'
          });
        }
      }
    });
  }
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});
