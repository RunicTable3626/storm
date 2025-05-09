import { useState } from "react";
import {generateContent} from "../utils/llm.ts"
import { useAuth } from "@clerk/clerk-react";
import TextareaAutosize from 'react-textarea-autosize';
const ALLOWED_ORIGIN = import.meta.env.VITE_ALLOWED_ORIGIN; // from .env


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

    const [tone, setTone] = useState("");
    const { getToken } = useAuth();
    const [showGuide, setShowGuide] = useState(false);

    // Inside an async function
    

    const handleGenerate = async () => {

      if (!mainInfo.description) {
          alert("Please enter a description before generating content.");
          return;
      }

      try {
        const token = await getToken();
        if (token) {
          // Proceed only if token is available
          if (!tone) setTone("polite");
          const generatedData = await generateContent(mainInfo.description, tone, token);
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

        } else {
          console.error("No token available");
        }
      } catch (error) {
        console.error("Error generating content:", error);
      }

  };



    const [showEmailSubForm, setShowEmailSubForm] = useState(false);
    const [showCallSubForm, setShowCallSubForm] = useState(false);
    const [showInstaSubForm, setShowInstaSubForm] = useState(false);


    const [message, setMessage] = useState("");
    const [shareId, setShareId] = useState("");
  
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
        ${isValidInsta ? "- Instagram Comment": ""}`);

      if (!isConfirmed) {
        return;
      }

      try {
        const formData: Record<string, any> = { mainInfo };

        // Add each field only if it's valid
        if (isValidEmail) formData.emailInfo = emailInfo;
        if (isValidCall) formData.callInfo = callInfo;
        if (isValidInsta) formData.instaInfo = instaInfo;
        const token = await getToken();
        const response = await fetch(`${API_URL}/api/actions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
          body: JSON.stringify(formData),
        });
  
        const data = await response.json();
        if (response.ok) {
          setMessage("Action created successfully");
          

          const notificationResponse = await fetch(`${API_URL}/api/notifications/create-action`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Reuse the SAME token
            },
            body: JSON.stringify({ title: mainInfo.title })
          });

          if (!notificationResponse.ok) {
            console.error("Failed to send notification");
          } else {
            console.log("Notifications sent!");
          }
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
        <form style={{ display: "flex", flexDirection: "column", gap: "10px" }} onSubmit={handleSubmit}>
          <h2>Create Action</h2>

        {message && shareId && ( 
          <p>{message}</p>
        )}
     
        {message && shareId && (
            <button type="button"
              onClick={(e) => {
                (e.target as HTMLButtonElement).blur();
                navigator.clipboard.writeText(`${ALLOWED_ORIGIN}/action/${shareId}`);
              }}>
              {"Copy Action Link"}
            </button>
        )}

          {/* Main Form */}
          <input type="text" name="title" placeholder="Title" value={mainInfo.title} onChange={handleMainChange} required />
          <TextareaAutosize name="description" placeholder="Description" value={mainInfo.description} onChange={handleMainChange} required ></TextareaAutosize>

          {/*Button to call Groq to autogenerate email subject + body and call info */}
          <textarea name="tone" placeholder="Tone (Defaults to polite)" value={tone} onChange={(e) => setTone(e.target.value)} ></textarea>
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
            <TextareaAutosize name="body" placeholder="Body" value={emailInfo.body} onChange={handleEmailChange}></TextareaAutosize>
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
            <TextareaAutosize name="callScript" placeholder="Call Script" value={callInfo.callScript} onChange={handleCallChange}></TextareaAutosize>
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
            <TextareaAutosize name="comment" placeholder="Comment" value={instaInfo.comment} onChange={handleInstaChange}></TextareaAutosize>
            <input type="text" name="instagramLink" placeholder="Instagram Link" value={instaInfo.instagramLink} onChange={handleInstaChange} />
          </div>
        )}
          {/* Submit Button */}
        <button type="submit">Create Action</button>


        <button type="button" onClick={ (e) => {
                    (e.target as HTMLButtonElement).blur()
                    setShowGuide(!showGuide)
                  }}>
        {showGuide ? "Hide Guide" : "Show Guide"}
        </button>

        {showGuide && (
        <div
        style={{
          maxWidth: "700px",
          width: "100%",
          wordWrap: "break-word",
          padding: "16px",
          borderRadius: "0.375rem", // rounded-md
          fontSize: "1rem", // text-sm
          marginTop: "0.5rem",
        }}
      >
          <h4 className="font-semibold mb-2">How to Submit:</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li>Fill out a relevant title and description for your action. Both these fields are mandatory to create an action.</li>
            <li>If desired, fill out a tone as well.</li>
            <li>If you click the 'Generate Content' button, it will generate content based on the description and the tone</li>
            <li>Feel free to fill out the rest of the content like names, email addresses, links, phone numbers</li>
            <li>Upon clicking 'Create Action', you will receive an alert informing you about what actions will be created</li>
            <li>Only actions with all fields filled out will be in that alert.</li>
            <li>Once confirmed, your action will be created and visible in the Action Dashboard!</li>
          </ul>
          <p><strong>This platform is intended solely for lawful and legitimate purposes. 
            By using this service, you agree not to engage in any illegal, harmful, or unauthorized activities. 
            The platform and its creators are not responsible for any misuse, user-generated content, or consequences 
            resulting from violations of applicable laws or regulations.</strong></p>
        </div>
        )}
        </form>
        
      </div>


    );
  };

export default ActionCreationPage;