import React from "react";

interface ActionCompleteButtonProps {
  actionType: string;
  actionId: string;
  onClick: () => void;
  
}

const ActionCompleteButton: React.FC<ActionCompleteButtonProps> = ({ actionType, actionId, onClick }) => {
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
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return <button onClick={() => { handleClick(); onClick(); }}>Complete Action</button>;
};

export default ActionCompleteButton;