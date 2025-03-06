import React from "react";
import Modal from "react-modal";
import "./modalStyles.css"; // Import the CSS file

interface EmailModalProps {
  isOpen: boolean;
  email: string;
  subject: string;
  body: string;
  onClose: () => void;
  onSend: () => void;
}

const EmailModal: React.FC<EmailModalProps> = ({ isOpen, email, subject, body, onClose, onSend }) => {
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

            <div>
                <button className="sendButton" onClick={onSend}>
                Send Email
                </button>
            </div>

        </Modal>
    )
};

export default EmailModal;