import { rephraseContent } from "../utils/llm";
import React, { useState } from "react";


interface ContentRephraseButtonProps {
    text: string;
    contentType: string;
    onResult: (rephrasedConent: string) => void;
  }


const ContentRephraseButton: React.FC<ContentRephraseButtonProps> = ({ text, contentType, onResult}) => {
  const [loading, setLoading] = useState(false);
  const [rephraseFailed, setRephraseFailed] = useState(false);

  const handleClick = async () => {
    if (!text) return;
    setRephraseFailed(false);
    setLoading(true);
    try {
        const result = await rephraseContent(text, contentType)
        if (result) {
            onResult(result.rephrasedResult); 
        }
    } catch (err) {
      console.error("Rephrasing content Error:", err);
      setRephraseFailed(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button className = "text-lg cursor-pointer font-semibold bg-gray-200 duration-200 ease hover:bg-gray-300 text-gray-800 font-bold px-4 py-3 text-lg rounded-lg transition duration-300" onClick={handleClick} disabled={loading}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.2" stroke="currentColor" className="size-5 -mt-1 mr-1 inline-block">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
      </svg>
 {loading ? "Loading..." : (rephraseFailed ? "Rephrase failed, Try again" : "Rephrase")}
    </button>
  );
};

export default ContentRephraseButton;

