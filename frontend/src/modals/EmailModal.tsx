import React from "react";
import Modal from "react-modal";
import "./modalStyles.css"; // Import the CSS file
import ActionCompleteButton from "../components/ActionCompletedButton";

interface EmailModalProps {
  isOpen:       boolean;
  email:        string;
  subject:      string;
  body:         string;
  actionId:     string;
  onClose:() =>  void;
  onSend: () =>  void;
}

const EmailModal: React.FC<EmailModalProps> = ({ isOpen, email, subject, body, actionId, onClose, onSend }) => {
  return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Email Action"
            className="modal-content"
            overlayClassName="modal-overlay"
        > 

            {/* Close (X) button */}
            <button className="close-button" onClick={onClose}>
                ✖
            </button>

            <div className="emailContent">
                <div className="border p-3 rounded bg-gray-100 mb-2">
                    <strong>Recipient:</strong> {email}
                </div>
                <div className="border p-3 rounded bg-gray-100 mb-2">
                    <strong>Subject:</strong> {subject}
                </div>
                <div className="border p-3 rounded bg-gray-100 mb-2">
                    <strong>Body:</strong>
                    <div style={{ whiteSpace: "pre-wrap" }}>{body}</div>
                </div>
            </div>

            <div className="button-container">
                <ActionCompleteButton actionId={actionId} actionType="emailCount" onClick={onClose}/>
                <button className="sendButton" onClick={(e) => {(e.target as HTMLButtonElement).blur();onSend()}}> 
                        Send Email
                </button>
            </div>
        </Modal>
    )
};

export default EmailModal;


