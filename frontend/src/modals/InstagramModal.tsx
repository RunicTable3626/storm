import React, { useRef, useState, useEffect} from 'react';
import Modal from "react-modal";
import "./modalStyles.css"; // Import the CSS file
import ActionCompleteButton from "../components/ActionCompletedButton";
import ContentRephraseButton from '../components/ContentRephraseButton';

interface InstagramModalProps {
  isOpen: boolean;
  closeModal: () => void;
  action: any;
}

const InstagramModal: React.FC<InstagramModalProps> = ({ isOpen, closeModal, action}) => {
  const [copied, setCopied] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);
  const [instaText, setInstaText] = useState(action.instaId.comment);
  const [instaUrl, setInstaUrl] = useState(action.instaId.instagramLink)
  const contentType = "instagram comment";
  const postUrl =  instaUrl.startsWith("https://www.instagram.com") ? instaUrl : `https://www.instagram.com/p/${instaUrl}/`;

  useEffect(() => {
    setInstaText(action.instaId.comment);
    setInstaUrl(action.instaId.instagramLink);
  }, [action.instaId.comment, action.instaId.instagramLink]); 


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

      <h2 className="text-xl font-bold mb-4 dark-style">Take action on Instagram</h2>
      <p ref={textRef} className="text-gray-700 mb-4 dark-style">{instaText}</p>
      <div className="button-container">
        {action.instaId.comment && <button onClick={ (e) => {
          (e.target as HTMLButtonElement).blur()
          handleCopy()}
        }
        >Copy Text</button>}
        {copied && action.instaId.comment && <span style={{ color: 'green', marginLeft: '10px' }}>Text copied!</span>}

        <ContentRephraseButton text={instaText} contentType={contentType} onResult={setInstaText}/>
      </div>
      <div className="button-container ">
          <ActionCompleteButton actionId={action._id} actionType="instaCount" onClick={closeModal}/>
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
      <p><strong>IMPORTANT: This will open up Instagram on whatever account you are logged into! So make sure it's one you want to comment from.</strong></p>
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


