import React, { useState } from "react";


const Modal = ({ email, subject, body, onClose, onSend }: { email: string, subject: string, body: string; onClose: () => void , onSend: () => void}) => (
  <div style={modalStyles}>
    <div style={modalContentStyles}>
        <div className="border p-3 rounded bg-gray-100 mb-2">
          <strong>To:</strong> {email}
        </div>
        <div className="border p-3 rounded bg-gray-100 mb-2">
          <strong>Subject:</strong> {subject}
        </div>
        <div className="border p-3 rounded bg-gray-100 whitespace-pre-wrap">
          {body}
        </div>
      <button onClick={onClose}>Close</button>
      <button onClick={onSend}>Send Email</button>
    </div>
  </div>
);

interface EmailButtonProps {
  email: string;
  subject?: string;
  body?: string;
}

const EmailButton: React.FC<EmailButtonProps> = ({ email, subject = "", body = "" }) => {
    const gmailUrl = `https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    const [isModalOpen, setIsModalOpen] = useState(false);

      // Function to open the modal
    const openModal = () => setIsModalOpen(true);

  // Function to close the modal
    const closeModal = () => setIsModalOpen(false);

  const sendEmail = () => {
    window.open(gmailUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div>
    <button
      onClick={openModal}
      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
    >
      Send an Email
    </button>
    {isModalOpen && <Modal email= {email} subject= {subject} body= {body} onClose={closeModal} onSend={sendEmail} />}
    </div>
  );
};



const modalStyles: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const modalContentStyles: React.CSSProperties = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '5px',
  textAlign: 'center',
  width: '300px',
};

export default EmailButton;

//add a modal to show the email template before sending it directly.