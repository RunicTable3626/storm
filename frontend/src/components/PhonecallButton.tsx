import React, { useState } from 'react';


function formatPhoneNumber(phoneNumber: string): string {
    // Remove any non-digit characters
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    // Ensure the input is exactly 10 digits
    if (cleanNumber.length === 10) {
      // Format the number as (XXX) XXX-XXXX
      return `(${cleanNumber.slice(0, 3)}) ${cleanNumber.slice(3, 6)}-${cleanNumber.slice(6)}`;
    }
    // If not a valid 10-digit number, return the input as is
    return phoneNumber;
  }
  

// Modal component
const Modal = ({ phoneNumber, callScript, onClose }: { phoneNumber: string, callScript: string; onClose: () => void }) => (
  <div style={modalStyles}>
    <div style={modalContentStyles}>
      <h2>Phone Number</h2>
      <p>{formatPhoneNumber(phoneNumber)}</p>
      <h3>Script:</h3>
      <p>{callScript}</p>
      <button onClick={onClose}>Close</button>
    </div>
  </div>
);


interface PhoneCallButtonProps {
    phoneNumber: string;
    callScript: string;
  }

// PhonecallButton component
const PhonecallButton:  React.FC<PhoneCallButtonProps> = ({ phoneNumber = "", callScript = ""}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Phone number to display

  // Function to open the modal
  const openModal = () => setIsModalOpen(true);

  // Function to close the modal
  const closeModal = () => setIsModalOpen(false);

  return (
    <div>
      <button onClick={openModal}>Show Phone Number</button>

      {/* Conditionally render the modal */}
      {isModalOpen && <Modal phoneNumber={phoneNumber} callScript={callScript} onClose={closeModal} />}
    </div>
  );
};

// Basic modal styles
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

export default PhonecallButton;
