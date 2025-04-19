import React, { useState } from "react";
import EmailModal from "../modals/EmailModal"; // Import the modal component

interface EmailButtonProps {
  action: any
}

const EmailButton: React.FC<EmailButtonProps> = ({ action}) => {
  const gmailUrl = `https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(action.emailId.emailAddress)}&su=${encodeURIComponent(action.emailId.subject)}&body=${encodeURIComponent(action.emailId.body)}`;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const sendEmail = () => {
    window.open(gmailUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div>
      <button
        onClick={(e) => {
          (e.target as HTMLButtonElement).blur()
          openModal()}}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
      >
        Send an Email
      </button>

      <EmailModal isOpen={isModalOpen} action={action} onClose={closeModal} onSend={sendEmail} />
    </div>
  );
};

export default EmailButton;