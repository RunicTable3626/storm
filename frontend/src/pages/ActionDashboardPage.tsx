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

      if (!response.ok) throw new Error(data.error || "Failed to fetch actions");
      console.log(data);

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

  const handleDeleteAction = async (deletedId: string) => {
    setActions((prevActions) => prevActions.filter((action) => action._id !== deletedId));
  }



  return (
    <div>
      <h2>Actions Dashboard</h2>
      {loading && <p>Loading actions...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Render ActionCard for each action, ignore the error under _id it renders correctly */}
      {actions.slice().reverse().map((action) => (
        <ActionCard key={action._id} action={action} onDelete={handleDeleteAction} />
      ))}
    </div>
  );
};

export default ActionDashboard;