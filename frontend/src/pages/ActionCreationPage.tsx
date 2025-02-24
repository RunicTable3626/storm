import { useState } from "react";

const actionCreationPage = () => {
    const [action, setAction] = useState({
         title: "", 
         description: "", 
         graphic: "" 
    });

    const [emailInfo, setEmailInfo] = useState({ 
        name: "", 
        emailAddress: "",
        subject: "",
        body: ""
    });

    const [callInfo, setCallInfo] = useState({ 
        phoneNumber: "", 
        name: "" ,
        callScript: "",
    });

    const [instaInfo, setInstaInfo] = useState({ 
        name: "", 
        postOrPage: "",
        instagramId: "", 
    });

    const [showEmailSubForm, setShowEmailSubForm] = useState(false);
    const [showCallSubForm, setShowCallSubForm] = useState(false);
    const [showInstaSubForm, setShowInstaSubForm] = useState(false);


    const [message, setMessage] = useState("");
  
    // Handle main form change
    const handleMainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setAction({ ...action, [e.target.name]: e.target.value });
    };
  
    // Handle subform change
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setEmailInfo({ ...emailInfo, [e.target.name]: e.target.value });
    };

    const handleCallChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCallInfo({ ...callInfo, [e.target.name]: e.target.value });
      };

    const handleInstaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInstaInfo({ ...instaInfo, [e.target.name]: e.target.value });
      };
  
    // Submit form data
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      const formData = { ...action, ...emailInfo, ...callInfo, ...instaInfo};
  
      try {
        const response = await fetch("api/actions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
  
        const data = await response.json();
        if (response.ok) {
          setMessage("Action created successfully!");
        } else {
          setMessage(data.message || "Error creating Action.");
        }
      } catch (error) {
        setMessage("Error connecting to the server.");
      }
    };
  
    return (
      <div>
        <h2>Create Action</h2>
        <form style={{ display: "flex", flexDirection: "column", gap: "10px" }} onSubmit={handleSubmit}>
          {/* Main Form */}
          <input type="text" name="Title" placeholder="Title" onChange={handleMainChange} required />
          <input type="text" name="Description" placeholder="Description" onChange={handleMainChange} required />
          <input type="text" name="graphic" placeholder="graphic" onChange={handleMainChange} required />
  
          {/* Email subform */}
          <button type="button" onClick={() => setShowEmailSubForm(!showEmailSubForm)}>
          {showEmailSubForm ? "Hide Email Details" : "Add Email Action"}
          </button>
          {showEmailSubForm && (
          <div>
            <input type="text" name="name" placeholder="Name of Recipient" onChange={handleEmailChange} />
            <input type="email" name="emailAdress" placeholder="Email Address" onChange={handleEmailChange} />
            <input type="text" name="subject" placeholder="Subject" onChange={handleEmailChange} />
            <input type="text" name="body" placeholder="Body" onChange={handleEmailChange} />
          </div>
        )}

          <button type="button" onClick={() => setShowCallSubForm(!showCallSubForm)}>
          {showCallSubForm ? "Hide Call Details" : "Add Call Action"}
          </button>
          {showCallSubForm && (
          <div>
            <input type="text" name="name" placeholder="Name" onChange={handleCallChange} />
            <input type="text" name="phoneNumber" placeholder="Phone Number" onChange={handleCallChange} />
            <input type="text" name="callScript" placeholder="Call Script" onChange={handleCallChange} />
          </div>
        )}

          <button type="button" onClick={() => setShowInstaSubForm(!showInstaSubForm)}>
          {showInstaSubForm ? "Hide Instagram Details" : "Add Instagram Action"}
          </button>
          {showInstaSubForm && (
          <div>
            <input type="text" name="name" placeholder="Name" onChange={handleInstaChange} />
            <input type="text" name="postOrPage" placeholder="Post or Page" onChange={handleInstaChange} />
            <input type="text" name="instagramId" placeholder="Instagram Link" onChange={handleInstaChange} />
          </div>
        )}
          {/* Submit Button */}
          <button type="submit">Create Action</button>
        </form>
        <p>{message}</p>
      </div>
    );
  };

export default actionCreationPage;