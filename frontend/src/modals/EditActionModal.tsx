import React, {useEffect, useState} from "react";
import Modal from "react-modal";
import isEqual from 'lodash.isequal';
import "./modalStyles.css";
import TextareaAutosize from 'react-textarea-autosize';



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
              setMessage("No changes have been made");
              setTimeout(() => setMessage(""), 2000);
              return;  // Prevent form submission if all are null
            }
      
            const isConfirmed = window.confirm(`Are you sure you want to confirm changes? Action types to be modified:\n
              ${isMainChanged ? "- Action Title/Description\n": ""}  
              ${isEmailChanged ? "- Email\n": ""}
              ${isCallChanged ? "- Call\n": ""}
              ${isInstaChanged ? "- Instagram Comment": ""}`);
      
            if (!isConfirmed) {
              return;
            }
            setIsConfirmed(true);
            const formData: Record<string, any> = {}; 
      
              // Add each field only if it's valid
            if (isMainChanged) formData.mainInfo = mainInfo;
            if (isEmailChanged) formData.emailInfo = emailInfo;
            if (isCallChanged) formData.callInfo = callInfo;
            if (isInstaChanged) formData.instaInfo = instaInfo;
            
            handleClick(formData); //try to get this to return something to the modal for a confirmation message.
            clearAndCloseModal();
      
          };

          const clearAndCloseModal = () => {
            setMessage("");

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
            {/* Close (X) button */}
            <button className="close-button" onClick={clearAndCloseModal}>
                ✖
            </button>
            <div className="dark-style">
            <form style={{ display: "flex", flexDirection: "column", gap: "10px" }} onSubmit={handleSubmit}>
          {/* Main Form */}
          <h3>Action Info: {isMainChanged ? "(Changes Made)" : ""}</h3>
          <div>Title:</div>
          <input type="text" name="title" placeholder="Title" value={mainInfo.title} onChange={handleMainChange} required />
          <div>Description:</div>
          <TextareaAutosize name="description" placeholder="Description" value= {mainInfo.description} onChange={handleMainChange} required></TextareaAutosize>
  
          {/* Email subform */}
        {emailInfo && (
          <div className="border" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <h3>Email Action {isEmailChanged ? "(Changes Made)" : ""}</h3>
            <div>Name of Recipient:</div>
            <input type="text" name="name" placeholder="Name of Recipient" value={emailInfo.name} onChange={handleEmailChange} required />
            <div>Email Address:</div>
            <input type="email" name="emailAddress" placeholder="Email Address" value={emailInfo.emailAddress} onChange={handleEmailChange} required />
            <div>Subject:</div>
            <input type="text" name="subject" placeholder="Subject" value={emailInfo.subject} onChange={handleEmailChange} required />
            <div>Body:</div>
            <TextareaAutosize name="body" placeholder="Body" value={emailInfo.body} onChange={handleEmailChange} required></TextareaAutosize>
          </div>
        )}    


        {callInfo && (
          <div className="border" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <h3>Phone Call Action {isCallChanged ? "(Changes Made)" : ""}</h3>
            <div>Name:</div>
            <input type="text" name="name" placeholder="Name" value={callInfo.name} onChange={handleCallChange} required />
            <div>Phone Number:</div>
            <input type="text" name="phoneNumber" placeholder="Phone Number" value={callInfo.phoneNumber} onChange={handleCallChange} required />
            <div>Call Script:</div>
            <TextareaAutosize name="callScript" placeholder="Call Script" value={callInfo.callScript} onChange={handleCallChange} required></TextareaAutosize>
          </div>            
        )}


        {instaInfo && (
          <div className="border" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <h3>Instagram Comment Action {isInstaChanged ? "(Changes Made)" : ""}</h3>
            <div>Post Name:</div>
            <input type="text" name="name" placeholder="Name" value={instaInfo.name} onChange={handleInstaChange} required />
            <div>Comment:</div>
            <TextareaAutosize name="comment" placeholder="Comment" value={instaInfo.comment} onChange={handleInstaChange} required></TextareaAutosize>
            <div>Instagram Link:</div>
            <input type="text" name="instagramLink" placeholder="Instagram Link" value={instaInfo.instagramLink} onChange={handleInstaChange} required />
          </div>

        )}


          {/* Submit Button */}
          <div className="button-container">
          <button onClick={clearAndCloseModal}>
            Cancel
          </button>
          <button type="submit" onClick={ (e) => {
                    (e.target as HTMLButtonElement).blur()
                  }}>Confirm Edits</button>

        {message && 
          <p>{message}</p>
        }
        </div>
        </form>
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