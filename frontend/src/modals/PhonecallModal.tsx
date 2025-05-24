import React, {useEffect, useState} from "react";
import Modal from "react-modal";
import "./modalStyles.css";
import ActionCompleteButton from "../components/ActionCompletedButton";
import ContentRephraseButton from "../components/ContentRephraseButton";


interface PhonecallModalProps {
    isOpen: boolean;
    closeModal: () => void;
    action: any;
    isAdminView: boolean;
  }
  

// Helper function to format phone number
function formatPhoneNumber(phoneNumber: string): string {
  const cleanNumber = phoneNumber.replace(/\D/g, '');
  if (cleanNumber.length === 10) {
    return `(${cleanNumber.slice(0, 3)}) ${cleanNumber.slice(3, 6)}-${cleanNumber.slice(6)}`;
  }
  return phoneNumber; // Return as is if it's not valid
}

const PhonecallModal: React.FC<PhonecallModalProps> = ({isOpen, closeModal, action, isAdminView}) => {
    const [callText, setCallText] = useState(action.callId.callScript);
    const [phoneNumber, setPhoneNumber] = useState(action.callId.phoneNumber);
    const contentType = "voicemail";

    useEffect(() => {
        setCallText(action.callId.callScript);
        setPhoneNumber(action.callId.phoneNumber);
    }, [action.callId.callScript, action.callId.phoneNumber]); 
    
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={closeModal}
            contentLabel="Phone Call Action"
            className="modal-content dark-style"
            overlayClassName="modal-overlay"
            closeTimeoutMS={300}
            htmlOpenClassName="ReactModal__Html--open"
        >
            {/* Close (X) button */}
            <button className="close-button" onClick={closeModal}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-10">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
            </button>

            <div className="modal-container">
                <h2 className="text-3xl font-bold mb-6">Make a Phone Call</h2>

                <div className="border mb-6">
                    <h3 className="text-xl font-bold mb-2">Phone Number</h3>
                    <p className="text-lg">{formatPhoneNumber(phoneNumber)}</p>
                </div>

                <div className="border mb-6">
                    <h3 className="text-xl font-bold mb-2">Script:</h3>
                    <p className="text-lg">{callText}</p>
                </div>

                <div className="button-container">
                    <ContentRephraseButton text={action.callId.callScript} contentType={contentType} onResult={setCallText}/>
                    <button
                        onClick={() => window.open(`tel:${phoneNumber.replace(/\D/g, '')}`)}
                        className="bg-violet-500 hover:bg-violet-600 cursor-pointer text-white text-lg text-center font-bold py-4 px-4 rounded-lg transition duration-300"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.75" stroke="currentColor" className="inline-block -mt-1 mr-1 size-5">
  <path strokeLinecap="round" stroke-lineJoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
</svg>
 Make Phone Call
                    </button>
                </div>
                <div className = "mt-2">
                {action._id !== "preview"  && !isAdminView && (
                    <ActionCompleteButton actionId={action._id} actionType="callCount" onClick={closeModal}/>
                )}
                </div>

                <div className="mt-8">
                    <h3 className="text-xl font-bold mb-4">Tips!</h3>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>If you don't like the call script, use 'Rephrase' to generate a new one.</li>
                        <li>Once you're ready, Call the phone number mentioned and use the call script as an aid.</li>
                        <li>Don't forget to return to the app and use 'Complete Action' to confirm that you have finished this action</li>
                        <li>Lastly, thank you so much for helping grassroots campaigns, <strong>one action at a time!</strong></li>
                    </ul>
                </div>
            </div>
        </Modal>    
    );
}

export default PhonecallModal;


