import React from "react";
import Modal from "react-modal";
import "./modalStyles.css";

interface SubmissionGuideModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

const SubmissionGuideModal: React.FC<SubmissionGuideModalProps> = ({ isOpen, closeModal }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Submission Guide"
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
        <h2 className="text-3xl font-bold mb-6">Submission Guide</h2>

        <div className="guide-content">
          <h4 className="text-xl font-semibold mb-4">How to Submit:</h4>
          <ul className="list-disc pl-5 space-y-2">
            <li>Fill out a relevant title and description for your action. Both these fields are mandatory to create an action.</li>
            <li>If desired, fill out a tone as well.</li>
            <li>If you click the 'Generate Content' button, it will generate content based on the description and the tone.</li>
            <li>Feel free to fill out the rest of the content like names, email addresses, links, phone numbers.</li>
            <li>Upon clicking 'Create Action', you will receive an alert informing you about what actions will be created.</li>
            <li>Only actions with all fields filled out will be in that alert.</li>
            <li>Once confirmed, your action will be created and visible in the Action Dashboard!</li>
          </ul>

          <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <h4 className="text-xl font-semibold mb-2">Legal Disclaimer:</h4>
            <p className="text-md">
              <strong>This platform is intended solely for lawful and legitimate purposes. 
              By using this service, you agree not to engage in any illegal, harmful, or unauthorized activities. 
              The platform and its creators are not responsible for any misuse, user-generated content, or consequences 
              resulting from violations of applicable laws or regulations.</strong>
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SubmissionGuideModal; 