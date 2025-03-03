import { useEffect, useState } from "react";

// pages/ActionsComponent.tsx
import ActionCard from "../components/ActionCard"; // Import the ActionCard component

const ActionDashboard = () => {
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch function
  const fetchActions = async () => {
    try {
      const response = await fetch("/api/actions"); // Adjust URL if necessary
      const data = await response.json();
      console.log(data)

      if (!response.ok) throw new Error(data.error || "Failed to fetch actions");

      setActions(data); // Store the fetched actions

    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("an unknown error occurred.")
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchActions();
  }, []);

  return (
    <div>
      <h2>Actions Dashboard</h2>
      {loading && <p>Loading actions...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Render ActionCard for each action */}
      {actions.map((action, index) => (
        <ActionCard key={action._id || index} action={action} />
      ))}
    </div>
  );
};

export default ActionDashboard;