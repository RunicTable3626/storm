import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const ShareIdRedirect = () => {
  const { shareId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {

        if (!shareId || !/^[A-Za-z0-9_-]{10}$/.test(shareId)) {
          console.warn("Invalid shareId format:", shareId);
          navigate("/"); // or any fallback route
        } else {
          navigate('/action-dashboard', { state: { shareId } });
        }
  }, [shareId, navigate]);

  return <p>Loading shared action...</p>;
};

export default ShareIdRedirect;

