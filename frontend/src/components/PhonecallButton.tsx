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
    <div className="w-full md:w-auto">
      <button
        onClick={(e) => {
          (e.target as HTMLButtonElement).blur()
          openModal()}}
        className="bg-gray-200 hover:bg-gray-300 cursor-pointer text-gray-800 text-center font-bold py-4 px-4 rounded-lg transition duration-300 w-full md:w-auto"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 col-centered">
          <path fill-rule="evenodd" d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z" clip-rule="evenodd" />
        </svg>
        <div className = "mt-2">
        Make Phone Call
        </div>
      </button>

      {/* Conditionally render the modal */}
      <PhonecallModal isOpen = {isModalOpen} action = {action} isAdminView = {isAdminView} closeModal={closeModal} />
    </div>
  );
};

export default PhonecallButton;
