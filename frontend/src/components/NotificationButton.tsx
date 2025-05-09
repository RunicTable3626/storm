import { Bell, BellRing } from "lucide-react"; // Using two icons: Bell (idle) and BellRing (subscribed)
import { useState } from "react";
import { requestFcmToken } from "../utils/fcm";
import { v4 as uuidv4 } from "uuid";
const API_URL = import.meta.env.VITE_API_URL; // VITE_API_URL from .env


const NotificationButton = () => {
  const [subscribing, setSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [message, setMessage] = useState('Use to get notified about new actions!');

  const handleSubscribe = async () => {
    setSubscribing(true);
    const existingId = localStorage.getItem("stormUserId");
    const userId = existingId || uuidv4();
    if (!existingId) localStorage.setItem("stormUserId", userId);

    try {
        const fcmToken = await requestFcmToken();
  
        if (fcmToken) {
            const response = await fetch(`${API_URL}/api/notifications/subscribe`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, fcmToken }),
            });

            if (response.ok) {
                const data = await response.json();
                setSubscribed(true);
                setMessage(data.message);
                setTimeout(() => {setSubscribed(false); setMessage('');}, 1000); 
              } else {
                const data = await response.json();
                setMessage(data.message || "Subscription failed.")
                setTimeout(() => {setMessage('Try Again later!');}, 1000); 
                console.error(data.message || "Subscription failed.");
              }

        } else {
            console.warn("No FCM token received. Permission may be blocked");
        }

    } catch (err) {
      setMessage("Network error while subscribing.")  
      console.error("Network error while subscribing.");
      setTimeout(() => {setMessage('');}, 1000); 
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <div>
    <button
      onClick={handleSubscribe}
      disabled={subscribing || subscribed}
      className="flex items-center gap-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
    >
      {subscribed ? <BellRing size={24} /> : <Bell size={24} />}
    </button>
    {message && <span style={{ color: "black", marginLeft: "10px" }}>{message}</span>}
    </div>
  );
};

export default NotificationButton;
