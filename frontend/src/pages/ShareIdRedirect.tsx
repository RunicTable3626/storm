import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const ShareIdRedirect = () => {
  console.log("SharedViewRedirect mounted");
  const { shareId } = useParams();
  const navigate = useNavigate();
  console.log("shareId:", shareId); 

  useEffect(() => {
    console.log("Loaded shared view with ID:", shareId);

        if (!shareId || !/^[A-Za-z0-9_-]{10}$/.test(shareId)) {
          console.warn("Invalid shareId format:", shareId);
          navigate("/"); // or any fallback route
        } else {
          console.log("Valid shareId format:", shareId);
          navigate('/action-dashboard', { state: { shareId } });
        }
  }, [shareId, navigate]);

  return <p>Loading shared action...</p>;
};

export default ShareIdRedirect;

