import GifComponent from "../components/HomePageGif";
import { useAuth, useUser, useSession } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const { getToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const token = await getToken();
      console.log("JWT Token:", token);
    })();
  }, []);

  const { user, isLoaded: userLoaded } = useUser();
  const { session, isLoaded: sessionLoaded } = useSession();

  if (!userLoaded || !sessionLoaded) return <p>Loading...</p>;


    return (

    <div style={{ textAlign: "center", marginTop: "50px" }}>
    <h1>storm.</h1>
    <h2>Quick Universal Actions for Collective Kindness (QUACK)</h2>
    <GifComponent />
    <br></br>
    <button onClick={() => {navigate('/action-dashboard')}}>Take Action NOW!</button>


    <div>

      <h2>👤 User Info</h2>
      <pre>{JSON.stringify(user, null, 2)}</pre>

      <h2>📱 Session Info</h2>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  </div>
  )
  };
  
  export default HomePage;




