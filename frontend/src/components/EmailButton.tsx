import React from "react";

interface EmailButtonProps {
  email: string;
  subject?: string;
  body?: string;
}

const EmailButton: React.FC<EmailButtonProps> = ({ email, subject = "", body = "" }) => {
    const gmailUrl = `https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  const handleClick = () => {
    window.open(gmailUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <button
      onClick={handleClick}
      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
    >
      Send an Email
    </button>
  );
};

export default EmailButton;