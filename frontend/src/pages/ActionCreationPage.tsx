import { useState } from "react";

const actionCreationPage = () => {
    const [mainInfo, setMainInfo] = useState({
         title: "", 
         description: "", 
         graphic: "" ,
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
        instagramLink: "", 
    });

    const [showEmailSubForm, setShowEmailSubForm] = useState(false);
    const [showCallSubForm, setShowCallSubForm] = useState(false);
    const [showInstaSubForm, setShowInstaSubForm] = useState(false);


    const [message, setMessage] = useState("");
  
    // Handle main form change
    const handleMainChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setMainInfo({ ...mainInfo, [e.target.name]: e.target.value });
    };
  
    // Handle subform change
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setEmailInfo({ ...emailInfo, [e.target.name]: e.target.value });
    };

    const handleCallChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setCallInfo({ ...callInfo, [e.target.name]: e.target.value });
      };

    const handleInstaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInstaInfo({ ...instaInfo, [e.target.name]: e.target.value });
      };
  
    // Submit form data
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      const formData = { mainInfo, emailInfo, callInfo, instaInfo};
  
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
          <input type="text" name="title" placeholder="Title" onChange={handleMainChange} required />
          <textarea name="description" placeholder="Description" onChange={handleMainChange} required ></textarea>
          <input type="text" name="graphic" placeholder="graphic" onChange={handleMainChange} required />
  
          {/* Email subform */}
          <button type="button" onClick={() => setShowEmailSubForm(!showEmailSubForm)}>
          {showEmailSubForm ? "Hide Email Details" : "Add Email Action"}
          </button>
          {showEmailSubForm && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <input type="text" name="name" placeholder="Name of Recipient" onChange={handleEmailChange} />
            <input type="email" name="emailAddress" placeholder="Email Address" onChange={handleEmailChange} />
            <input type="text" name="subject" placeholder="Subject" onChange={handleEmailChange} />
            <textarea name="body" placeholder="Body" onChange={handleEmailChange}></textarea>
          </div>
        )}

          <button type="button" onClick={() => setShowCallSubForm(!showCallSubForm)}>
          {showCallSubForm ? "Hide Call Details" : "Add Call Action"}
          </button>
          {showCallSubForm && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <input type="text" name="name" placeholder="Name" onChange={handleCallChange} />
            <input type="text" name="phoneNumber" placeholder="Phone Number" onChange={handleCallChange} />
            <textarea name="callScript" placeholder="Call Script" onChange={handleCallChange}></textarea>
          </div>
        )}

          <button type="button" onClick={() => setShowInstaSubForm(!showInstaSubForm)}>
          {showInstaSubForm ? "Hide Instagram Details" : "Add Instagram Action"}
          </button>
          {showInstaSubForm && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <input type="text" name="name" placeholder="Name" onChange={handleInstaChange} />
            <input type="text" name="instagramLink" placeholder="Instagram Link" onChange={handleInstaChange} />
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