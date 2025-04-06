import { useState } from "react";
import {generateContent} from "../utils/llm.tsx"
const API_URL = import.meta.env.VITE_API_URL; // VITE_API_URL from .env

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
        comment: "",
        instagramLink: "", 
    });

    const [tone, setTone] = useState("polite");


    const handleGenerate = async () => {
      if (!mainInfo.description) {
          alert("Please enter a description before generating content.");
          return;
      }
  
      const generatedData = await generateContent(mainInfo.description, tone);

      
      if (generatedData) {
          // Assuming API returns these fields
          setEmailInfo((prev) => ({
              ...prev,
              subject: generatedData.subject || prev.subject,
              body: generatedData.body || prev.body,
          }));

          setShowEmailSubForm(true);
  
          setCallInfo((prev) => ({
              ...prev,
              callScript: generatedData.callScript || prev.callScript,
          }));

          setShowCallSubForm(true);

          setInstaInfo((prev) => ({
            ...prev,
            comment: generatedData.comment || prev.comment,
        }));

          setShowInstaSubForm(true);
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

    const handleInstaChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setInstaInfo({ ...instaInfo, [e.target.name]: e.target.value });
      };



    const validateObject = <T extends Record<string, any>>(obj: T): T | null => {
        const hasEmptyField = Object.values(obj).some(value => value === null || value === "");
        
        if (hasEmptyField) {
          return null;
        }
        
        return obj;
      };

    
    const clearForm = async () => {      //Re-initialize states to null
        setMainInfo({
          title: "", 
          description: "", 
        });

        setTone("polite");

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
            comment: "",
            instagramLink: "", 
        })

        setShowEmailSubForm(false);
        setShowCallSubForm(false);
        setShowInstaSubForm(false);

    }
      

  
    // Submit form data
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      let isValidEmail: boolean = false;
      let isValidCall: boolean = false;
      let isValidInsta:boolean = false;

      if (validateObject(emailInfo)) isValidEmail = true;
      if (validateObject(callInfo)) isValidCall = true;
      if (validateObject(instaInfo)) isValidInsta = true;


      if (!isValidEmail && !isValidCall && !isValidInsta) {
        setMessage("Please completely fill out at least one type of action");
        return;  // Prevent form submission if all are null
      }

      const isConfirmed = window.confirm(`Are you sure you want to submit? Action types to be submitted:\n
        ${isValidEmail ? "- Email\n": ""}
        ${isValidCall ? "- Call\n": ""}
        ${isValidInsta ? "- Instagram": ""}`);

      if (!isConfirmed) {
        return;
      }

      try {
        const formData: Record<string, any> = { mainInfo };
        

        // Add each field only if it's valid
        if (isValidEmail) formData.emailInfo = emailInfo;
        if (isValidCall) formData.callInfo = callInfo;
        if (isValidInsta) formData.instaInfo = instaInfo;
        const response = await fetch(`${API_URL}/api/actions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
  
        const data = await response.json();
        if (response.ok) {
          setMessage("Action created successfully");
          clearForm();
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

          {/*Button to call Groq to autogenerate email subject + body and call info */}
          <textarea name="tone" placeholder="Tone (Defaults to polite)" onChange={(e) => setTone(e.target.value)} ></textarea>
          <button type="button" onClick={ (e) => {
                    (e.target as HTMLButtonElement).blur();
                    handleGenerate();
                  }
          }>Generate Content</button>
  
          {/* Email subform */}
          <button type="button" onClick={ (e) => {
                    (e.target as HTMLButtonElement).blur()
                    setShowEmailSubForm(!showEmailSubForm)
                  }
          }>
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




          <button type="button" onClick={ (e) => {
                    (e.target as HTMLButtonElement).blur()
                    setShowCallSubForm(!showCallSubForm)
                  }
          }>
          {showCallSubForm ? "Hide Call Details" : "Add Call Action"}
          </button>
          {showCallSubForm && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <input type="text" name="name" placeholder="Name" value={callInfo.name} onChange={handleCallChange} />
            <input type="text" name="phoneNumber" placeholder="Phone Number" value={callInfo.phoneNumber} onChange={handleCallChange} />
            <textarea name="callScript" placeholder="Call Script" value={callInfo.callScript} onChange={handleCallChange}></textarea>
          </div>
        )}




          <button type="button" onClick={ (e) => {
                    (e.target as HTMLButtonElement).blur()
                    setShowInstaSubForm(!showInstaSubForm)
                  }
          }>
          {showInstaSubForm ? "Hide Instagram Details" : "Add Instagram Action"}
          </button>
          {showInstaSubForm && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <input type="text" name="name" placeholder="Name" value={instaInfo.name} onChange={handleInstaChange} />
            <textarea name="comment" placeholder="Comment" value={instaInfo.comment} onChange={handleInstaChange}></textarea>
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