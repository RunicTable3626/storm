import React from "react";
import Modal from "react-modal";
import "./modalStyles.css"; // Import the CSS file

interface InstagramModalProps {
  isOpen: boolean;
  closeModal: () => void;
  postUrl: string;
}

const InstagramModal: React.FC<InstagramModalProps> = ({ isOpen, closeModal, postUrl }) => {
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

      <h2 className="text-xl font-bold mb-4">Go to Instagram</h2>
      <p className="text-gray-700 mb-4">Do you want to open this post on Instagram?</p>

      <div className="flex justify-center gap-4">
        {/* Open Instagram Post Button */}
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


