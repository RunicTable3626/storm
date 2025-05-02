
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

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
      console.log("FCM token retrieved:", token);
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

/**
 * Listen for foreground messages.
 */
export const onForegroundMessage = (callback: (payload: any) => void): void => {
  onMessage(messaging, callback);
};

export const registerServiceWorker = async () => {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
      console.log("Service worker registered:", registration);
    } catch (err) {
      console.error("Service worker registration failed:", err);
    }
  }
};
