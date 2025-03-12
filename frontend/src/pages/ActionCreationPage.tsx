import { useState } from "react";
import {generateContent} from "../utils/llm.tsx"

const ActionCreationPage = () => {
    const [mainInfo, setMainInfo] = useState({
         title: "", 
         description: "", 
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


    const handleGenerate = async () => {
      if (!mainInfo.description) {
          alert("Please enter a description before generating content.");
          return;
      }
  
      const generatedData = await generateContent(mainInfo.description);
      console.log(generatedData);

      
      if (generatedData) {
          // Assuming API returns these fields
          setEmailInfo((prev) => ({
              ...prev,
              subject: generatedData.subject || prev.subject,
              body: generatedData.body || prev.body,
          }));
  
          setCallInfo((prev) => ({
              ...prev,
              callScript: generatedData.callScript || prev.callScript,
          }));
      }
  };



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



    const validateObject = <T extends Record<string, any>>(obj: T): T | null => {
        const hasEmptyField = Object.values(obj).some(value => value === null || value === "");
        
        if (hasEmptyField) {
          return null;
        }
        
        return obj;
      };
      

  
    // Submit form data
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateObject(emailInfo) && !validateObject(callInfo) && !validateObject(instaInfo)) {
        setMessage("Please completely fill out at least one type of action");
        return;  // Prevent form submission if all are null
      }

      try {
        const formData: Record<string, any> = { mainInfo };

        // Add each field only if it's valid
        if (validateObject(emailInfo)) formData.emailInfo = emailInfo;
        if (validateObject(callInfo)) formData.callInfo = callInfo;
        if (validateObject(instaInfo)) formData.instaInfo = instaInfo;
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

      //Re-initialize states to null
      setMainInfo({
        title: "", 
        description: "", 
      });

      setEmailInfo({ 
        name: "", 
        emailAddress: "",
        subject: "",
        body: ""
      });

      setCallInfo({ 
          phoneNumber: "", 
          name: "" ,
          callScript: "",
      })

      setInstaInfo({
          name: "", 
          instagramLink: "", 
      })
    };
  
    return (
      <div>
        <h2>Create Action</h2>
        <form style={{ display: "flex", flexDirection: "column", gap: "10px" }} onSubmit={handleSubmit}>
          {/* Main Form */}
          <input type="text" name="title" placeholder="Title" onChange={handleMainChange} required />
          <textarea name="description" placeholder="Description" onChange={handleMainChange} required ></textarea>

          {/*Button to call Groq to autogenerate email subject + body and call info */}
          <button type="button" onClick={handleGenerate}>Generate Content</button>
  
          {/* Email subform */}
          <button type="button" onClick={() => setShowEmailSubForm(!showEmailSubForm)}>
          {showEmailSubForm ? "Hide Email Details" : "Add Email Action"}
          </button>
          {showEmailSubForm && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <input type="text" name="name" placeholder="Name of Recipient" value={emailInfo.name} onChange={handleEmailChange} />
            <input type="email" name="emailAddress" placeholder="Email Address" value={emailInfo.emailAddress} onChange={handleEmailChange} />
            <input type="text" name="subject" placeholder="Subject" value={emailInfo.subject} onChange={handleEmailChange} />
            <textarea name="body" placeholder="Body" value={emailInfo.body} onChange={handleEmailChange}></textarea>
          </div>
        )}

          <button type="button" onClick={() => setShowCallSubForm(!showCallSubForm)}>
          {showCallSubForm ? "Hide Call Details" : "Add Call Action"}
          </button>
          {showCallSubForm && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <input type="text" name="name" placeholder="Name" value={callInfo.name} onChange={handleCallChange} />
            <input type="text" name="phoneNumber" placeholder="Phone Number" value={callInfo.phoneNumber} onChange={handleCallChange} />
            <textarea name="callScript" placeholder="Call Script" value={callInfo.callScript} onChange={handleCallChange}></textarea>
          </div>
        )}

          <button type="button" onClick={() => setShowInstaSubForm(!showInstaSubForm)}>
          {showInstaSubForm ? "Hide Instagram Details" : "Add Instagram Action"}
          </button>
          {showInstaSubForm && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <input type="text" name="name" placeholder="Name" value={instaInfo.name} onChange={handleInstaChange} />
            <input type="text" name="instagramLink" placeholder="Instagram Link" value={instaInfo.instagramLink} onChange={handleInstaChange} />
          </div>
        )}
          {/* Submit Button */}
          <button type="submit">Create Action</button>
        </form>
        <p>{message}</p>
      </div>
    );
  };

export default ActionCreationPage;