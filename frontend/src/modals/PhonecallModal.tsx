import React, {useState} from "react";
import Modal from "react-modal";
import "./modalStyles.css";
import ActionCompleteButton from "../components/ActionCompletedButton";
import ContentRephraseButton from "../components/ContentRephraseButton";


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
    const [callText, setCallText] = useState(callScript);
    const contentType = "voicemail";
    
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={closeModal}
            contentLabel="Phone Call Action"
            className="modal-content dark-style"
            overlayClassName="modal-overlay"
        >
            {/* Close (X) button */}
            <button className="close-button" onClick={closeModal}>
                ✖
            </button>

            <h2>Phone Number</h2>
            <p>{formatPhoneNumber(phoneNumber)}</p>

            <h3>Script:</h3>
            <p >{callText}</p>

            <div className="button-container ">
                <ActionCompleteButton actionId={actionId} actionType="callCount" onClick={closeModal}/>
                <ContentRephraseButton text={callText} contentType={contentType} onResult={setCallText}/>
            </div>

            <div className = 'dark-style'>
                <h3>Tips!</h3>
                <ul>
                    <li>If you don't like the call script, use 'Rephrase' to generate a new one.</li>
                    <li>Once you're ready, Call the phone number mentioned and use the call script as an aid.</li>
                    <li>Don't forget to return to the app and use 'Complete Action' to confirm that you have finished this action</li>
                    <li>Lastly, thank you so much for helping grassroots campaigns, <strong>one action at a time!</strong></li>
                </ul>
                </div>

        </Modal>    
    );
}

export default PhonecallModal;


