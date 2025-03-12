import { Request, Response } from 'express';
import dotenv from "dotenv"
dotenv.config();
import Action from '../models/actionModel'
import Email from '../models/emailModel'
import Call from '../models/callModel'
import Insta from '../models/instaModel'
import Groq from "groq-sdk";

const POST_ID = process.env.POST_ID as string;
const EMAIL = process.env.EMAIL as string;
const SUBJECT = process.env.SUBJECT as string;
const BODY = process.env.BODY as string;
const PHONE_NUMBER = process.env.PHONE_NUMBER as string;


export const generateContent = async (req: Request, res: Response) => {
  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const query: string = req.body.query as string;
    const queryContent = `Generate both an email and a voicemail message based on the following description:
                          ${query}
                          Email:
                          Subject: Provide a clear and relevant subject line.
                          Use a professional but angry tone.
                          Keep the message concise but informative.
                          End with an appropriate closing as a concerned citizen.
                          Voicemail:
                          Use a natural, conversational, but upset tone.
                          Keep it brief (under 30 seconds).
                          End with a polite sign-off.
    `;
    
    //look this up on ChatGPT to know what this exactly means.
    let match;
    const regex = /Subject:\s*(.*)\n([\s\S]*?)\n\nVoicemail:\s*"(.*)"/;
    while (!match) {
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: queryContent,
          },
        ],
        model: "llama-3.3-70b-versatile",
      });
  
      const generatedText = chatCompletion.choices[0]?.message?.content || "";
      console.log(generatedText);
      match = generatedText.match(regex);
    }
    
    //this handles 2 llm output formats.

    
  
    // Extract the subject using the regex pattern
    if (match) {
      const subject = match[1].trim();
      const body = match[2].trim();
      const callScript = match[3].trim();
      res.status(200).json({subject, body, callScript});
    } else {
      res.status(500).json({ error: "Failed to extract subject, body, and voicemail. Ensure the input format is correct."});
    }
    
  } catch (error: unknown) {
    // Type assertion to make sure `error` is an `Error` object
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred." });
    }
  }
}



export const postAction = async (req: Request, res: Response) => {
  try {
    const formData = req.body;

    let emailId = null, callId = null, instaId = null;

    // Create a new action document
    if (formData.emailInfo) {
      const emailDetails = new Email(formData.emailInfo);
      await emailDetails.save();
      emailId = emailDetails._id;  // Store _id if the emailInfo is valid
    }
    
    if (formData.callInfo) {
      const callDetails = new Call(formData.callInfo);
      await callDetails.save();
      callId = callDetails._id;  // Store _id if the callInfo is valid
    }
    
    if (formData.instaInfo) {
      const instaDetails = new Insta(formData.instaInfo);
      await instaDetails.save();
      instaId = instaDetails._id;  // Store _id if the instaInfo is valid
    }
    
    // Create the action document, using the saved IDs or null if not valid
    const actionDetails = new Action({
      ...formData.mainInfo,  // Spread the mainInfo object (title, description)
      emailId,      // Reference to Email collection, will be null if emailDetails is not created
      callId,       // Reference to Call collection, will be null if callDetails is not created
      instaId,      // Reference to Insta collection, will be null if instaDetails is not created
    });

    await actionDetails.save()
    console.log("Saved Action ID:", actionDetails._id);

    res.status(201).json({ message: "Action created successfully!", actionDetails });
  } catch (error: unknown) {
    // Type assertion to make sure `error` is an `Error` object
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred." });
    }
  }
};


export const getAllActions = async (req: Request, res: Response): Promise<void> => {
  try {
    const actions = await Action.find()
      .populate("emailId") // Populate related email info
      .populate("callId")  // Populate related call info
      .populate("instaId"); // Populate related Instagram info
    res.status(200).json(actions);

  } catch (error) {
    res.status(500).json({ error: "Error fetching actions" });
  }
};

export const updateCount = async (req: Request, res: Response): Promise<void> => {
  try {
    const {actionType, actionId} = req.body; 

    const updatedAction = await Action.findByIdAndUpdate(
      actionId,
      { $inc: { [actionType]: 1 } },  // Increment the field by 1
      { new: true }
    );

    if (!updatedAction) {
      res.status(404).json({ error: "Action not found" });
    }

    res.json(updatedAction);
  } catch (error: unknown) {
    // Type assertion to make sure `error` is an `Error` object
    if (error instanceof Error) {
      console.log(error)
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred while updating action count." });
    }
  }
} 



export const getEmailInfo = async (req: Request, res: Response): Promise<void> => {
    try {
      const emailInfo = {
          email: EMAIL,
          subject: SUBJECT,
          body: BODY   
        };
      res.json(emailInfo);
    } catch (error) {
      res.status(400).json({ message: 'Error fetching email info from controllers/getEmailInfo', error });
    }
  };

export const getCallInfo = async (req: Request, res: Response): Promise<void> => {
    try {
      const callInfo = {
        phoneNumber: PHONE_NUMBER,
        callScript: BODY 
        };
      res.json(callInfo);
    } catch (error) {
      res.status(400).json({ message: 'Error fetching call info from controllers/getCallInfo', error });
    }
  };


export const getInstagramPostID = async (req: Request, res: Response): Promise<void> => {
    try {
      const postId = POST_ID
      res.json(postId);
    } catch (error) {
      res.status(400).json({ message: 'Error fetching instagram post id from controllers/getInstagramPostID', error });
    }
  };



