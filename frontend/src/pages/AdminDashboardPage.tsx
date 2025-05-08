import { useEffect, useState } from "react";
import { useAuth} from "@clerk/clerk-react";
const API_URL = import.meta.env.VITE_API_URL; // VITE_API_URL from .env


// pages/ActionsComponent.tsx
import ActionCard from "../components/ActionCard"; // Import the ActionCard component





interface Email {
  name: string;
  emailAddress: string;
  subject: string;
  body: string;
}

interface Call {
  name: string
  phoneNumber: string;
  callScript: string;
}

interface Insta {
  name: string,
  instagramLink: string;
  comment: string;
}

interface Action {
  _id: string,
  title: string;
  description?: string;
  emailId?: Email;
  callId?: Call;
  instaId?: Insta;
  shareId?: string;
}

const AdminDashboard = () => {
  const [actions, setActions] = useState<Action[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { getToken } = useAuth();
  

  // Fetch function
  const fetchActions = async () => {
    try {
      const token = await getToken();
      const response = await fetch(`${API_URL}/api/actions/created`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
      }
      }); //change this to only get user actions
      const data = await response.json();

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
  //Kept separate to prevent empty actions variable being accessed in syncLocalActions() due to delay.
  useEffect(() => {
    fetchActions();
  }, []);




  const handleDeleteAction = async (deletedId: string) => {
    setActions((prevActions) => prevActions.filter((action) => action._id !== deletedId));
  }

  const handleEditAction = async (actionId: string, formData: any) => {

    const actionIndex = actions.findIndex((action) => action._id === actionId);

    if (actionIndex === -1) {
      console.error('Action not found');
      return;
    }
  
    // Create a new action object by merging the existing action with the updated formData
    const updatedAction = { ...actions[actionIndex] };

    if (formData.mainInfo) {
      updatedAction.title = formData.mainInfo.title;
      updatedAction.description = formData.mainInfo.description;
    }

    if (formData.emailInfo) {
      updatedAction.emailId = { ...updatedAction.emailId, ...formData.emailInfo };
    }

    if (formData.callInfo) {
      updatedAction.callId = { ...updatedAction.callId, ...formData.callInfo };
    }

    if (formData.instaInfo) {
      updatedAction.instaId = { ...updatedAction.instaId, ...formData.instaInfo };
    }
  
    // Update the state by replacing the modified action in the list
    setActions((prevActions) => {
      const updatedActions = [...prevActions];
      updatedActions[actionIndex] = updatedAction;
      return updatedActions;
    });

    console.log('Actions : ', actions);

  }


  return (
    <div>
      <h2>Admin Dashboard</h2>
      {loading && <p>Loading actions...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {actions.slice().reverse().map((action) => (
        <ActionCard 
        key={action._id} 
        action={action} 
        isLinked={false}
        isAdminView={true}
        onDelete={handleDeleteAction} 
        onEdit={handleEditAction}/>
      ))}
    </div>
  );
};

export default AdminDashboard;