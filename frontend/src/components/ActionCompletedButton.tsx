import React, { useState } from "react";
import ActionCompleteModal from "../modals/ActionCompleteModal";
import { useAuth, useUser } from '@clerk/clerk-react';
const API_URL = import.meta.env.VITE_API_URL; // VITE_API_URL from .env

interface ActionCompleteButtonProps {
  actionType: string;
  action: any;
  onClick: () => void;
  
}




const ActionCompleteButton: React.FC<ActionCompleteButtonProps> = ({ actionType, action, onClick }) => {
  const [completed, setCompleted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const {isLoaded, isSignedIn} = useAuth();
  const {user} = useUser();
  const userEmail = user?.emailAddresses[0].emailAddress;

  const saveAction = (actionId: string, actionType: string) => {
    const stored = JSON.parse(localStorage.getItem('actions') || '[]');

    const exists = stored.some(
      (localStorageAction: { id: string; type: string }) => localStorageAction.id === actionId && localStorageAction.type === actionType
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
            actionId: action._id 
        }), // Please pass the action id too in order to index
      });

      if (!response.ok) throw new Error("Failed to update counter");

      const data = await response.json();
      console.log(`${actionType} response: ${data.message}`);
      setCompleted(true);
      setTimeout(() => {
        onClick(); 
        if(!(isSignedIn && isLoaded && (userEmail === action.createdBy || !action.createdBy))) { 
          //if user is not signed in or if user is not the creator or if action has no creator info
          saveAction(action._id, actionType);
        } 
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