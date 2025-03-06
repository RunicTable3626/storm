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
    <div style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
      <h3>{action.title || ""}</h3>
      <p><strong>Description:</strong> {action.description || ""}</p>

      {/* Display Email Info */}
      {action.emailId && (
        <div>
          <EmailButton 
            email= {action.emailId?.emailAddress || ""}
            subject= {action.emailId?.subject || ""}
            body= {action.emailId?.body || ""}
          />
        </div>
      )}

      {/* Display Call Info */}
      {action.callId && (
        <div>
          <PhonecallButton
            phoneNumber= {action.callId?.phoneNumber || ""}
            callScript= {action.callId?.callScript || ""}
          />
        </div>
      )}

      {/* Display Instagram Info */}
      {action.instaId && (
        <div>
          <InstagramButton postId={action.instaId.instagramLink} />
        </div>
      )}
      
      {action && (
        <p>Last Updated: {action.updatedAt
          ? moment(action.updatedAt).format("MMMM Do YYYY, h:mm A")
          : "Unknown"}</p>
      )}
    </div>
  );
};

export default ActionCard;