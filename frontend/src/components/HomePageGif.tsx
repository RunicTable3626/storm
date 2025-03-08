import { useState } from 'react';
import dancingDuckKarlo from '../assets/dancing-duck-karlo.gif';

const GifComponent = () => {
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
        src={dancingDuckKarlo}
        alt="Dancing Duck Karlo GIF"
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
};

export default GifComponent;