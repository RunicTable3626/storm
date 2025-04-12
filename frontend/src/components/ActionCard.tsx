import React from "react";
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
  return (
    <div style={{ border: "2px solid #ccc", padding: "20px", marginBottom: "10px" }}>
      <h3>{action.title || ""}</h3>
      <p><strong>Description:</strong> {action.description || ""}</p>

      {/* Display Email Info */}
      {action.emailId && (
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
      {action.callId && (
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
      {action.instaId && (
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