import React from "react";
import Modal from "react-modal";
import "./modalStyles.css";
import ActionCompleteButton from "../components/ActionCompletedButton";


interface PhonecallModalProps {
    isOpen: boolean;
    closeModal: () => void;
    phoneNumber: string;
    callScript: string;
    actionId:   string;
  }
  

// Helper function to format phone number
function formatPhoneNumber(phoneNumber: string): string {
  const cleanNumber = phoneNumber.replace(/\D/g, '');
  if (cleanNumber.length === 10) {
    return `(${cleanNumber.slice(0, 3)}) ${cleanNumber.slice(3, 6)}-${cleanNumber.slice(6)}`;
  }
  return phoneNumber; // Return as is if it's not valid
}

const PhonecallModal: React.FC<PhonecallModalProps> = ({isOpen, closeModal, phoneNumber, callScript, actionId}) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={closeModal}
            contentLabel="Phone Call Action"
            className="modal-content"
            overlayClassName="modal-overlay"
        >
            {/* Close (X) button */}
            <button className="close-button" onClick={closeModal}>
                ✖
            </button>

            <h2>Phone Number</h2>
            <p>{formatPhoneNumber(phoneNumber)}</p>

            <h3>Script:</h3>
            <p>{callScript}</p>

            <div>
                <ActionCompleteButton actionId={actionId} actionType="callCount" onClick={closeModal}/>
            </div>

        </Modal>    
    );
}

export default PhonecallModal;


