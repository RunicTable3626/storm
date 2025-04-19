import React, {useState, useEffect} from "react";
import moment from "moment";
import EmailButton from "./EmailButton"
import PhonecallButton from "./PhonecallButton";
import InstagramButton from "./InstagramButton";
import DeleteActionButton from "./DeleteActionButton";
import { SignedIn, useUser } from "@clerk/clerk-react";
import EditActionButton from "./EditActionButton";

interface ActionProps {
  action: any; // You can replace `any` with a more specific type
  onDelete: (actionId: string) => void;
  onEdit: (actionId: string, formData: any) => void;
}

const ActionCard: React.FC<ActionProps> = ({ action, onDelete, onEdit }) => {

  type Action = {
    id: string;
    type: string;
    completionTimestamp: number;
  };
  
  const actionExists = (actionId: string, actionType: string): boolean => {
    const stored: Action[] = JSON.parse(localStorage.getItem('actions') || '[]');
    
    return stored.some(
      (action) => action.id === actionId && action.type === actionType
    );
  };


  const [isEmailActionCompleted, setIsEmailActionCompleted] = useState(false);
  const [isCallActionCompleted, setIsCallActionCompleted] = useState(false);
  const [isInstagramCommentActionCompleted, setIsInstagramCommentActionCompleted] = useState(false);

  const checkActionCompletion = () => {
    setIsEmailActionCompleted(actionExists(action._id, "emailCount"));
    setIsCallActionCompleted(actionExists(action._id, "callCount"));
    setIsInstagramCommentActionCompleted(actionExists(action._id, "instaCount"));
  };

  const { isSignedIn,  isLoaded } = useUser();

  useEffect(() => {
    // Initial check when component mounts
      const storedActions: Action[] = JSON.parse(localStorage.getItem("actions") || "[]");
      const currentTime = new Date().getTime();
  
      // Check and clear actions older than 24 hours
      const filteredActions = storedActions.filter(action => {
        return currentTime - action.completionTimestamp <= 24 * 60 * 60 * 1000; // 24 hours in ms
      });
  
      if (filteredActions.length !== storedActions.length) {
        // If there were any outdated actions, update localStorage
        console.log(filteredActions);
        console.log(storedActions);
        localStorage.setItem("actions", JSON.stringify(filteredActions));
      }
  
      checkActionCompletion();
  
      // Listen for custom event in the same tab
      window.addEventListener("action-added-to-local-storage", checkActionCompletion);
  
      // Cleanup listener when component unmounts
      return () => {
        window.removeEventListener("action-added-to-local-storage", checkActionCompletion);
      };

  }, []);


  useEffect(() => { //only checks after sign in, does not do anything until user is fully loaded in.
    if (!isLoaded) return;
  
    if (isSignedIn) {
      setIsCallActionCompleted(false);
      setIsEmailActionCompleted(false);
      setIsInstagramCommentActionCompleted(false);
    }
  }, [isLoaded, isSignedIn]);
  
  return (
    <div style={{ 
      border: "2px solid #ccc",
      padding: "20px",
      marginBottom: "10px",          
      maxWidth: "800px",  // If you want some flexibility
      wordWrap: "break-word",  // Ensure long text wraps
      }}>
      <h3>{action.title || ""}</h3>
      <p><strong>Description:</strong> {action.description || ""}</p>

      {/* Display Email Info */}
      {!isEmailActionCompleted && action.emailId && (
        <div className="button-container">
          <EmailButton 
            action={action}
          />

          <SignedIn>
            <p>Email Actions: {action.emailCount || 'None'}</p>
          </SignedIn>
        </div>
      )}

      {/* Display Call Info */}
      {!isCallActionCompleted && action.callId && (
        <div className="button-container">
          <PhonecallButton
            action = {action}
          />

          <SignedIn>
            <p>Call Actions: {action.callCount || 'None'}</p>
          </SignedIn>
        </div>
      )}

      {/* Display Instagram Info */}
      {!isInstagramCommentActionCompleted && action.instaId && (
        <div className="button-container">
          <InstagramButton 
          action = {action}
          />
        
        <SignedIn>
            <p>Comment Actions: {action.instaCount || 'None'}</p>
        </SignedIn>
        </div>
      )}

      { (isEmailActionCompleted || !action.emailId) && (isCallActionCompleted || !action.callId) && (isInstagramCommentActionCompleted || !action.instaId)
        && (
          <p>All Actions Completed. Redo Action in 24 hours!</p>
        )
      }
      
      {action && (
        <p>Created At: {action.createdAt
          ? moment(action.createdAt).format("MMMM Do YYYY, h:mm A")
          : "Unknown"}</p>
      )}

      <SignedIn>
      {action && (
        <div className="button-container">
          <DeleteActionButton
          actionId = {action._id}
          onDelete = {onDelete}
          />
          <EditActionButton
            action = {action}
            onEdit = {onEdit}
          />
        </div>
        ) }    
      </SignedIn>
    </div>
  );
};

export default ActionCard;