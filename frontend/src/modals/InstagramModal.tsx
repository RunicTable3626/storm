import React, { useRef, useState} from 'react';
import Modal from "react-modal";
import "./modalStyles.css"; // Import the CSS file
import ActionCompleteButton from "../components/ActionCompletedButton";
import ContentRephraseButton from '../components/ContentRephraseButton';

interface InstagramModalProps {
  isOpen: boolean;
  closeModal: () => void;
  postUrl: string;
  comment: string;
  actionId: string;
}

const InstagramModal: React.FC<InstagramModalProps> = ({ isOpen, closeModal, postUrl, comment, actionId}) => {
  const [copied, setCopied] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);
  const [instaText, setInstaText] = useState(comment);
  const contentType = "instagram comment";

  const handleCopy = async () => {
    const text = textRef.current?.innerText;
  
    if (!text) {
      return console.error('Nothing to copy: textRef is null or empty');
    }
  
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Text copy failed:', err);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Instagram Post"
      className="modal-content"
      overlayClassName="modal-overlay"
    >
      {/* Close (X) button */}
      <button className="close-button" onClick={closeModal}>
        ✖
      </button>

      <h2 className="text-xl font-bold mb-4 dark-style">Go to Instagram</h2>
      <p ref={textRef} className="text-gray-700 mb-4 dark-style">{instaText}</p>
      <div className="button-container">
        {comment && <button onClick={ (e) => {
          (e.target as HTMLButtonElement).blur()
          handleCopy()}
        }
        >Copy Text</button>}
        {copied && comment && <span style={{ color: 'green', marginLeft: '10px' }}>Text copied!</span>}

        <ContentRephraseButton text={instaText} contentType={contentType} onResult={setInstaText}/>
      </div>
      <div className="button-container ">
          <ActionCompleteButton actionId={actionId} actionType="instaCount" onClick={closeModal}/>
          <button
            onClick={(e) => {
                (e.target as HTMLButtonElement).blur()
                window.open(postUrl, "_blank", "noopener,noreferrer")}}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
            >
            Open Instagram
          </button>
      </div>

      <div className = 'dark-style'>
      <h3>Tips!</h3>
      <ul>
        <li>Use 'Copy Text' to copy the comment on your screen</li>
        <li>Use 'Rephrase' to generate a new comment to avoid identical messages from  being sent.</li>
        <li>Once you're ready, use 'Open Instagram' to open up the instagram post.</li>
        <li>You should be able to paste the comment and submit a comment directly!</li>
        <li>Don't forget to return to the app and use 'Complete Action' to confirm that you have finished this action</li>
        <li>Lastly, thank you so much for helping grassroots campaigns, <strong>one action at a time!</strong></li>
      </ul>
    </div>
    </Modal>
  );
};

export default InstagramModal;


