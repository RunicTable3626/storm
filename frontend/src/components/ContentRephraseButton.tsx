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
    <button onClick={handleClick} disabled={loading}>
      {loading ? "Loading..." : (rephraseFailed ? "Rephrase failed, Try again" : "Rephrase")}
    </button>
  );
};

export default ContentRephraseButton;

