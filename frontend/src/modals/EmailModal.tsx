import React from "react";
import Modal from "react-modal";
import { useState, useEffect } from "react";
import "./modalStyles.css"; // Import the CSS file
import ActionCompleteButton from "../components/ActionCompletedButton";
import ContentRephraseButton from "../components/ContentRephraseButton";
import { rephraseContent } from "../utils/llm";

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
    const [genBody, setGenBody] = useState("Loading...");
    const [subjectText, setSubjectText] = useState("Loading...")

    const initializeSubject = async () => {
        try {
          const result = await rephraseContent(subject, "email subject");
          setSubjectText(result.rephrasedResult);
        } catch (err) {
          console.error(err)
        }
      }

    const initializeBody = async () => {
        try {
          const result = await rephraseContent(body, "email body");
          setGenBody(result.rephrasedResult);
        } catch (err) {
          console.error(err)
        }
      }
    
    useEffect(() => {
        if (isOpen) {
          initializeSubject();
          initializeBody();
        }
      }, [isOpen]);



  return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Email Action"
            className="modal-content dark-style"
            overlayClassName="modal-overlay"
        > 

            {/* Close (X) button */}
            <button className="close-button" onClick={() => {setGenBody(""); setSubjectText(""); onClose()}}>
                ✖
            </button>

            <div className="emailContent ">
                <div className="border">
                    <strong>To:</strong> {email}
                </div>
                <div className="border">
                    <strong>Subject:</strong> {subjectText}
                </div>
                <div className="border">
                <textarea 
                style={{ whiteSpace: "pre-wrap", width: "100%", height: "200px" }}
                value={genBody}
                onChange={(e) => setGenBody(e.target.value)} // Assuming you are using state
            />
                </div>
            </div>

            <div className="button-container">
                <ActionCompleteButton actionId={actionId} actionType="emailCount" onClick={onClose}/>
                <ContentRephraseButton text={genBody} contentType="email body" onResult={setGenBody}/>
                <button className="sendButton" onClick={(e) => {(e.target as HTMLButtonElement).blur();onSend()}}> 
                        Send Email
                </button>
            </div>
        </Modal>
    )
};

export default EmailModal;


