import React, { useState } from "react";
import DeleteActionModal from "../modals/DeleteActionModal"
const API_URL = import.meta.env.VITE_API_URL; // VITE_API_URL from .env

interface DeleteActionButtonProps {
  actionId: string;
  onDelete: (actionId: string) => void;
  
}

const DeleteActionButton: React.FC<DeleteActionButtonProps> = ({ actionId, onDelete }) => {
  const [completed, setCompleted] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleClick = async () => {
    try {
      const response = await fetch(`${API_URL}/api/actions/${actionId}`, { 
        method: "DELETE",
        credentials: 'include' 
      });

      if (!response.ok) throw new Error("Failed to delete action");

      const data: { message: string } = await response.json(); // Parse response JSON
      console.log(`action with id = ${actionId} successfully deleted with response: ${data.message}`);
      setCompleted(true); 
      setTimeout(() => {onDelete(actionId);}, 1000); 
    } catch (error) {
      console.error(error);
    }
  };

  return (
        <div style={{ display: "inline-flex", alignItems: "center" }}>
        <button onClick={(e) => {
                        (e.target as HTMLButtonElement).blur()
                        openModal()}}>Delete Action</button>
        {completed && <span style={{ color: "red", marginLeft: "10px" }}>Action Deleted</span>}

        <DeleteActionModal isOpen = {isModalOpen} closeModal={closeModal} handleClick={handleClick}/>
        </div>
  )
};

export default DeleteActionButton;

