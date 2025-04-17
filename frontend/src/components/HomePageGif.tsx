import { useState } from 'react';


type GifComponentProps = {
  gifFile?: string;
};

const GifComponent: React.FC<GifComponentProps> = ({ gifFile }) => {
  const [loading, setLoading] = useState(true);

  const handleLoad = () => {
    setLoading(false);
  };

  const handleError = () => {
    setLoading(false);
    alert('Failed to load GIF');
  };

  return (
    <div>
      {loading && <p>Loading...</p>}
      <img
        src={gifFile}
        alt="8 Bit Animal Gif"
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
};

export default GifComponent;





