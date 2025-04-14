import React, { useRef, useState, useEffect } from 'react';
import Modal from "react-modal";
import "./modalStyles.css"; // Import the CSS file
import ActionCompleteButton from "../components/ActionCompletedButton";
import ContentRephraseButton from '../components/ContentRephraseButton';
import { rephraseContent } from '../utils/llm';
import { SignedOut } from "@clerk/clerk-react";

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
  const [instaText, setInstaText] = useState("Loading...");
  const contentType = "instagram comment";

  const initializeComment = async () => {
    try {
      const result = await rephraseContent(comment, contentType);
      setInstaText(result.rephrasedResult);
    } catch (err) {
      console.error(err)
    }
  }


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

  useEffect(() => {
    if (isOpen) {
      initializeComment();
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Instagram Post"
      className="modal-content"
      overlayClassName="modal-overlay"
    >
      {/* Close (X) button */}
      <button className="close-button" onClick={() => {setInstaText(""); closeModal()}}>
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
          <SignedOut>
          <ActionCompleteButton actionId={actionId} actionType="instaCount" onClick={closeModal}/>
          </SignedOut>
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


