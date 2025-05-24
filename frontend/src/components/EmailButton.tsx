import React, { useState } from "react";
import EmailModal from "../modals/EmailModal"; // Import the modal component

interface EmailButtonProps {
  action: any
  isAdminView: boolean
}

const EmailButton: React.FC<EmailButtonProps> = ({ action, isAdminView}) => {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
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
          <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
          <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
        </svg>
        <div className = "mt-2">
          Send an Email
        </div>
      </button>

      <EmailModal isOpen={isModalOpen} action={action} isAdminView={isAdminView} closeModal={closeModal} />
    </div>
  );
};

export default EmailButton;