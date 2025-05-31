import { useState } from "react";
import {generateContent} from "../utils/llm.tsx"
import { useAuth } from "@clerk/clerk-react";
import TextareaAutosize from 'react-textarea-autosize';
import CreationSidebar from "../components/CreationSidebar";
import Swal from 'sweetalert2';
import PhonecallModal from "../modals/PhonecallModal";
import InstagramModal from "../modals/InstagramModal";
import EmailModal from "../modals/EmailModal";
import SubmissionGuideModal from "../modals/SubmissionGuideModal";
import { useNavigate } from "react-router-dom";
import "react-datetime/css/react-datetime.css";
import Datetime from 'react-datetime';
import moment, { Moment } from "moment";

const ALLOWED_ORIGIN = import.meta.env.VITE_ALLOWED_ORIGIN;



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
    const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

    // Modal states
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
    const [isInstaModalOpen, setIsInstaModalOpen] = useState(false);
    const [shareId, setShareId] = useState("");

    // defaults it to next morning 8 am. 
    const [scheduleDate, setScheduleDate] = useState<Date>(() => {
      const d = new Date();
      d.setDate(d.getDate() + 1);
      d.setHours(8, 0, 0, 0); 
      return d;
    });
    const [submitType, setSubmitType] = useState<"regular"| "schedule">("regular");


    const isValidDate = (current: Moment) => {
      // Disables all dates and times before right now
      return current.isSameOrAfter(moment());
    };
    
    // Create mock actions for the modals
    const emailAction = {
      _id: "preview",
      emailId: {
        name: emailInfo.name,
        emailAddress: emailInfo.emailAddress,
        subject: emailInfo.subject,
        body: emailInfo.body
      }
    };
    
    const phoneAction = {
      _id: "preview",
      callId: {
        name: callInfo.name,
        phoneNumber: callInfo.phoneNumber,
        callScript: callInfo.callScript
      }
    };
    
    const instaAction = {
      _id: "preview",
      instaId: {
        name: instaInfo.name,
        instagramLink: instaInfo.instagramLink,
        comment: instaInfo.comment
      }
    };

    // Modal handlers
    const openEmailModal = () => setIsEmailModalOpen(true);
    const closeEmailModal = () => setIsEmailModalOpen(false);
    
    const openPhoneModal = () => setIsPhoneModalOpen(true);
    const closePhoneModal = () => setIsPhoneModalOpen(false);
    
    const openInstaModal = () => setIsInstaModalOpen(true);
    const closeInstaModal = () => setIsInstaModalOpen(false);

    const openGuideModal = () => setIsGuideModalOpen(true);
    const closeGuideModal = () => setIsGuideModalOpen(false);

    // Inside an async function
    
    const handleGenerate = async () => {

      if (!mainInfo.description) {
        Swal.fire({
          title: 'Missing description',
          text: 'Please enter a description before generating content!',
          icon: 'error',
          confirmButtonText: 'Okay',
          customClass: {
            confirmButton: 'font-semibold cursor-pointer bg-[#8D51FF] hover:bg-[#7F22FE] text-white px-4 py-2 rounded duration-200 ease'
          },
          buttonsStyling: false
        });
        
         
          return;
      }

      try {
        const token = await getToken();
        if (token) {
        
          if (!tone) setTone("polite");
          const generatedData = await generateContent(mainInfo.description, tone, token);
          if (generatedData) {
           
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

    const handleMainChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setMainInfo({ ...mainInfo, [e.target.name]: e.target.value });
    };
  
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
      
    const navigate = useNavigate();

    // Submit form data
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      let isValidEmail: boolean = false;
      let isValidCall: boolean = false;
      let isValidInsta: boolean = false;
    
      if (validateObject(emailInfo)) isValidEmail = true;
      if (validateObject(callInfo)) isValidCall = true;
      if (validateObject(instaInfo)) isValidInsta = true;

      if (!isValidEmail && !isValidCall && !isValidInsta) {
        Swal.fire({
          title: 'Missing completed action',
          text: 'Please completely fill out at least one type of action!',
          icon: 'error',
          confirmButtonText: 'Okay',
          customClass: {
            confirmButton: 'font-semibold cursor-pointer bg-[#8D51FF] hover:bg-[#7F22FE] text-white px-4 py-2 rounded duration-200 ease'
          },
          buttonsStyling: false
        });
        return;
      }
    
      const result = await Swal.fire({
        title: 'Are you sure you want to submit?',
        html: `
          <div class="text-left">
            ${isValidEmail ? '<div>- Email</div>' : ''}
            ${isValidCall ? '<div>- Call</div>' : ''}
            ${isValidInsta ? '<div>- Instagram Comment</div>' : ''}
          </div>
        `,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, submit',
        cancelButtonText: 'Cancel',
        customClass: {
          confirmButton: 'font-semibold cursor-pointer bg-[#8D51FF] hover:bg-[#7F22FE] text-white px-4 py-2 rounded duration-200 ease',
          cancelButton: 'ml-3 font-semibold cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded duration-200 ease'
        },
        buttonsStyling: false
      });
    
      if (!result.isConfirmed) {
        return;
      }
    
     
        const formData: Record<string, any> = { mainInfo };
    
        if (isValidEmail) formData.emailInfo = emailInfo;
        if (isValidCall) formData.callInfo = callInfo;
        if (isValidInsta) formData.instaInfo = instaInfo;

        if (submitType === "schedule") {
          if (!scheduleDate) {
            alert("Please pick a future date and time.");
            return;
          }
          formData.startDate = scheduleDate.toISOString();
        }
        
        try {
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
          setShareId(data.shareId);
          await Swal.fire({
            title: 'Success!',
            text: 'Action created successfully',
            icon: 'success',
            confirmButtonText: 'Go to Dashboard',
            customClass: {
              confirmButton: 'font-semibold cursor-pointer bg-[#8D51FF] hover:bg-[#7F22FE] text-white px-4 py-2 rounded duration-200 ease'
            },
            buttonsStyling: false
          });
          navigate('/admin-dashboard');

        } else {
          Swal.fire({
            title: 'Error',
            text: data.message || "Error creating Action.",
            icon: 'error',
            confirmButtonText: 'Okay',
            customClass: {
              confirmButton: 'font-semibold cursor-pointer bg-[#8D51FF] hover:bg-[#7F22FE] text-white px-4 py-2 rounded duration-200 ease'
            },
            buttonsStyling: false
          });
        }
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: "Error connecting to the server.",
          icon: 'error',
          confirmButtonText: 'Okay',
          customClass: {
            confirmButton: 'font-semibold cursor-pointer bg-[#8D51FF] hover:bg-[#7F22FE] text-white px-4 py-2 rounded duration-200 ease'
          },
          buttonsStyling: false
        });
      }
    };
    
    {shareId && (
      <button type="button"
        onClick={(e) => {
          (e.target as HTMLButtonElement).blur();
          navigator.clipboard.writeText(`${ALLOWED_ORIGIN}/action/${shareId}`);
        }}>
        {"Copy Action Link"}
      </button>
  )}

    return (

      
      <div className="h-screen overflow-y-auto">
        {/* Email Modal */}
        <EmailModal
          isOpen={isEmailModalOpen}
          closeModal={closeEmailModal}
          action={emailAction}
          isAdminView={false}
        />
        
        {/* Phone Modal */}
        <PhonecallModal
          isOpen={isPhoneModalOpen}
          closeModal={closePhoneModal}
          action={phoneAction}
          isAdminView={false}
        />
        
        {/* Instagram Modal */}
        <InstagramModal
          isOpen={isInstaModalOpen}
          closeModal={closeInstaModal}
          action={instaAction}
          isAdminView={false}
        />
        
        {/* Guide Modal */}
        <SubmissionGuideModal
          isOpen={isGuideModalOpen}
          closeModal={closeGuideModal}
        />
        
        <div className="flex flex-col md:flex-row relative">
          <div className="w-full relative py-20 md:w-1/2 p-4 bg-black min-h-screen text-white">
            <CreationSidebar openGuideModal={openGuideModal} />
            {/* Add floating preview button for sm screens */}
            <button 
              onClick={() => {
                const previewSection = document.getElementById('action-preview');
                previewSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="fixed bottom-4 right-4 z-50 bg-violet-600 text-white p-4 rounded-full shadow-xl cursor-pointer hover:bg-violet-700 duration-200 ease font-semibold text-xl md:hidden flex items-center gap-2"
            >
              <span>Preview</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
            </button>
            <h2 className="text-3xl md:text-4xl text-violet-500 font-bold mb-4 text-center">CREATE ACTION <span className="text-white">DETAILS</span></h2>
            <form style={{ display: "flex", flexDirection: "column", gap: "10px" }} onSubmit={handleSubmit}>
              {/* Main Form */}
              <div className = "font-semibold text-xl text-white">Title of action</div>
              <input 
                type="text" 
                name="title" 
                placeholder="Action title" 
                value={mainInfo.title} 
                onChange={handleMainChange} 
                className="w-full border font-semibold border-gray-300 text-black rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none" 
                required 
              />
              <div className = "font-semibold text-xl text-white">Description of action</div>
              <TextareaAutosize 
                name="description" 
                placeholder="Action description" 
                value={mainInfo.description} 
                onChange={handleMainChange} 
                className="w-full border font-semibold border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                required 
              ></TextareaAutosize>

              <div className = "font-semibold text-xl text-white">Tone of action</div>
              {/*Button to call Groq to autogenerate email subject + body and call info */}
              <textarea name="tone" className="w-full font-semibold border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none" placeholder="Tone (Defaults to polite)" value={tone} onChange={(e) => setTone(e.target.value)} ></textarea>
              <button type="button" className = "float-left bg-violet-500 inline-block text-white p-4 rounded-lg shadow-lg cursor-pointer hover:bg-violet-600 duration-200 ease font-semibold text-xl text-center" onClick={ (e) => {
                        (e.target as HTMLButtonElement).blur();
                        handleGenerate();
                      }
              }>Generate content for all <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" className="inline-block size-6">
              <path strokeLinecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            </button>
      
              {/* Email subform */}
              <button type="button" className = {`p-4 shadow-lg cursor-pointer bg-gray-200 text-black hover:bg-gray-300 duration-200 ease font-semibold text-xl text-center ${showEmailSubForm ? 'rounded-t-lg rounded-b-none' : 'rounded-lg'}`} onClick={ (e) => {
                        (e.target as HTMLButtonElement).blur()
                        setShowEmailSubForm(!showEmailSubForm)
                      }
              }>
              {showEmailSubForm ? "Remove email action" : "Add email action"} {showEmailSubForm ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" className="inline-block size-6">
                  <path strokeLinecap="round" stroke-linejoin="round" d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" className="inline-block size-6">
                  <path strokeLinecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              )}
              </button>
              {showEmailSubForm && (
              <div className = "bg-gray-100 relative p-4 -top-3 text-black rounded-b-lg" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div className="font-semibold text-xl">Name of recipient</div>
                <input 
                  type="text" 
                  name="name" 
                  placeholder="Name of Recipient" 
                  value={emailInfo.name} 
                  onChange={handleEmailChange}
                  className="w-full border font-semibold border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
                />
                <div className="font-semibold text-xl">Email address</div>
                <input 
                  type="email" 
                  name="emailAddress" 
                  placeholder="Email Address" 
                  value={emailInfo.emailAddress} 
                  onChange={handleEmailChange}
                  className="w-full border font-semibold border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
                />
                <div className="font-semibold text-xl">Subject line</div>
                <input 
                  type="text" 
                  name="subject" 
                  placeholder="Subject" 
                  value={emailInfo.subject} 
                  onChange={handleEmailChange}
                  className="w-full border font-semibold border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
                />
                <div className="font-semibold text-xl">Email body</div>
                <TextareaAutosize 
                  name="body" 
                  placeholder="Body" 
                  value={emailInfo.body} 
                  onChange={handleEmailChange}
                  className="w-full border font-semibold border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                ></TextareaAutosize>
              </div>
            )}




              <button type="button" className = {`p-4 shadow-lg cursor-pointer bg-gray-200 text-black hover:bg-gray-300 duration-200 ease font-semibold text-xl text-center ${showCallSubForm ? 'rounded-t-lg rounded-b-none' : 'rounded-lg'}`} onClick={ (e) => {
                        (e.target as HTMLButtonElement).blur()
                        setShowCallSubForm(!showCallSubForm)
                      }
              }>
              {showCallSubForm ? "Remove phone action" : "Add phone action"} {showCallSubForm ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" className="inline-block size-6">
                  <path strokeLinecap="round" stroke-linejoin="round" d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" className="inline-block size-6">
                  <path strokeLinecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              )}
              </button>
              {showCallSubForm && (
              <div className = "bg-gray-100 relative p-4 -top-3 text-black rounded-b-lg" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div className="font-semibold text-xl">Name of recipient</div>
                <input 
                  type="text" 
                  name="name" 
                  placeholder="Name" 
                  value={callInfo.name} 
                  onChange={handleCallChange}
                  className="w-full border font-semibold border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
                />
                <div className="font-semibold text-xl">Phone number</div>
                <input 
                  type="text" 
                  name="phoneNumber" 
                  placeholder="Phone Number" 
                  value={callInfo.phoneNumber} 
                  onChange={handleCallChange}
                  className="w-full border font-semibold border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
                />
                <div className="font-semibold text-xl">Call script</div>
                <TextareaAutosize 
                  name="callScript" 
                  placeholder="Call Script" 
                  value={callInfo.callScript} 
                  onChange={handleCallChange}
                  className="w-full border font-semibold border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                ></TextareaAutosize>
              </div>
            )}


              <button type="button" className = {`p-4 shadow-lg cursor-pointer bg-gray-200 text-black hover:bg-gray-300 duration-200 ease font-semibold text-xl text-center ${showInstaSubForm ? 'rounded-t-lg rounded-b-none' : 'rounded-lg'}`} onClick={ (e) => {
                        (e.target as HTMLButtonElement).blur()
                        setShowInstaSubForm(!showInstaSubForm)
                      }
              }>
              {showInstaSubForm ? "Remove Instagram action" : "Add Instagram action"} {showInstaSubForm ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" className="inline-block size-6">
                  <path strokeLinecap="round" stroke-linejoin="round" d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" className="inline-block size-6">
                  <path strokeLinecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              )}
              </button>
              {showInstaSubForm && (
              <div className = "bg-gray-100 relative p-4 -top-3 text-black rounded-b-lg" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div className="font-semibold text-xl">Name of recipient</div>
                <input 
                  type="text" 
                  name="name" 
                  placeholder="Name" 
                  value={instaInfo.name} 
                  onChange={handleInstaChange}
                  className="w-full border font-semibold border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
                />
                <div className="font-semibold text-xl">Comment</div>
                <TextareaAutosize 
                  name="comment" 
                  placeholder="Comment" 
                  value={instaInfo.comment} 
                  onChange={handleInstaChange}
                  className="w-full border font-semibold border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                ></TextareaAutosize>
                <div className="font-semibold text-xl">Instagram link</div>
                <input 
                  type="text" 
                  name="instagramLink" 
                  placeholder="Instagram Link" 
                  value={instaInfo.instagramLink} 
                  onChange={handleInstaChange}
                  className="w-full border font-semibold border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
                />
              </div>
            )}

              <div className={`p-4 shadow-lg cursor-default bg-gray-200 text-black font-semibold text-xl text-center rounded-t-lg rounded-b-none`}>
            
              Publication Options
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" className="relative -top-0.5 ml-2 inline-block size-6">
                <path strokeLinecap="round" stroke-linejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
              </svg>
              </div>
              <div className="bg-gray-100 relative p-4 -top-3 text-black rounded-b-lg" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <input 
                      type="radio" 
                      id="publishNow" 
                      name="publishOption" 
                      value="now" 
                      className="accent-violet-500 h-4 w-4 cursor-pointer"
                      checked={submitType === "regular"}
                      onChange={() => {
                        setSubmitType("regular");
                      }} 
                    />
                    <label htmlFor="publishNow" className="font-semibold cursor-pointer text-xl">Publish now</label>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input 
                      type="radio" 
                      id="scheduleSend" 
                      name="publishOption" 
                      className="accent-violet-500 h-4 w-4 cursor-pointer"
                      value="schedule" 
                      checked={submitType === "schedule"}
                      onChange={() => {
                        setSubmitType("schedule");
                      }} 
                    />
                    <label htmlFor="scheduleSend" className="font-semibold cursor-pointer text-xl">Schedule send</label>
                  </div>
                  
                  {submitType === "schedule" && (
                    <div className="mt-2 pl-6">
                      <div className="font-semibold text-lg mb-2">Select date and time:</div>
                      <Datetime
                        value={scheduleDate}
                        onChange={(date) => {
                          if (typeof date !== "string") setScheduleDate(date.toDate());
                        }}
                        isValidDate={isValidDate}
                        inputProps={{ 
                          placeholder: "Pick a future date/time",
                          className: "w-full border font-semibold border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
            <button 
              className="float-left bg-green-400 inline-block p-4 rounded-lg shadow-lg text-black cursor-pointer hover:bg-green-500 duration-200 ease font-semibold text-xl text-center" 
              type="submit"
            >
              {submitType === "regular" ? "Finalize and publish action" : "Finalize and schedule action"} 
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" className="inline-block ml-1 size-6">
                <path strokeLinecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
              </svg>
            </button>
            
            </form>
          </div>
          
          <div className="w-full relative py-20 md:w-1/2 md:fixed md:right-0 md:top-0 md:bottom-0 md:h-screen p-4 flex flex-col items-center pointer-events-none">
            <div id="action-preview" className="w-full px-10 pointer-events-auto">
              <h2 className="text-3xl font-bold mb-4 text-center">ACTION PREVIEW</h2>
              <div
                className="rounded-xl w-full mb-4 shadow-md"
                style={{ border: '2px solid rgb(204, 204, 204)', padding: '20px', textAlign: 'left', width: '100%', overflowWrap: 'break-word' }}
              >
                <h3 className="text-3xl font-bold mb-2">{mainInfo.title || 'Untitled Action'}</h3>
                <p className="text-lg italic">{mainInfo.description || 'No description provided'}</p>

                <div className="flex mt-4 flex-col md:flex-row md:flex-wrap gap-2">
                  {((showEmailSubForm && emailInfo.name && emailInfo.emailAddress && emailInfo.subject && emailInfo.body) ||
                    (showCallSubForm && callInfo.name && callInfo.phoneNumber && callInfo.callScript) ||
                    (showInstaSubForm && instaInfo.name && instaInfo.comment && instaInfo.instagramLink)) ? (
                    <>
                      {/* Email Button */}
                      {showEmailSubForm && emailInfo.name && emailInfo.emailAddress && emailInfo.subject && emailInfo.body && (
                        <div className="w-full md:w-auto">
                          <button 
                            onClick={openEmailModal}
                            className="bg-gray-200 hover:bg-gray-300 cursor-pointer text-gray-800 text-center font-bold py-4 px-4 rounded-lg transition duration-300 w-full md:w-auto">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 mx-auto">
                              <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
                              <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
                            </svg>
                            <div className="mt-2">Send an Email</div>
                          </button>
                        </div>
                      )}
                      
                      {/* Phone Button */}
                      {showCallSubForm && callInfo.name && callInfo.phoneNumber && callInfo.callScript && (
                        <div className="w-full md:w-auto">
                          <button 
                            onClick={openPhoneModal}
                            className="bg-gray-200 hover:bg-gray-300 cursor-pointer text-gray-800 text-center font-bold py-4 px-4 rounded-lg transition duration-300 w-full md:w-auto">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 mx-auto">
                              <path fill-rule="evenodd" d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z" clip-rule="evenodd" />
                            </svg>
                            <div className="mt-2">Make a Phone Call</div>
                          </button>
                        </div>
                      )}
                      
                      {/* Instagram Button */}
                      {showInstaSubForm && instaInfo.name && instaInfo.comment && instaInfo.instagramLink && (
                        <div className="w-full md:w-auto">
                          <button 
                            onClick={openInstaModal}
                            className="bg-gray-200 hover:bg-gray-300 cursor-pointer text-gray-800 text-center font-bold py-4 px-4 rounded-lg transition duration-300 w-full md:w-auto">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 mx-auto">
                              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                            </svg>
                            <div className="mt-2">Comment on Instagram</div>
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full text-left text-gray-500 italic">When you fill out completed actions, they will appear here.</div>
                  )}
                </div>

                <p className="mt-4">Created At: {new Date().toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric',
                  year: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true 
                })}</p>
              </div>
            </div>

            <div className="absolute md:block hidden bg-gray-200 text-gray-800 py-3 px-5 rounded-lg shadow-lg font-semibold text-xl bottom-8 left-1/2 transform -translate-x-1/2 pointer-events-auto text-center">
              Completed adding actions
              {((showEmailSubForm && emailInfo.name && emailInfo.emailAddress && emailInfo.subject && emailInfo.body) ||
                (showCallSubForm && callInfo.name && callInfo.phoneNumber && callInfo.callScript) ||
                (showInstaSubForm && instaInfo.name && instaInfo.comment && instaInfo.instagramLink)) ? (
                <div className="flex gap-2 justify-center mt-2">
                  {showEmailSubForm && emailInfo.name && emailInfo.emailAddress && emailInfo.subject && emailInfo.body && (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                      <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
                      <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
                    </svg>
                  )}
                  {showCallSubForm && callInfo.name && callInfo.phoneNumber && callInfo.callScript && (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                      <path fill-rule="evenodd" d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z" clip-rule="evenodd" />
                    </svg>
                  )}
                  {showInstaSubForm && instaInfo.name && instaInfo.comment && instaInfo.instagramLink && (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="size-6">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  )}
                </div>
              ) : (
                <div className="text-red-500">None</div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
};

export default ActionCreationPage;