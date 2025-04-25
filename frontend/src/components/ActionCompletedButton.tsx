import React, { useState } from "react";
import ActionCompleteModal from "../modals/ActionCompleteModal";
import { useAuth } from '@clerk/clerk-react';
const API_URL = import.meta.env.VITE_API_URL; // VITE_API_URL from .env

interface ActionCompleteButtonProps {
  actionType: string;
  actionId: string;
  onClick: () => void;
  
}




const ActionCompleteButton: React.FC<ActionCompleteButtonProps> = ({ actionType, actionId, onClick }) => {
  const [completed, setCompleted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const {isLoaded, isSignedIn} = useAuth();

  const saveAction = (actionId: string, actionType: string) => {
    const stored = JSON.parse(localStorage.getItem('actions') || '[]');

    const exists = stored.some(
      (action: { id: string; type: string }) => action.id === actionId && action.type === actionType
    );
  
    if (!exists) {
      stored.push({ id: actionId, type: actionType});
      localStorage.setItem('actions', JSON.stringify(stored));
      window.dispatchEvent(new Event("action-added-to-local-storage"));
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
        }), // Please pass the action id too in order to index
      });

      if (!response.ok) throw new Error("Failed to update counter");

      const data = await response.json();
      console.log(`${actionType} response: ${data.message}`);
      setCompleted(true);
      setTimeout(() => {
        onClick(); 
        if(!(isSignedIn && isLoaded)) saveAction(actionId, actionType);
      }, 1000);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
        <div style={{ display: "inline-flex", alignItems: "center" }}>
        <button onClick={openModal}>Complete Action</button>
        {completed && <span style={{ color: "green", marginLeft: "10px" }}>Action Completed!</span>}

        <ActionCompleteModal isOpen = {isModalOpen} closeModal={closeModal} handleClick={handleClick}/>
        </div>
  )
};

export default ActionCompleteButton;