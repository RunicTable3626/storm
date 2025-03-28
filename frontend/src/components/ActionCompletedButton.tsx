import React, { useState } from "react";

interface ActionCompleteButtonProps {
  actionType: string;
  actionId: string;
  onClick: () => void;
  
}

const ActionCompleteButton: React.FC<ActionCompleteButtonProps> = ({ actionType, actionId, onClick }) => {
  const [completed, setCompleted] = useState(false);

  const handleClick = async () => {
    try {
      const response = await fetch("api/actions/updateCount", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            actionType: actionType,
            actionId: actionId 
        }), // Please pass the action id too in order to index
      });

      if (!response.ok) throw new Error("Failed to update counter");
      
      console.log(`${actionType} count incremented with response: ${response}`);
      setCompleted(true);
      setTimeout(() => {onClick();}, 1000);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
        <div style={{ display: "inline-flex", alignItems: "center" }}>
        <button onClick={handleClick}>Complete Action</button>
        {completed && <span style={{ color: "green", marginLeft: "10px" }}>Action Completed!</span>}
        </div>
  )
};

export default ActionCompleteButton;