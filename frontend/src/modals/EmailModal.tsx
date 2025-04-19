import React from "react";
import Modal from "react-modal";
import { useState, useEffect} from "react";
import "./modalStyles.css"; // Import the CSS file
import ActionCompleteButton from "../components/ActionCompletedButton";
import ContentRephraseButton from "../components/ContentRephraseButton";

interface EmailModalProps {
  isOpen:       boolean;
  action:           any;
  onClose:() =>  void;
  onSend: () =>  void;
}

const EmailModal: React.FC<EmailModalProps> = ({ isOpen, action,  onClose, onSend }) => {
    const [genBody, setGenBody] = useState(action.emailId.body);
    const [subjectText, setSubjectText] = useState(action.emailId.subject);
    const [emailAddress, setEmailAddress] = useState(action.emailId.emailAddress);

    useEffect(() => {
        setEmailAddress(action.emailId.emailAddress);
        setGenBody(action.emailId.body);
        setSubjectText(action.emailId.subject);
      }, [action.emailId.emailAddress, action.emailId.body, action.emailId.subject]);
    

  return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Email Action"
            className="modal-content dark-style"
            overlayClassName="modal-overlay"
        > 

            {/* Close (X) button */}
            <button className="close-button" onClick={onClose}>
                ✖
            </button>

            <div className="emailContent ">
                <div className="border">
                    <strong>To:</strong> {emailAddress}
                </div>
                <div className="border">
                    <div><strong>Subject:</strong> {subjectText}</div>
                    <div><ContentRephraseButton text={subjectText} contentType="email subject" onResult={setSubjectText}/></div>
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
                <ActionCompleteButton actionId={action._id} actionType="emailCount" onClick={onClose}/>
                <ContentRephraseButton text={genBody} contentType="email body" onResult={setGenBody}/>
                <button className="sendButton" onClick={(e) => {(e.target as HTMLButtonElement).blur();onSend()}}> 
                        Send Email
                </button>
            </div>

            <div className = 'dark-style'>
                <h3>Tips!</h3>
                <p><strong>IMPORTANT: This link will open up Gmail on whatever account you are logged into! So make sure it's one you want to send an email from.</strong></p>
                <ul>
                    <li>Use 'Rephrase' to generate a new email body or subject to avoid identical messages from  being sent.</li>
                    <li>You can even manually edit the email in the text box!</li>
                    <li>Once you're ready, use 'Send Email' to use your email account to send the email. As of now, we only support Gmail accounts.</li>
                    <li>Don't forget to return to the app and use 'Complete Action' to confirm that you have finished this action</li>
                    <li>Lastly, thank you so much for helping grassroots campaigns, <strong>one action at a time!</strong></li>
                </ul>
                </div>
        </Modal>
    )
};

export default EmailModal;


