import React from "react";
import moment from "moment";
import EmailButton from "./EmailButton"
import PhonecallButton from "./PhonecallButton";
import InstagramButton from "./InstagramButton";

interface ActionProps {
  action: any; // You can replace `any` with a more specific type
}

const ActionCard: React.FC<ActionProps> = ({ action }) => {
  return (
    <div style={{ border: "2px solid #ccc", padding: "20px", marginBottom: "10px" }}>
      <h3>{action.title || ""}</h3>
      <p><strong>Description:</strong> {action.description || ""}</p>

      {/* Display Email Info */}
      {action.emailId && (
        <div>
          <EmailButton 
            email= {action.emailId?.emailAddress || ""}
            subject= {action.emailId?.subject || ""}
            body= {action.emailId?.body || ""}
            actionId= {action._id}
          />
        </div>
      )}

      {/* Display Call Info */}
      {action.callId && (
        <div>
          <PhonecallButton
            phoneNumber= {action.callId?.phoneNumber || ""}
            callScript= {action.callId?.callScript || ""}
            actionId= {action._id}
          />
        </div>
      )}

      {/* Display Instagram Info */}
      {action.instaId && (
        <div>
          <InstagramButton 
          postId={action.instaId.instagramLink || ""} 
          comment={action.instaId.comment || ""}
          actionId= {action._id}
          />
          
        </div>
      )}
      
      {action && (
        <p>Created At: {action.createdAt
          ? moment(action.createdAt).format("MMMM Do YYYY, h:mm A")
          : "Unknown"}</p>
      )}
    </div>
  );
};

export default ActionCard;