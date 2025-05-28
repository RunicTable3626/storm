import React, {useState, useEffect} from 'react';
import Modal from "react-modal";
import "./modalStyles.css"; // Import the CSS file
import ActionCompleteButton from "../components/ActionCompletedButton";
import ContentRephraseButton from '../components/ContentRephraseButton';
import { rephraseContent } from '../utils/llm';

interface InstagramModalProps {
  isOpen: boolean;
  closeModal: () => void;
  action: any;
  isAdminView: boolean;
}

const InstagramModal: React.FC<InstagramModalProps> = ({ isOpen, closeModal, action, isAdminView }) => {
  const [instaText, setInstaText] = useState(action.instaId.comment);
  const [instaUrl, setInstaUrl] = useState(action.instaId.instagramLink);
  const [tooltipState, setTooltipState] = useState({ visible: false, copied: false });
  const contentType = "instagram comment";
  const postUrl =  instaUrl.startsWith("https://www.instagram.com") ? instaUrl : `https://www.instagram.com/p/${instaUrl}/`;

  useEffect(() => {
    setInstaText(action.instaId.comment);
    setInstaUrl(action.instaId.instagramLink);
  }, [action.instaId.comment, action.instaId.instagramLink]); 

    useEffect(() => {
      if (!isOpen) return; // Only run when modal opens
      if (!action.instaId) return;
      if (isAdminView) return;
    
      setInstaText("Generating...");
    
      const rephrase = async () => {
        try {
          const instaTextResult = await rephraseContent(action.instaId.comment || "", contentType)
          if (instaTextResult?.rephrasedResult) {
            setInstaText(instaTextResult.rephrasedResult);
          }
        } catch (err) {
          console.error("Error rephrasing comment content:", err);
        }
      };
    
      rephrase();
    }, [isOpen]);


  const handleCopy = async (text: string) => {
    if (!text) {
      return console.error('Nothing to copy');
    }
  
    try {
      await navigator.clipboard.writeText(text);
      setTooltipState({ visible: true, copied: true });
      
      setTimeout(() => {
        setTooltipState(prevState => ({ ...prevState, visible: false }));
        
        setTimeout(() => {
          setTooltipState({ visible: false, copied: false });
        }, 300);
      }, 3000);
    } catch (err) {
      console.error('Text copy failed:', err);
    }
  };
  
  const handleMouseEnter = () => {
    if (!tooltipState.copied) {
      setTooltipState(prevState => ({ ...prevState, visible: true }));
    }
  };
  
  const handleMouseLeave = () => {
    if (!tooltipState.copied) {
      setTooltipState(prevState => ({ ...prevState, visible: false }));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Instagram Post"
      className="modal-content"
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
        <h2 className="text-3xl font-bold mb-6 dark-style">Take action on Instagram</h2>
        
        <div className="border mb-6 copy-wrapper">
          <p className="text-gray-700 dark-style custom-pad-copy">{instaText}</p>
          <div 
            className="copy-icon"
            onClick={() => handleCopy(instaText)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
            </svg>
            <div className={`tooltip ${tooltipState.visible ? 'visible' : ''}`}>
              {tooltipState.copied ? "Text copied!" : "Copy text"}
            </div>
          </div>
        </div>

        <div className="button-container">
          <ContentRephraseButton text={action.instaId.comment} contentType={contentType} onResult={setInstaText}/>
          <button
            onClick={(e) => {
              (e.target as HTMLButtonElement).blur()
              window.open(postUrl, "_blank", "noopener,noreferrer")}}
            className="cursor-pointer bg-violet-500 hover:bg-violet-600 text-white font-bold px-4 py-3 text-lg rounded-lg transition duration-200 ease"
          >
           <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" fill="currentColor"strokeWidth="2.0" className="col-centered inline-block -mt-1 bi bi-instagram" viewBox="0 0 16 16">
        <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334"/>
      </svg>  Open Instagram 
          </button>
        </div>

        <div className="button-container">
          {action._id !== "preview" && !isAdminView && (
            <ActionCompleteButton actionId={action._id} actionType="instaCount" onClick={closeModal}/>
          )}
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Tips!</h3>
          <p className="mb-4"><strong>IMPORTANT: This will open up Instagram on whatever account you are logged into! So make sure it's one you want to comment from.</strong></p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Use 'Copy Text' to copy the comment on your screen</li>
            <li>Use 'Rephrase' to generate a new comment to avoid identical messages from being sent.</li>
            <li>Once you're ready, use 'Open Instagram' to open up the instagram post.</li>
            <li>You should be able to paste the comment and submit a comment directly!</li>
            <li>Don't forget to return to the app and use 'Complete Action' to confirm that you have finished this action</li>
            <li>Lastly, thank you so much for helping grassroots campaigns, <strong>one action at a time!</strong></li>
          </ul>
        </div>
      </div>
    </Modal>
  );
};

export default InstagramModal;


