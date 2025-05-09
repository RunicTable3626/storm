import React, { useState } from "react";
import PhonecallModal from "../modals/PhonecallModal"; // Import Modal component

interface PhoneCallButtonProps {
  action : any;
  isAdminView: boolean;
}

const PhonecallButton: React.FC<PhoneCallButtonProps> = ({
  action, isAdminView
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to open the modal
  const openModal = () => setIsModalOpen(true);

  // Function to close the modal
  const closeModal = () => setIsModalOpen(false);

  return (
    <div>
      <button onClick={(e) => {
          (e.target as HTMLButtonElement).blur()
          openModal()}}>Show Phone Number</button>

      {/* Conditionally render the modal */}
      <PhonecallModal isOpen = {isModalOpen} action = {action} isAdminView = {isAdminView} closeModal={closeModal} />
    </div>
  );
};

export default PhonecallButton;
