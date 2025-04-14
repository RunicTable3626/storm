import React from "react";
import Modal from "react-modal";
import "./modalStyles.css";


interface DeleteActionModalProps {
    isOpen: boolean;
    closeModal: () => void;
    handleClick: () => void;
  }
  
const DeleteActionModal: React.FC<DeleteActionModalProps> = ({isOpen, closeModal, handleClick}) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={closeModal}
            contentLabel="Confirm Delete Action"
            className="modal-content"
            overlayClassName="modal-overlay"
        >
            {/* Close (X) button */}
            <button className="close-button" onClick={closeModal}>
                ✖
            </button>
            <div className="dark-style">
            <h2>Are you sure you want to delete this action?</h2>
            <h3>Changes cannot be reversed.</h3>
            </div>

            <div className="button-container">
          <button onClick={closeModal}>
            Cancel
          </button>
          <button
            onClick={() => {handleClick(); closeModal();}}
            >
            Delete Action
          </button>
      </div>
        </Modal>    
    );
}

export default DeleteActionModal;