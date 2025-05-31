import { useEffect, useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react';
import WAM15728 from "../assets/WAM15728.jpg"
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
  startDate?: Date;
  createdAt: Date;
}

const ActionDashboard = () => {
  const navigate = useNavigate();
  const [actions, setActions] = useState<Action[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  

  const location = useLocation();
  const shareIdFromUrl = location.state?.shareId;
  
  const handleNavigation = (path: string) => {
    navigate(path);
  };

  // Fetch function
  const fetchActions = async () => {
    try {
      const daysAgo = 7;
      const response = await fetch(`${API_URL}/api/actions/lastNDays?daysAgo=${daysAgo}`);
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


  function syncLocalActions() { 
    //checks if any localStorage action ids are not in fetched actions
    const stored = localStorage.getItem("actions");
    if (!stored) return;
  
    try {
      const storedActions = JSON.parse(stored);
      if (!Array.isArray(storedActions)) return;
  
      const validIds = new Set(actions.map(a => a._id));
  
      const filteredActions = storedActions.filter(
        (action: { id: string }) => validIds.has(action.id)
      );
  
      localStorage.setItem("actions", JSON.stringify(filteredActions));
    } catch (err) {
      console.error("Failed to sync localStorage actions:", err);
    }
  }

  
  // Fetch data on component mount
  //Kept separate to prevent empty actions variable being accessed in syncLocalActions() due to delay.
  useEffect(() => {
    fetchActions();
  }, []);

  useEffect(() => {
    if (actions.length > 0) {
      syncLocalActions();
    }
  }, [actions]);



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

  const isActionCompleted = (action: Action): boolean => {
    const stored = JSON.parse(localStorage.getItem('actions') || '[]');
    
    const emailCompleted = !action.emailId || stored.some(
      (item: { id: string; type: string }) => item.id === action._id && item.type === "emailCount"
    );
    
    const callCompleted = !action.callId || stored.some(
      (item: { id: string; type: string }) => item.id === action._id && item.type === "callCount"
    );
    
    const instaCompleted = !action.instaId || stored.some(
      (item: { id: string; type: string }) => item.id === action._id && item.type === "instaCount"
    );
    
    return emailCompleted && callCompleted && instaCompleted;
  };

  const sortedActions = actions.sort((a, b) => {

    const aCompleted = isActionCompleted(a);
    const bCompleted = isActionCompleted(b);
    
    // Completed actions go last
    if (aCompleted && !bCompleted) return 1;
    if (!aCompleted && bCompleted) return -1;
    
   // Sort by date among completed actions 
    const aDate = a.startDate ?? a.createdAt;
    const bDate = b.startDate ?? b.createdAt;
    
    return new Date(bDate).getTime() - new Date(aDate).getTime();
  });

  const highlighted = shareIdFromUrl
  ? sortedActions.find((action) => action.shareId === shareIdFromUrl)
  : null;

  const rest = shareIdFromUrl
  ? sortedActions.filter((action) => action.shareId !== shareIdFromUrl)
  : sortedActions;

  const finalList = highlighted ? [highlighted, ...rest] : rest;




  return (
    <div>
      <div className="relative w-full h-[70vh]">
       <div 
          className="absolute inset-0 bg-cover bg-top bg-no-repeat"
          style={{
            backgroundImage: `url(${WAM15728})`,
            backgroundPosition: "center 25%" 
          }}
        />
        <div className="absolute inset-0 bg-black/65" />
        <div className="relative flex p-0 flex-col items-center justify-center h-full text-white">
          <h1 className="text-5xl md:text-6xl text-4xl font-bold mb-4 tracking-wider flex flex-wrap justify-center gap-x-3 gap-y-0 px-2">
            <span className="opacity-0 animate-[fadeIn_0.3s_ease-out_.25s_forwards]">TAKE</span>
            <span className="text-violet-500 opacity-0 animate-[fadeIn_0.3s_ease-out_0.45s_forwards]">ACTION</span>
            <span className="opacity-0 animate-[fadeIn_0.3s_ease-out_0.65s_forwards]">NOW</span>
          </h1>
          
          <div className="opacity-0 animate-[fadeIn_0.3s_ease-out_0.85s_forwards] flex flex-col items-center">
            <p className="text-2xl md:text-3xl text-gray-200 max-w-2xl text-center mb-10">
              Below, you will find a list of essential actions created by organizers to help animals.
            </p>
            
            {/* Take Action Button */}
            <button 
              onClick={() => {
                const actionsSection = document.querySelector('.actions-section');
                if (actionsSection) {
                  actionsSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="bg-violet-500 mt-0 hover:bg-violet-600 cursor-pointer text-2xl text-white font-bold py-4 px-8 rounded-full flex items-center gap-3 transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-opacity-50"
            >
              GET STARTED
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="rotate-90 size-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </button>
            
            <SignedIn>
            <div 
              onClick={() => handleNavigation('/create-action')}
              className="text-gray-200 cursor-pointer border-b-2 border-transparent hover:border-white duration-200 ease font-semibold text-xl mt-4"
            >
              Or, create a new action   
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="inline-block size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
              </svg>
            </div>
            </SignedIn>

      
            <SignedOut>
              <SignInButton>
                <div 
                  className="text-gray-200 cursor-pointer border-b-2 border-transparent hover:border-white duration-200 ease font-semibold text-xl mt-4"
                >
                  Or, sign in as an organizer  
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="inline-block size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                  </svg>
                </div>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
        </div>

      <div className="actions-section text-center w-full px-4 md:px-10 py-16">
        <div className="text-4xl md:text-5xl mb-10 font-bold">THE LATEST THIS WEEK</div>
        {loading && <p className = "text-2xl col-centered mt-20 animate-pulse text-center">Loading actions...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        <div className="w-full max-w-3xl mx-auto">
          {shareIdFromUrl && !highlighted && !loading &&
          <p style={{ color: "orange" }}>The shared action associated with your link doesn't exist, was deleted or has expired</p>
          }

          {finalList.map((action) => (
            <ActionCard 
            key={action._id} 
            action={action} 
            isLinked={action._id === highlighted?._id}
            isAdminView={false}
            onDelete={handleDeleteAction} 
            onEdit={handleEditAction}/>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActionDashboard;