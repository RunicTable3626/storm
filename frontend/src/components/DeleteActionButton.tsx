import React, { useState } from "react";
import DeleteActionModal from "../modals/DeleteActionModal"
import { useAuth } from "@clerk/clerk-react";
const API_URL = import.meta.env.VITE_API_URL; // VITE_API_URL from .env

interface DeleteActionButtonProps {
  actionId: string;
  onDelete: (actionId: string) => void;
  
}

const DeleteActionButton: React.FC<DeleteActionButtonProps> = ({ actionId, onDelete}) => {
  const [completed, setCompleted] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const { getToken } = useAuth();

  const handleClick = async () => {
    try {
      const token = await getToken();
      const response = await fetch(`${API_URL}/api/actions/${actionId}`, { 
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
      },
      });

      if (!response.ok) throw new Error("Failed to delete action");
      setCompleted(true); 
      setTimeout(() => {onDelete(actionId);}, 1000); 
    } catch (error) {
      console.error(error);
    }
  };

  return (
        <div style={{ display: "inline-flex", alignItems: "center" }}>
        <button className = "text-red-500 bg-red-200 p-3 rounded-full cursor-pointer hover:bg-red-300 duration-200 ease font-semibold text-xl mt-2 px-5" onClick={(e) => {
                        (e.target as HTMLButtonElement).blur()
                        openModal()}}>Delete Action</button>
        {completed && <span style={{ color: "red", marginLeft: "10px" }}>Action Deleted</span>}

        <DeleteActionModal isOpen = {isModalOpen} closeModal={closeModal} handleClick={handleClick}/>
        </div>
  )
};

export default DeleteActionButton;

