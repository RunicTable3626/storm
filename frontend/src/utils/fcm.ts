
import { initializeApp } from "firebase/app";
import { getMessaging, getToken} from "firebase/messaging";

// Firebase config using Vite environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string,
};

// Initialize Firebase app
const firebaseApp = initializeApp(firebaseConfig);

// Initialize messaging
const messaging = getMessaging(firebaseApp);

/**
 * Get FCM token to enable push notifications.
 */
export const requestFcmToken = async (): Promise<string | null> => {
  try {
    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY as string, // required if using WebPush
    });
    if (token) {
      return token;
    } else {
      console.warn("No registration token available.");
      return null;
    }
  } catch (err) {
    console.error("An error occurred while retrieving FCM token:", err);
    return null;
  }
};

export const registerServiceWorker = async () => {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");

      const sendConfig = () => {
        if (registration.active) {
          registration.active.postMessage({ firebaseConfig });
        } else {
          navigator.serviceWorker.ready.then((reg) => {
            reg.active?.postMessage({ firebaseConfig });
          });
        }
      };

      // Wait a bit to ensure the SW is ready to receive messages
      setTimeout(sendConfig, 1000);
    } catch (err) {
      console.error("Service worker registration failed:", err);
    }
  }
};
