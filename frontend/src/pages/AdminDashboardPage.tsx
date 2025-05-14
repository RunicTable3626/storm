import { useEffect, useState } from "react";
import { useAuth, useUser} from "@clerk/clerk-react";
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
  createdBy: string;
  startDate: Date;
  createdAt: Date;
}

const AdminDashboard = () => {
  const [actions, setActions] = useState<Action[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { getToken } = useAuth();
  const { user } = useUser();
  const role = user?.publicMetadata?.role;
  

  // Fetch function
  const fetchActions = async () => {
    let response;
    try {
      if (role === 'superadmin') {
        response = await fetch(`${API_URL}/api/actions`); //gets all actions from all users
      } else {
        const token = await getToken();
        response = await fetch(`${API_URL}/api/actions/created`, { //only gets actions from that specific user
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        }
        }); 
      }

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


  }

  const sortedActions = actions.sort((a, b) => {
    // Determine which date to use (startDate or createdAt)
    const aDate = a.startDate ?? a.createdAt;
    const bDate = b.startDate ?? b.createdAt;
  
    // Compare dates and return sorting order
    return new Date(bDate).getTime() - new Date(aDate).getTime();
  });



  return (
<div>
  {role === 'superadmin' && (
      <h2>Superadmin Dashboard</h2>
    )}

  {role !== 'superadmin' && (
      <h2>Admin Dashboard</h2>
    )}
  
  <div className="flex flex-row gap-4 w-full">
    <div className="w-1/2">

    <p>Use this dashboard to monitor, edit and delete actions that you have created!</p>
    </div>

    <div className="w-1/2">
      {loading && <p>Loading actions...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {Array.isArray(actions) &&
        sortedActions.map((action) => (
          <ActionCard 
            key={action._id} 
            action={action} 
            isLinked={false}
            isAdminView={true}
            onDelete={handleDeleteAction} 
            onEdit={handleEditAction}
          />
        ))}
    </div>
  </div>
</div>
  );
};

export default AdminDashboard;