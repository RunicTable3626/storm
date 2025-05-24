import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import "./modalStyles.css";
import ActionCompleteButton from "../components/ActionCompletedButton";
import ContentRephraseButton from "../components/ContentRephraseButton";

interface EmailModalProps {
  isOpen: boolean;
  closeModal: () => void;
  action: any;
  isAdminView: boolean;
}

const EmailModal: React.FC<EmailModalProps> = ({ isOpen, closeModal, action, isAdminView }) => {
  const [genBody, setGenBody] = useState(action.emailId?.body || "");
  const [subjectText, setSubjectText] = useState(action.emailId?.subject || "");
  const [emailAddress, setEmailAddress] = useState(action.emailId?.emailAddress || "");
  const [subjectTooltipState, setSubjectTooltipState] = useState({ visible: false, copied: false });
  const [bodyTooltipState, setBodyTooltipState] = useState({ visible: false, copied: false });

  useEffect(() => {
    if (action.emailId) {
      setEmailAddress(action.emailId.emailAddress || "");
      setGenBody(action.emailId.body || "");
      setSubjectText(action.emailId.subject || "");
    }
  }, [action.emailId]);

  const handleCopy = async (text: string, isCopyingSubject: boolean) => {
    if (!text) {
      return console.error('Nothing to copy');
    }
    
    try {
      await navigator.clipboard.writeText(text);
      
      if (isCopyingSubject) {
        // Show "Text copied!" tooltip
        setSubjectTooltipState({ visible: true, copied: true });
        
        // After 3 seconds, begin hiding
        setTimeout(() => {
          // First make the tooltip invisible
          setSubjectTooltipState(prevState => ({ ...prevState, visible: false }));
          
          // After animation completes, reset the copied state
          setTimeout(() => {
            setSubjectTooltipState({ visible: false, copied: false });
          }, 300);
        }, 3000);
      } else {
        // Show "Text copied!" tooltip
        setBodyTooltipState({ visible: true, copied: true });
        
        // After 3 seconds, begin hiding
        setTimeout(() => {
          // First make the tooltip invisible
          setBodyTooltipState(prevState => ({ ...prevState, visible: false }));
          
          // After animation completes, reset the copied state
          setTimeout(() => {
            setBodyTooltipState({ visible: false, copied: false });
          }, 300);
        }, 3000);
      }
    } catch (err) {
      console.error('Text copy failed:', err);
    }
  };
  
  // Mouse enter/leave handlers
  const handleSubjectMouseEnter = () => {
    if (!subjectTooltipState.copied) {
      setSubjectTooltipState(prevState => ({ ...prevState, visible: true }));
    }
  };
  
  const handleSubjectMouseLeave = () => {
    if (!subjectTooltipState.copied) {
      setSubjectTooltipState(prevState => ({ ...prevState, visible: false }));
    }
  };
  
  const handleBodyMouseEnter = () => {
    if (!bodyTooltipState.copied) {
      setBodyTooltipState(prevState => ({ ...prevState, visible: true }));
    }
  };
  
  const handleBodyMouseLeave = () => {
    if (!bodyTooltipState.copied) {
      setBodyTooltipState(prevState => ({ ...prevState, visible: false }));
    }
  };

  const onSend = () => {
    // Open Gmail with pre-filled content
    const emailUrl = `mailto:${emailAddress}?subject=${encodeURIComponent(subjectText)}&body=${encodeURIComponent(genBody)}`;
    window.open(emailUrl, '_blank');
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Email Action"
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
        <h2 className="text-3xl font-bold mb-6">Send an Email</h2>

        <div className="emailContent">
          <div className="border">
            <strong>To:</strong> {emailAddress}
          </div>
          <div className="border copy-wrapper">
            <div className="subject-container mb-2">
              <strong>Subject:</strong> {subjectText}
              <div 
                className="copy-icon"
                onClick={() => handleCopy(subjectText, true)}
                onMouseEnter={handleSubjectMouseEnter}
                onMouseLeave={handleSubjectMouseLeave}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                </svg>
                <div className={`tooltip font-semibold ${subjectTooltipState.visible ? 'visible' : ''}`}>
                  {subjectTooltipState.copied ? "Text copied!" : "Copy subject text"}
                </div>
              </div>
            </div>
            <div><ContentRephraseButton text={subjectText} contentType="email subject" onResult={setSubjectText}/></div>
          </div>

          <div className="copy-wrapper" style={{marginBottom: '30px'}}>
            <textarea className="border"
              value={genBody}
              onChange={(e) => setGenBody(e.target.value)}
              style={{marginBottom: '0'}}
            />
            <div 
              className="copy-icon"
              onClick={() => handleCopy(genBody, false)}
              onMouseEnter={handleBodyMouseEnter}
              onMouseLeave={handleBodyMouseLeave}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
              </svg>
              <div className={`tooltip ${bodyTooltipState.visible ? 'visible' : ''}`}>
                {bodyTooltipState.copied ? "Text copied!" : "Copy text"}
              </div>
            </div>
          </div>
        </div>

        <div className="button-container">
          <ContentRephraseButton text={genBody} contentType="email body" onResult={setGenBody}/>
          <button
            className="cursor-pointer bg-violet-500 hover:bg-violet-600 text-white font-bold px-4 py-3 text-lg rounded-lg transition duration-200 ease" 
            onClick={(e) => {
              (e.target as HTMLButtonElement).blur();
              onSend();
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.2" stroke="currentColor" className="size-6 -mt-0.5 mr-1 inline-block">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
            </svg>
            Send Email
          </button>
        </div>

        <div className="mt-4">
          {action._id !== "preview" && !isAdminView && (
            <ActionCompleteButton actionId={action._id} actionType="emailCount" onClick={closeModal}/>
          )}
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Tips!</h3>
          <p className="mb-4"><strong>IMPORTANT: 'Send Email' will open up Gmail on whatever account you are logged into! So make sure it's one you want to send an email from.</strong></p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Use 'Rephrase' to generate a new email body or subject to avoid identical messages from being sent.</li>
            <li>You can even manually edit the email in the text box!</li>
            <li>Once you're ready, use 'Send Email' to use your email account to send the email. As of now, we only support Gmail accounts.</li>
            <li>If you prefer to use another type of email, you can click the copy icons to copy the content and paste it into your email app.</li>
            <li>Don't forget to return here and use 'Complete Action' to confirm that you have finished this action</li>
            <li>Lastly, thank you so much for helping grassroots campaigns, <strong>one action at a time!</strong></li>
          </ul>
        </div>
      </div>
    </Modal>
  );
};

export default EmailModal;


