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
  name: string;
  phoneNumber: string;
  script: string;
}

interface Insta {
  postId: string;
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
      <div className="relative w-full h-[70vh]">
        <div 
          className="absolute inset-0 bg-cover bg-top bg-no-repeat"
          style={{
            backgroundImage: "url('./src/assets/WAM29363.jpg')",
            backgroundPosition: "center 25%" 
          }}
        />
        <div className="absolute inset-0 bg-black/65" />
        <div className="relative flex p-0 flex-col items-center justify-center h-full text-white">
          <h1 className="text-5xl md:text-6xl text-4xl font-bold mb-4 tracking-wider flex flex-wrap justify-center gap-x-3 gap-y-0 px-2">
            <span className="opacity-0 animate-[fadeIn_0.3s_ease-out_.25s_forwards]">{role === 'superadmin' ? 'SUPERADMIN' : 'ADMIN'}</span>
            <span className="text-violet-500 opacity-0 animate-[fadeIn_0.3s_ease-out_0.45s_forwards]">DASHBOARD</span>
          </h1>
          
          <div className="opacity-0 animate-[fadeIn_0.3s_ease-out_0.85s_forwards] flex flex-col items-center">
            <p className="text-2xl md:text-3xl text-gray-200 max-w-2xl text-center mb-10">
              {role === 'superadmin' ? 'Monitor and manage all actions across the platform.' : 'Monitor and manage your created actions.'}
            </p>
          </div>
        </div>
      </div>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {loading && <p className="text-center text-lg">Loading actions...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}

          <div className="space-y-6">
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
    </div>
  );
};

export default AdminDashboard;