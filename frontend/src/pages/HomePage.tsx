import GifComponent from "../components/HomePageGif";
import dancingDuckKarlo from '../assets/dancing-duck-karlo.gif';
import {useUser, useSession } from "@clerk/clerk-react";
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';


const HomePage = () => {
  const navigate = useNavigate();
  const {isLoaded: userLoaded } = useUser();
  const {isLoaded: sessionLoaded } = useSession();
  const [showGuide, setShowGuide] = useState(false);

  if (!userLoaded || !sessionLoaded) return <p>Loading...</p>;


    return (

    <div style={{ textAlign: "center", marginTop: "50px" }}>
    <h1>storm.</h1>
    <h2>Quick Universal Actions for Collective Kindness (QUACK)</h2>
    <GifComponent gifFile={dancingDuckKarlo}/>
    <br></br>
    <button onClick={() => {navigate('/action-dashboard')}}>Take Action NOW!</button>
    <br></br>
    <br></br>
    <button type="button" onClick={ (e) => {
                    (e.target as HTMLButtonElement).blur()
                    setShowGuide(!showGuide)
                  }}>
        {showGuide ? "Hide Guide" : "How to Enable Notifications"}
        </button>

        {showGuide && (
          <div
              style={{
                maxWidth: "100%",
                width: "100%",
                wordWrap: "break-word",
                padding: "16px",
                borderRadius: "6px",
                fontSize: "1rem",
                marginTop: "0.5rem",
                boxSizing: "border-box",
                marginLeft: "0",   // optional: ensure no auto-centering
              }}
            >
          <h4 style={{ fontWeight: "600", marginBottom: "0.5rem" }}>How to use Notifications:</h4>
          <ul style={{ listStyleType: "disc", paddingLeft: "1.25rem", margin: 0,textAlign: "left" }}>
            <li>Tap the bell icon on the menu to be notified every time a new action is created!</li>
            <li>Notifications will be active even if you leave this app!</li>
            <li>You must allow the browser permission to send you notifications in your settings on your phone/computer.</li>
            <li>Clearing your cookies or other site data will unsubscribe you from notifications.</li>
            <li>Using incognito mode will also unsubscribe you from notifications.</li>
            <li>Currently, notifications only work on <strong>Android phones</strong> using <strong>Chrome, Edge, Firefox, or Brave</strong>.</li>
            <li><strong>Notifications do NOT work on iOS devices.</strong></li>
            <li>Notifications work on PC and Mac in <strong>Chrome, Edge, Firefox, and Brave</strong>.</li>
          </ul>
        </div>)}


  </div>
  )
  };
  
  export default HomePage;




