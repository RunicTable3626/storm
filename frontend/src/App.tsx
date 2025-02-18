import { useEffect, useState } from "react";
import InstagramButton from "./components/InstagramButton";
import EmailButton from "./components/EmailButton";

function App() {
  const [instagramLink, setInstagramLink] = useState("");
  const [emailInfo, setEmailInfo] = useState<{ 
    email: string; 
    subject: string; 
    body: string 
  }>
  ({
    email: "",
    subject: "",
    body: "",
  });

  useEffect(() => {
    //get instagram links
    fetch("/api/instagram")
      .then((res) => res.json())
      .then((data) => setInstagramLink(data.link_id))
      .catch((err) => console.error("Error fetching Instagram Link:", err));

    //get email info
    fetch("/api/email")  
      .then((res) => res.json())
      .then((data) => setEmailInfo(data.emailInfo))
      .catch((err) => console.error("Error fetching Email Information:", err));
  }, []);

  //console.log(emailInfo)
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>storm.</h1>
      <h2>Quick Universal Actions for Collective Kindness (QUACK)</h2>
      <h2>
        <div className="flex justify-center items-center h-screen">
              <InstagramButton postId={instagramLink} />
        </div>
    </h2>
    <h2>
    <div className="flex justify-center items-center h-screen">
      <EmailButton 
        email= {emailInfo?.email || ""}
        subject= {emailInfo?.subject || ""}
        body= {emailInfo?.body || ""}
      />
    </div>
    </h2>
    </div>
  );
}

export default App;
