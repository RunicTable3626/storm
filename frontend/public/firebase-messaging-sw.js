importScripts("https://www.gstatic.com/firebasejs/10.11.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.11.0/firebase-messaging-compat.js");

let firebaseConfig = null;

self.addEventListener("message", (event) => {
  if (event.data && event.data.firebaseConfig) {
    const firebaseConfig = event.data.firebaseConfig;
    firebase.initializeApp(firebaseConfig);
  }
});


// Add the push event listener at the top of the worker script (this is critical)
self.addEventListener('push', (event) => {
  console.log('Push event received', event);

  const payload = event.data ? event.data.json() : {};
  const { title, body } = payload.notification || {};

  // Show notification
  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: '/goose.png', // optional icon
    })
  );
});

// Add the notificationclick event listener
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked', event);

  // Handle notification click actions (e.g., open the app or a specific page)
  event.notification.close(); // Close the notification
  event.waitUntil(
    clients.openWindow('/action-dashboard') // Open a page when the notification is clicked
  );
});