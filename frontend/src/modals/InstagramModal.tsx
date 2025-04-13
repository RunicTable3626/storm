import React, { useRef, useState } from 'react';
import Modal from "react-modal";
import "./modalStyles.css"; // Import the CSS file
import ActionCompleteButton from "../components/ActionCompletedButton";

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
      <p ref={textRef} className="text-gray-700 mb-4 dark-style">{comment}</p>
      {comment && <button onClick={ (e) => {
        (e.target as HTMLButtonElement).blur()
        handleCopy()}
      }
      >Copy Text</button>}
      {copied && comment && <span style={{ color: 'green', marginLeft: '10px' }}>Text copied!</span>}
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
    </Modal>
  );
};

export default InstagramModal;


