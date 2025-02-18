import React from "react";

interface InstagramButtonProps {
  postId: string;
}

const InstagramButton: React.FC<InstagramButtonProps> = ({ postId }) => {
  const postUrl = `https://www.instagram.com/p/${postId}/`;
  const handleClick = () => {
    window.open(postUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <button
      onClick={handleClick}
      className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
    >
      Comment on Instagram
    </button>
  );
};

export default InstagramButton