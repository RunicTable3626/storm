import React, {useState} from "react";
import InstagramModal from "../modals/InstagramModal";

interface InstagramButtonProps {
  action: any;
  isAdminView: boolean;
}

const InstagramButton: React.FC<InstagramButtonProps> = ({action, isAdminView}) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  return (
    <div>
      {/* Button to open the modal */}
      <button
        onClick={(e) => {
          (e.target as HTMLButtonElement).blur()
          setModalIsOpen(true)}}
        className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
      >
        Comment on Instagram
      </button>

      {/* Instagram Modal */}
      <InstagramModal isOpen={modalIsOpen} closeModal={() => setModalIsOpen(false)} action = {action} isAdminView = {isAdminView} />
    </div>
  );
};

export default InstagramButton

