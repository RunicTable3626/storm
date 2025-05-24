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
  const [buttonText, setButtonText] = useState("Click to copy and share the action link!");
  const [isTextCopied, setIsTextCopied] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);

  const checkAndSetActionCompletion = () => {
    console.log("Checking completion for action:", action._id);
    const emailCompleted = actionExists(action._id, "emailCount");
    const callCompleted = actionExists(action._id, "callCount");
    const instaCompleted = actionExists(action._id, "instaCount");
    
    console.log("Completion status:", {
      emailCompleted,
      callCompleted,
      instaCompleted
    });
    
    setIsEmailActionCompleted(emailCompleted);
    setIsCallActionCompleted(callCompleted);
    setIsInstagramCommentActionCompleted(instaCompleted);
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

  }, [action._id]); // Add action._id as a dependency to ensure it reacts to changes

  useEffect(() => {
    if (!isLoaded) return;
  
    if (isSignedIn && isAdminView) {
      setIsCallActionCompleted(false);
      setIsEmailActionCompleted(false);
      setIsInstagramCommentActionCompleted(false);
    }
  }, [isLoaded, isSignedIn, action._id]); // Add action._id as a dependency

  const isFutureScheduledAction = isAdminView && action?.startDate && new Date(action.startDate) > new Date();
  
  return (
    <div className = "rounded-xl mb-4 shadow-md" style={{ 
      border: isLinked ? "10px solid #ccc" : "2px solid #ccc",
      padding: "20px",      
      textAlign: "left",   
      width: "100%",
      wordWrap: "break-word"
      }}>
         { isAllActionsCompleted()
        && (
          <div className = "relative w-full">
          <p className = "font-semibold bg-green-300 md:absolute md:top-0 md:right-0 px-3 mb-4 text-black text-base rounded-full p-2 inline-block">All Actions Completed!</p>
          </div>
          )
      }
      <h3 className = "text-3xl font-bold md:max-w-lg mb-2">{action.title || ""}</h3>
      <p className = "text-lg italic">{action.description || ""}</p>


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
      <div className="flex mt-2 flex-col md:flex-row md:flex-wrap gap-2">
        {/* Display Email Info */}
        {!isEmailActionCompleted && action.emailId && (
          <div className="w-full md:w-auto">
            <EmailButton action={action} isAdminView={isAdminView} />
            <SignedIn>
            {(isAdminView) && (
            <p className = "text-italic text-center text-lg italic mt-2">Email Actions: {action.emailCount || 'None'}</p>
          )
          }
          </SignedIn>
          </div>
        )}
      

        {/* Display Call Info */}
        {!isCallActionCompleted && action.callId && (
          <div className="w-full md:w-auto">
            <PhonecallButton action={action} isAdminView={isAdminView} />
            <SignedIn>
            {(isAdminView) && (
            <p className = "text-italic text-center text-lg italic mt-2">Call Actions: {action.callCount || 'None'}</p>
          )
          }
          </SignedIn>
          </div>
        )}

        {/* Display Instagram Info */}
        {!isInstagramCommentActionCompleted && action.instaId && (
          <div className="w-full md:w-auto">
            <InstagramButton action={action} isAdminView={isAdminView} />
            <SignedIn>
          {(isAdminView) && (
            <p className = "text-italic text-center text-lg italic mt-2">Comment Actions: {action.instaCount || 'None'}</p>
          )
          }
        </SignedIn>
          </div>
        )}

      </div>

      {action && (
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
    )}

      <style>
        {`
          @keyframes flip {
            0% { transform: perspective(400px) rotateX(0); }
            50% { transform: perspective(400px) rotateX(90deg); }
            100% { transform: perspective(400px) rotateX(0); }
          }
          .animate-flip {
            animation: flip 0.3s;
          }
        `}
      </style>

      {action.shareId &&  (
        <div> 
        <button className = "font-semibold mt-2 cursor-pointer duration-200 ease text-black text-lg"
          onClick={(e) => {
            (e.target as HTMLButtonElement).blur();
            navigator.clipboard.writeText(`${ALLOWED_ORIGIN}/action/${action.shareId}`);
            
            if (!isTextCopied) {
            
              setIsFlipping(true);
              
              setTimeout(() => {
                setButtonText("Text copied!");
                setIsTextCopied(true);
              }, 150);
              
              setTimeout(() => {
                setIsFlipping(false);
              }, 300);
              
              setTimeout(() => {
                setIsFlipping(true);
                
                setTimeout(() => {
                  setButtonText("Click to copy and share the action link!");
                  setIsTextCopied(false);
                }, 150);
                
                setTimeout(() => {
                  setIsFlipping(false);
                }, 300);
                
              }, 3000);
            }
          }}>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke-width="2" 
              stroke={isTextCopied ? "#06DF73" : "currentColor"} 
              className="inline-block relative -top-0.5 mr-0.5 size-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
            </svg>

            <span 
              className={`inline-block ${isFlipping ? 'animate-flip' : ''}`}
              style={{ 
                color: isTextCopied ? "#06DF73" : "black",
                transformStyle: "preserve-3d",
              }}
            >
              {buttonText}
            </span>
          </button>
      </div>
      )}

{action && (
        <p className = "text-lg italic mt-2">Created At: {action.createdAt
          ? moment(action.createdAt).format("MMMM Do YYYY, h:mm A")
          : "Unknown"}</p>
      )}
      <p className = "text-lg mt-2 italic"> {isFutureScheduledAction?  "Starts At : ": "Started At : "} 
        {action.startDate 
          ? moment(action.startDate).format("MMMM Do YYYY, h:mm A") 
          : (action.createdAt ? moment(action.createdAt).format("MMMM Do YYYY, h:mm A") : "Unknown")
        }
      </p>

      {action && isAdminView && (
        <div>
          <p className = "text-lg font-semibold mt-2">created by: {action.createdBy || "Unknown"}</p>
        </div>
      )}  


</div>
  );
};

export default ActionCard;