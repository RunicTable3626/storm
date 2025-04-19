import React, { useState } from "react";
import PhonecallModal from "../modals/PhonecallModal"; // Import Modal component

interface PhoneCallButtonProps {
  action : any;
}

const PhonecallButton: React.FC<PhoneCallButtonProps> = ({
  action
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
      <PhonecallModal isOpen = {isModalOpen} action = {action} closeModal={closeModal} />
    </div>
  );
};

export default PhonecallButton;
