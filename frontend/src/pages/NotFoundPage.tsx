import { useLocation } from 'react-router-dom';

const NotFoundPage = () => {
  const location = useLocation();
  console.log("Unknown path:", location.pathname);
  const shareId = location.pathname.split('/')[1]
  const isValid = /^[A-Za-z0-9_-]{10}$/.test(shareId);
  console.log("Is valid shareId:", isValid); // true or false
    return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
    <h1>Page Not Found</h1>
  </div>
  )
  };
  
  export default NotFoundPage;