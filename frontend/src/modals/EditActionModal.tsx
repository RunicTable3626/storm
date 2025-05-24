import React, {useEffect, useState} from "react";
import Modal from "react-modal";
import isEqual from 'lodash.isequal';
import "./modalStyles.css";
import TextareaAutosize from 'react-textarea-autosize';
import Swal from 'sweetalert2';

interface EditActionModalProps {
    isOpen: boolean;
    action: any;
    closeModal: () => void;
    handleClick: (formData: any) => void;
  }
  
const EditActionModal: React.FC<EditActionModalProps> = ({isOpen, action, closeModal, handleClick}) => {
        const [mainInfo, setMainInfo] = useState({
             title: action.title, 
             description: action.description, 
        });
    
        const [emailInfo, setEmailInfo] = useState(() =>
            action.emailId
              ? {
                  name: action.emailId.name,
                  emailAddress: action.emailId.emailAddress,
                  subject: action.emailId.subject,
                  body: action.emailId.body,
                }
              : null
          );
          
          const [callInfo, setCallInfo] = useState(() =>
            action.callId
              ? {
                  phoneNumber: action.callId.phoneNumber,
                  name: action.callId.name,
                  callScript: action.callId.callScript,
                }
              : null
          );
          
          const [instaInfo, setInstaInfo] = useState(() =>
            action.instaId
              ? {
                  name: action.instaId.name,
                  comment: action.instaId.comment,
                  instagramLink: action.instaId.instagramLink,
                }
              : null
          );

          const [isMainChanged, setIsMainChanged] = useState(false);
          const [isEmailChanged, setIsEmailChanged] = useState(false);
          const [isCallChanged, setIsCallChanged] = useState(false);
          const [isInstaChanged, setIsInstaChanged] = useState(false);
          const [message, setMessage] = useState("");
          const [isConfirmed, setIsConfirmed] = useState(false);


          useEffect(() => {
              setMainInfo({
                  title: action.title, 
                  description: action.description, 
             });
            
                setEmailInfo(() =>
                  action.emailId
                    ? {
                        name: action.emailId.name,
                        emailAddress: action.emailId.emailAddress,
                        subject: action.emailId.subject,
                        body: action.emailId.body,
                      }
                    : null
                );
              
                setCallInfo(() =>
                  action.callId
                    ? {
                        phoneNumber: action.callId.phoneNumber,
                        name: action.callId.name,
                        callScript: action.callId.callScript,
                      }
                    : null
                );
              
  
                setInstaInfo(() =>
                  action.instaId
                    ? {
                        name: action.instaId.name,
                        comment: action.instaId.comment,
                        instagramLink: action.instaId.instagramLink,
                      }
                    : null
                );
              
          }, [action]);

          useEffect(() => {
            if (isOpen) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = 'unset';
            }

            return () => {
                document.body.style.overflow = 'unset';
            };
        }, [isOpen]);

        //used to strip database metadata before comparing
        const stripKeys = (obj: any, keys: string[]) => { 
            const clone = { ...obj };
            keys.forEach((key) => delete clone[key]);
            return clone;
          };
        
          
        const handleMainChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const updatedMainInfo = { ...mainInfo, [e.target.name]: e.target.value };
            setMainInfo(updatedMainInfo);
            const actionMain = {
                title: action.title, 
                description: action.description, 
            }
            if (isEqual(updatedMainInfo, actionMain)) {
                setIsMainChanged(false);
            } else {
                setIsMainChanged(true);
            }
          };
        
          const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            if (!emailInfo) return; // Skip if emailInfo is not initialized
            const updatedEmailInfo = { ...emailInfo, [e.target.name]: e.target.value };
            setEmailInfo(updatedEmailInfo);
            if (isEqual(updatedEmailInfo, stripKeys(action.emailId, ['_id', '__v']))) {
                setIsEmailChanged(false);
            } else {
                setIsEmailChanged(true);
            }
          };
          
          const handleCallChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            if (!callInfo) return;
            const updatedCallInfo = { ...callInfo, [e.target.name]: e.target.value };
            setCallInfo(updatedCallInfo);
            if (isEqual(updatedCallInfo, stripKeys(action.callId, ['_id', '__v']))) {
                setIsCallChanged(false);
            } else {
                setIsCallChanged(true);
            }
          };
          
          const handleInstaChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            if (!instaInfo) return;
            const updatedInstaInfo = { ...instaInfo, [e.target.name]: e.target.value };
            setInstaInfo(updatedInstaInfo);
            if (!isEqual(updatedInstaInfo, stripKeys(action.instaId, ['_id', '__v']))) {
                setIsInstaChanged(true);
            } else {
                setIsInstaChanged(false);
            }
          };


          const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
          
            if (!isMainChanged && !isEmailChanged && !isCallChanged && !isInstaChanged) {
              await Swal.fire({
                title: 'No Changes Made',
                text: 'No changes have been made!',
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
              title: 'Are you sure you want to confirm changes?',
              html: `
                <div class="text-left">
                  ${isMainChanged ? '<div>- Action Title/Description</div>' : ''}
                  ${isEmailChanged ? '<div>- Email</div>' : ''}
                  ${isCallChanged ? '<div>- Call</div>' : ''}
                  ${isInstaChanged ? '<div>- Instagram Comment</div>' : ''}
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
          
            setIsConfirmed(true);
            const formData: Record<string, any> = {};
          
            if (isMainChanged) formData.mainInfo = mainInfo;
            if (isEmailChanged) formData.emailInfo = emailInfo;
            if (isCallChanged) formData.callInfo = callInfo;
            if (isInstaChanged) formData.instaInfo = instaInfo;
          
            handleClick(formData);
            clearAndCloseModal();
          };
          

          const clearAndCloseModal = () => {
            if (isMainChanged && isConfirmed) {
              setMainInfo({
                  title: action.title, 
                  description: action.description, 
             });
            }
       
            if (!(isEmailChanged && isConfirmed)) {
              setEmailInfo(() =>
                action.emailId
                  ? {
                      name: action.emailId.name,
                      emailAddress: action.emailId.emailAddress,
                      subject: action.emailId.subject,
                      body: action.emailId.body,
                    }
                  : null
              );
            }

            
            if (!(isCallChanged && isConfirmed)) {
              setCallInfo(() =>
                action.callId
                  ? {
                      phoneNumber: action.callId.phoneNumber,
                      name: action.callId.name,
                      callScript: action.callId.callScript,
                    }
                  : null
              );
            }

            
            if (!(isInstaChanged && isConfirmed)) {
              setInstaInfo(() =>
                action.instaId
                  ? {
                      name: action.instaId.name,
                      comment: action.instaId.comment,
                      instagramLink: action.instaId.instagramLink,
                    }
                  : null
              );
            }


             setIsMainChanged(false);
             setIsEmailChanged(false);
             setIsCallChanged(false);
             setIsInstaChanged(false);
             setIsConfirmed(false);

            
            closeModal();
          }

        


    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={clearAndCloseModal}
            contentLabel="Edit Action"
            className="modal-content"
            overlayClassName="modal-overlay"
        >
            <button className="close-button" onClick={clearAndCloseModal}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-10">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
            </button>
            <div className="modal-container">
                <div className="dark-style">
            <form style={{ display: "flex", flexDirection: "column", gap: "10px" }} onSubmit={handleSubmit}>
          {/* Main Form */}
          <h3 className = "text-4xl text-center font-semibold">About this action {isMainChanged ? "(Changes Made)" : ""}</h3>
          <div className="font-semibold text-xl">Title</div>
          <input className="w-full border font-semibold border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none" type="text" name="title" placeholder="Title" value={mainInfo.title} onChange={handleMainChange} required />
          <div className="font-semibold text-xl">Description:</div>
          <TextareaAutosize className="w-full border font-semibold border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent" name="description" placeholder="Description" value={mainInfo.description} onChange={handleMainChange} required></TextareaAutosize>
  
          {/* Email subform */}
        {emailInfo && (
          <div className="border p-4 rounded-lg" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <h3 className="text-2xl font-bold">Email Action {isEmailChanged ? "(Changes Made)" : ""}</h3>
            <div className="font-semibold text-xl">Name of Recipient:</div>
            <input className="w-full border font-semibold border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none" type="text" name="name" placeholder="Name of Recipient" value={emailInfo.name} onChange={handleEmailChange} required />
            <div className="font-semibold text-xl">Email Address:</div>
            <input className="w-full border font-semibold border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none" type="email" name="emailAddress" placeholder="Email Address" value={emailInfo.emailAddress} onChange={handleEmailChange} required />
            <div className="font-semibold text-xl">Subject:</div>
            <input className="w-full border font-semibold border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none" type="text" name="subject" placeholder="Subject" value={emailInfo.subject} onChange={handleEmailChange} required />
            <div className="font-semibold text-xl">Body:</div>
            <TextareaAutosize className="w-full border font-semibold border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent" name="body" placeholder="Body" value={emailInfo.body} onChange={handleEmailChange} required></TextareaAutosize>
          </div>
        )}    


        {callInfo && (
          <div className="border p-4 rounded-lg" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <h3 className="text-2xl font-bold">Phone Call Action {isCallChanged ? "(Changes Made)" : ""}</h3>
            <div className="font-semibold text-xl">Name:</div>
            <input className="w-full border font-semibold border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none" type="text" name="name" placeholder="Name" value={callInfo.name} onChange={handleCallChange} required />
            <div className="font-semibold text-xl">Phone Number:</div>
            <input className="w-full border font-semibold border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none" type="text" name="phoneNumber" placeholder="Phone Number" value={callInfo.phoneNumber} onChange={handleCallChange} required />
            <div className="font-semibold text-xl">Call Script:</div>
            <TextareaAutosize className="w-full border font-semibold border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent" name="callScript" placeholder="Call Script" value={callInfo.callScript} onChange={handleCallChange} required></TextareaAutosize>
          </div>            
        )}


        {instaInfo && (
          <div className="border p-4 rounded-lg" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <h3 className="text-2xl font-bold">Instagram Comment Action {isInstaChanged ? "(Changes Made)" : ""}</h3>
            <div className="font-semibold text-xl">Post Name:</div>
            <input className="w-full border font-semibold border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none" type="text" name="name" placeholder="Name" value={instaInfo.name} onChange={handleInstaChange} required />
            <div className="font-semibold text-xl">Comment:</div>
            <TextareaAutosize className="w-full border font-semibold border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent" name="comment" placeholder="Comment" value={instaInfo.comment} onChange={handleInstaChange} required></TextareaAutosize>
            <div className="font-semibold text-xl">Instagram Link:</div>
            <input className="w-full border font-semibold border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none" type="text" name="instagramLink" placeholder="Instagram Link" value={instaInfo.instagramLink} onChange={handleInstaChange} required />
          </div>

        )}


          {/* Submit Button */}
          <div className="flex justify-start gap-3 mt-4">
            <button 
              onClick={clearAndCloseModal}
              className="font-semibold cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded duration-200 ease"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              onClick={(e) => {
                (e.target as HTMLButtonElement).blur()
              }}
              className="font-semibold cursor-pointer bg-[#8D51FF] hover:bg-[#7F22FE] text-white px-4 py-2 rounded duration-200 ease"
            >
              Confirm Edits
            </button>
          </div>

          {message && 
            <p className="text-red-500 text-center mt-2">{message}</p>
          }
        </form>
        </div>
        </div>
        </Modal>    
    );
}

export default EditActionModal;



//title form to edit title
//description form to edit description
//display and edit existing actions
//copy form logic from create action, but prepopulate fields
//all fields are mandatory this time.
//have the same type of alert.

//Mention where changes will be sent, using the state variable, before sending.
//store action id and changed action fields. 