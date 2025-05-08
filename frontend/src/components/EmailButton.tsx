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

  const sendEmail = (subject: string, body: string) => {
    const emailUrl = `mailto:${action.emailId.emailAddress}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    if (navigator.userAgent.includes("Mobi")) {
      // Mobile devices might not open a new tab properly, so use location.href instead
      window.location.href = emailUrl;
    } else {
      // Desktop devices can open in a new tab
      window.open(emailUrl, "_blank", "noopener,noreferrer");
    }
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

      <EmailModal isOpen={isModalOpen} action={action} isAdminView={isAdminView} onClose={closeModal} onSend={sendEmail} />
    </div>
  );
};

export default EmailButton;