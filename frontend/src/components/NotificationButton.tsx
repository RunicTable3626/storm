import { Bell, BellRing } from "lucide-react"; // Using two icons: Bell (idle) and BellRing (subscribed)
import { useState } from "react";

const NotificationButton = () => {
  const [subscribing, setSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async () => {
    setSubscribing(true);
    setError(null);

    try {
      const response = await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Optionally, you can send additional data like FCM token here if you want
        }),
      });

      if (response.ok) {
        setSubscribed(true);
      } else {
        const data = await response.json();
        setError(data.message || "Subscription failed.");
      }
    } catch (err) {
      setError("Network error while subscribing.");
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <button
      onClick={handleSubscribe}
      disabled={subscribing || subscribed}
      className="flex items-center gap-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
    >
      {subscribed ? <BellRing size={24} /> : <Bell size={24} />}
    </button>
  );
};

export default NotificationButton;
