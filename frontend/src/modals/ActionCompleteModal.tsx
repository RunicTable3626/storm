import React from "react";
import Modal from "react-modal";
import "./modalStyles.css";


interface ActionCompleteModalProps {
    isOpen: boolean;
    closeModal: () => void;
    handleClick: () => void;
  }
  
const ActionCompleteModal: React.FC<ActionCompleteModalProps> = ({isOpen, closeModal, handleClick}) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={closeModal}
            contentLabel="Confirm Action Completed"
            className="modal-content"
            overlayClassName="modal-overlay"
        >
            {/* Close (X) button */}
            <button className="close-button" onClick={closeModal}>
                ✖
            </button>
            <div className="dark-style">
            <h2>Are you sure you have completed this action?</h2>
            <h3>If you click 'Confirm', you will not be able to do this action for 24 hours.</h3>
            </div>

            <div className="button-container">
          <button onClick={closeModal}>
            Cancel
          </button>
          <button
            onClick={() => {handleClick(); closeModal();}}
            >
            Confirm
          </button>
      </div>
        </Modal>    
    );
}

export default ActionCompleteModal;