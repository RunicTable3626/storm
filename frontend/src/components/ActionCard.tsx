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
  onDelete: (actionId: string) => void;
  onEdit: (actionId: string, formData: any) => void;
}

const ActionCard: React.FC<ActionProps> = ({ action, isLinked, onDelete, onEdit }) => {
  const {user} = useUser();
  const [isLinkedBool, setIsLinkedBool] = useState(isLinked); //to deactivate linked styling after action completion

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

  const checkActionCompletion = () => {
    setIsEmailActionCompleted(actionExists(action._id, "emailCount"));
    setIsCallActionCompleted(actionExists(action._id, "callCount"));
    setIsInstagramCommentActionCompleted(actionExists(action._id, "instaCount"));
  };

  const { isSignedIn,  isLoaded } = useUser();

  useEffect(() => {
      // Listen for custom event in the same tab
      checkActionCompletion(); //checking everytime an action card is rendered
      window.addEventListener("action-added-to-local-storage", checkActionCompletion);
  
      // Cleanup listener when component unmounts
      return () => {
        window.removeEventListener("action-added-to-local-storage", checkActionCompletion);
      };

  }, []);

  useEffect(() => {
    if (
      (isEmailActionCompleted || !action.emailId) &&
      (isCallActionCompleted || !action.callId) &&
      (isInstagramCommentActionCompleted || !action.instaId)
    ) {
      setIsLinkedBool(false);
    }
  }, [
    isEmailActionCompleted,
    isCallActionCompleted,
    isInstagramCommentActionCompleted,
    action.emailId,
    action.callId,
    action.instaId
  ]);


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
      border: isLinkedBool? "10px solid #ccc" : "2px solid #ccc",
      padding: "20px",
      marginBottom: "10px",          
      maxWidth: "800px",  // If you want some flexibility
      wordWrap: "break-word",  // Ensure long text wraps
      }}>
      {user && (userEmail === action.createdBy || !action.createdBy) && (
      <p  style={{ color: 'green' }}>
        <strong>This can be modified by currently logged-in user</strong>
      </p>  
      )}

      <p style={{ color: '#747bff' }}>{isLinkedBool? "Someone shared this action with you!" : ""}</p>


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
          <p>All Actions Completed!</p>
        )
      }
      
      {action && (
        <p>Created At: {action.createdAt
          ? moment(action.createdAt).format("MMMM Do YYYY, h:mm A")
          : "Unknown"}</p>
      )}



      <SignedIn>
      {action && user && (userEmail === action.createdBy || !action.createdBy) && (
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