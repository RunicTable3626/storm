import React, {useState} from "react";
import InstagramModal from "../modals/InstagramModal";

interface InstagramButtonProps {
  postId: string;
  comment: string;
  actionId: string;
}

const InstagramButton: React.FC<InstagramButtonProps> = ({ postId, comment, actionId }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const postUrl =  postId.startsWith("https://www.instagram.com") ? postId : `https://www.instagram.com/p/${postId}/`;

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
      <InstagramModal isOpen={modalIsOpen} closeModal={() => setModalIsOpen(false)} postUrl={postUrl} comment={comment} actionId={actionId} />
    </div>
  );
};

export default InstagramButton

