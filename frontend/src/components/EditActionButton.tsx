import React, { useState } from "react";
import EditActionModal from "../modals/EditActionModal"
import { useAuth } from "@clerk/clerk-react";
const API_URL = import.meta.env.VITE_API_URL; // VITE_API_URL from .env

interface EditActionButtonProps {
  action: any;
  onEdit: (actionId: string, formData: any) => void;
  
}

const EditActionButton: React.FC<EditActionButtonProps> = ({ action, onEdit}) => {
  const [completed, setCompleted] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const { getToken } = useAuth();

  const handleClick = async (formData: any) => {
    try {
      const token = await getToken();
      const response = await fetch(`${API_URL}/api/actions/${action._id}`, { 
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          
      },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to Edit action");

      const data: { message: string } = await response.json(); // Parse response JSON
      console.log(`action with id = ${action._id} successfully edited with response: ${data.message}`);
      setCompleted(true); 
      onEdit(action._id, formData);
      setTimeout(() => {setCompleted(false)}, 2000); 
    } catch (error) {
      console.error(error);
    }
  };

  return (
        <div style={{ display: "inline-flex", alignItems: "center" }}>
        <button onClick={(e) => {
                        (e.target as HTMLButtonElement).blur()
                        openModal()}}>Edit Action</button>
        {completed && <span style={{ color: "green", marginLeft: "10px" }}>Action Edited!</span>}

        <EditActionModal isOpen = {isModalOpen} action={action} closeModal={closeModal} handleClick={handleClick}/>
        </div>
  )
};

export default EditActionButton;