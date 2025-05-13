import React, {useState, useEffect} from "react";
import moment from "moment";
import EmailButton from "./EmailButton"
import PhonecallButton from "./PhonecallButton";
import InstagramButton from "./InstagramButton";
import DeleteActionButton from "./DeleteActionButton";
import { SignedIn, useUser } from "@clerk/clerk-react";
import EditActionButton from "./EditActionButton";
const ALLOWED_ORIGIN = import.meta.env.VITE_ALLOWED_ORIGIN; // from .env


interface ActionProps {
  action: any; // You can replace `any` with a more specific type
  isLinked: boolean
  isAdminView: boolean
  onDelete: (actionId: string) => void;
  onEdit: (actionId: string, formData: any) => void;
}

const ActionCard: React.FC<ActionProps> = ({ action, isLinked, isAdminView, onDelete, onEdit }) => {
  const {user} = useUser();

  const userEmail = user?.emailAddresses[0].emailAddress;

  type Action = {
    id: string;
    type: string;
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
  const [copied, setCopied] = useState(false);

  const checkAndSetActionCompletion = () => {
    setIsEmailActionCompleted(actionExists(action._id, "emailCount"));
    setIsCallActionCompleted(actionExists(action._id, "callCount"));
    setIsInstagramCommentActionCompleted(actionExists(action._id, "instaCount"));
  };

  const isAllActionsCompleted = () => {
    return (
      (isEmailActionCompleted || !action.emailId) &&
      (isCallActionCompleted || !action.callId) &&
      (isInstagramCommentActionCompleted || !action.instaId)
    );
  };

  const { isSignedIn,  isLoaded } = useUser();

  useEffect(() => {
      // Listen for custom event in the same tab
      checkAndSetActionCompletion(); //checking everytime an action card is rendered
      window.addEventListener("action-added-to-local-storage", checkAndSetActionCompletion);
  
      // Cleanup listener when component unmounts
      return () => {
        window.removeEventListener("action-added-to-local-storage", checkAndSetActionCompletion);
      };

  }, []);

  useEffect(() => { //only checks after sign in, does not do anything until user is fully loaded in.
    if (!isLoaded) return;
  
    if (isSignedIn && isAdminView) {
      setIsCallActionCompleted(false);
      setIsEmailActionCompleted(false);
      setIsInstagramCommentActionCompleted(false);
    }
  }, [isLoaded, isSignedIn]);

  const isFutureScheduledAction = isAdminView && action?.startDate && new Date(action.startDate) > new Date();
  
  return (
    <div   style={{
      border: isLinked ? "10px solid #ccc" : "2px solid #ccc",
      padding: "20px",
      marginBottom: "10px",
      maxWidth: "800px", // If you want some flexibility
      wordWrap: "break-word", // Ensure long text wraps
      backgroundColor: isFutureScheduledAction ? "#646cff" : "transparent", // Greys out the div if isAdminView is true or startDate is ahead
      opacity: 1
    }}>

      {isLinked && (
        <p style={{ color: '#747bff' }}>
          { isAllActionsCompleted()
            ? "You have already completed this shared action!"
            : "Someone shared this action with you!"
          }
        </p>
      )}

      {isFutureScheduledAction && (
        <h3>NOT ACTIVE YET: This action is scheduled to start at {moment(action.startDate).format("MMMM Do YYYY, h:mm A")}</h3>
      )
      }


      <h3>{action.title|| ""}</h3>
      <p><strong>Description:</strong> {action.description || ""}</p>

      {/* Display Email Info */}
      {!isEmailActionCompleted && action.emailId && (
        <div className="button-container">
          <EmailButton 
            action={action}
            isAdminView={isAdminView}
          />

          <SignedIn>
            {(isAdminView) && (
            <p>Email Actions: {action.emailCount || 'None'}</p>
          )
          }
          </SignedIn>
        </div>
      )}

      {/* Display Call Info */}
      {!isCallActionCompleted && action.callId && (
        <div className="button-container">
          <PhonecallButton
            action = {action}
            isAdminView = {isAdminView}
          />

          <SignedIn>
            {(isAdminView) && (
            <p>Call Actions: {action.callCount || 'None'}</p>
          )
          }
          </SignedIn>
        </div>
      )}

      {/* Display Instagram Info */}
      {!isInstagramCommentActionCompleted && action.instaId && (
        <div className="button-container">
          <InstagramButton 
          action = {action}
          isAdminView = {isAdminView}
          />
        
        <SignedIn>
          {(isAdminView) && (
            <p>Comment Actions: {action.instaCount || 'None'}</p>
          )
          }
        </SignedIn>
        </div>
      )}

      { isAllActionsCompleted()
        && (
          <p>All Actions Completed!</p>
        )
      }
      
      {action && (
      <p> {isFutureScheduledAction?  "Starts At : ": "Started At : "} 
        {action.startDate 
          ? moment(action.startDate).format("MMMM Do YYYY, h:mm A") 
          : (action.createdAt ? moment(action.createdAt).format("MMMM Do YYYY, h:mm A") : "Unknown")
        }
      </p>
    )}


      <SignedIn>
      {action && isAdminView && (
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


      {action.shareId &&  (
        <div> 
        <p><strong>Click to copy and share Action through the link below!</strong></p>
        <button
          onClick={(e) => {
          (e.target as HTMLButtonElement).blur()
            navigator.clipboard.writeText(`${ALLOWED_ORIGIN}/action/${action.shareId}`);
            setCopied(true);
            setTimeout(() => setCopied(false), 1000);
          }}>
          {"Copy Action Link"}
        </button>
        {copied && action.shareId && <span style={{ color: 'green', marginLeft: '10px' }}>Text copied!</span>}
      </div>
      )}


</div>
  );
};

export default ActionCard;