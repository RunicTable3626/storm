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
            <button className="close-button" onClick={closeModal}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-10">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
            </button>
            <div className="modal-container">
                <div className="dark-style">
                    <h2 className="text-4xl font-bold" text-center>Are you sure you want to delete this action?</h2>
                    <h3 className="text-xl italic mt-4 text-left">Changes cannot be reversed.</h3>
                </div>

                <div className="flex justify-start gap-3 mt-4">
                    <button 
                        onClick={closeModal}
                        className="font-semibold cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded duration-200 ease"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {handleClick(); closeModal();}}
                        className="font-semibold cursor-pointer bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded duration-200 ease"
                    >
                        Delete Action
                    </button>
                </div>
            </div>
        </Modal>    
    );
}

export default DeleteActionModal;