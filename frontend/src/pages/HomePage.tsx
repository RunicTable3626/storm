import GifComponent from "../components/HomePageGif";
import dancingDuckKarlo from '../assets/dancing-duck-karlo.gif';
import {useUser, useSession } from "@clerk/clerk-react";
import { useNavigate } from 'react-router-dom';
const ALLOWED_ORIGIN = import.meta.env.VITE_ALLOWED_ORIGIN; // from .env


const HomePage = () => {
  const navigate = useNavigate();
  const {isLoaded: userLoaded } = useUser();
  const {isLoaded: sessionLoaded } = useSession();

  if (!userLoaded || !sessionLoaded) return <p>Loading...</p>;


    return (

    <div style={{ textAlign: "center", marginTop: "50px" }}>
    <h1>storm.</h1>
    <h2>Quick Universal Actions for Collective Kindness (QUACK)</h2>
    <GifComponent gifFile={dancingDuckKarlo}/>
    <br></br>
    <button onClick={() => {navigate('/action-dashboard')}}>Take Action NOW!</button>
    <p>{ALLOWED_ORIGIN}</p>
  </div>
  )
  };
  
  export default HomePage;




