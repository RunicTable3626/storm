import React, {useState, useEffect} from "react";
import moment from "moment";
import EmailButton from "./EmailButton"
import PhonecallButton from "./PhonecallButton";
import InstagramButton from "./InstagramButton";
import DeleteActionButton from "./DeleteActionButton";
import { SignedIn } from "@clerk/clerk-react";

interface ActionProps {
  action: any; // You can replace `any` with a more specific type
  onDelete: (actionId: string) => void;
}

const ActionCard: React.FC<ActionProps> = ({ action, onDelete }) => {

  type Action = {
    id: string;
    type: string;
    currentTimestamp: number;
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

  useEffect(() => {
    // Initial check when component mounts
    const storedActions: Action[] = JSON.parse(localStorage.getItem("actions") || "[]");
    const currentTime = new Date().getTime();

    // Check and clear actions older than 24 hours
    const filteredActions = storedActions.filter(action => {
      return currentTime - action.currentTimestamp <= 24 * 60 * 60 * 1000; // 24 hours in ms
    });

    if (filteredActions.length !== storedActions.length) {
      // If there were any outdated actions, update localStorage
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
  
  return (
    <div style={{ border: "2px solid #ccc", padding: "20px", marginBottom: "10px" }}>
      <h3>{action.title || ""}</h3>
      <p><strong>Description:</strong> {action.description || ""}</p>

      {/* Display Email Info */}
      {!isEmailActionCompleted && action.emailId && (
        <div className="button-container">
          <EmailButton 
            email= {action.emailId?.emailAddress || ""}
            subject= {action.emailId?.subject || ""}
            body= {action.emailId?.body || ""}
            actionId= {action._id}
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
            phoneNumber= {action.callId?.phoneNumber || ""}
            callScript= {action.callId?.callScript || ""}
            actionId= {action._id}
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
          postId={action.instaId.instagramLink || ""} 
          comment={action.instaId.comment || ""}
          actionId= {action._id}
          />
        
        <SignedIn>
            <p>Comment Actions: {action.instaCount || 'None'}</p>
        </SignedIn>
        </div>
      )}

      { (isEmailActionCompleted || !action.emailId) && (isCallActionCompleted || !action.callId) && (isInstagramCommentActionCompleted || !action.instaId)
        && (
          <p>All Actions Completed!</p>
        )
      }
      
      {action && (
        <p>Created At: {action.createdAt
          ? moment(action.createdAt).format("MMMM Do YYYY, h:mm A")
          : "Unknown"}</p>
      )}

      <SignedIn>
      {action && (
        <div>
          <DeleteActionButton
          actionId = {action._id}
          onDelete = {onDelete}
          />
        </div>
        ) }
      </SignedIn>
    </div>
  );
};

export default ActionCard;