import React, { useState, useEffect, useRef } from 'react';

// Defining the component using FC (Function Component) type
const GlobalAudio: React.FC = () => {
  // State to track whether the audio is playing
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Reference for the audio element
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio properties only when the component mounts
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = true; // Loop the audio
      audioRef.current.volume = 0.5; // Set the initial volume (optional)
    }
  }, [isPlaying]);

  // Function to play the audio
  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play().catch((err) => {
        console.error("Failed to play audio:", err);
      });
      setIsPlaying(true); // Mark audio as playing
    }
  };

  // Function to stop the audio
  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause(); 
      setIsPlaying(false); // Mark audio as stopped
    }
  };


  return (
    <div>
      {/* Play Button (Only shown if audio isn't playing) */}
      {!isPlaying && (
        <button onClick={playAudio}>
          Start Quacking
        </button>
      )}

      {/* Stop Button (Only shown if audio is playing) */}
      {isPlaying && (
        <button onClick={stopAudio}>
          Stop Quacking
        </button>
      )}
      
      {/* Hidden Audio element */}
      <audio ref={audioRef} src="/duck-tales-8-bit.mp3" />
    </div>
  );
};

export default GlobalAudio;