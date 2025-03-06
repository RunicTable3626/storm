import React, { useState } from "react";
import EmailModal from "../modals/EmailModal"; // Import the modal component

interface EmailButtonProps {
  email: string;
  subject?: string;
  body?: string;
}

const EmailButton: React.FC<EmailButtonProps> = ({ email, subject = "", body = "" }) => {
  const gmailUrl = `https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

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

      <EmailModal isOpen={isModalOpen} email={email} subject={subject} body={body} onClose={closeModal} onSend={sendEmail} />
    </div>
  );
};

export default EmailButton;