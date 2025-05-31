import React, { useState } from "react";
const API_URL = import.meta.env.VITE_API_URL; // VITE_API_URL from .env

interface ActionCompleteButtonProps {
  actionType: string;
  actionId: string;
  onClick: () => void;
}

const ActionCompleteButton: React.FC<ActionCompleteButtonProps> = ({ actionType, actionId, onClick }) => {
  const [completed, setCompleted] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const saveAction = (actionId: string, actionType: string) => {
    const stored = JSON.parse(localStorage.getItem('actions') || '[]');

    const exists = stored.some(
      (action: { id: string; type: string }) => action.id === actionId && action.type === actionType
    );
  
    if (!exists) {
      stored.push({ id: actionId, type: actionType});
      localStorage.setItem('actions', JSON.stringify(stored));
      
      const event = new CustomEvent("action-added-to-local-storage");
      window.dispatchEvent(event);
    }
  };

  const handleClick = async () => {
    try {
      const response = await fetch(`${API_URL}/api/actions/updateCount`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            actionType: actionType,
            actionId: actionId 
        }),
      });

      if (!response.ok) throw new Error("Failed to update counter");

      setCompleted(true);
      setShowConfirmation(false);
      
      saveAction(actionId, actionType);
      
      setTimeout(() => {
        onClick();
      }, 1000);
      
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div style={{ display: "inline-flex", alignItems: "center" }}>
      {completed ? (
        <span className="text-green-500 font-bold mt-2">
          Action Completed! <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="inline-block size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </span>
      ) : !showConfirmation ? (
        <button 
          className="text-green-500 hover:text-green-600 font-bold mt-2 cursor-pointer rounded-lg transition duration-200" 
          onClick={() => setShowConfirmation(true)}
        >
          Complete Action <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="inline-block size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </button>
      ) : (
        <div className="flex items-center mt-1 gap-2">
          <div className="text-gray-700 font-semibold">Are you sure? This cannot be undone.</div>
          <button 
            className="bg-green-500 font-semibold duration-200 ease cursor-pointer hover:bg-green-600 text-white px-3 py-1 rounded-lg" 
            onClick={handleClick}
          >
            Yes
          </button>
          <button 
            className="bg-red-500 font-semibold duration-200 ease cursor-pointer hover:bg-red-600 text-white px-3 py-1 rounded-lg" 
            onClick={() => setShowConfirmation(false)}
          >
            No
          </button>
        </div>
      )}
    </div>
  );
};

export default ActionCompleteButton;