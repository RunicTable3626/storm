import { Request, Response } from 'express';
import dotenv from "dotenv"
dotenv.config();
import Action from '../models/actionModel'
import Email from '../models/emailModel'
import Call from '../models/callModel'
import Insta from '../models/instaModel'

const POST_ID = process.env.POST_ID as string;
const EMAIL = process.env.EMAIL as string;
const SUBJECT = process.env.SUBJECT as string;
const BODY = process.env.BODY as string;
const PHONE_NUMBER = process.env.PHONE_NUMBER as string;


export const postAction = async (req: Request, res: Response) => {
  try {
    const { mainInfo, callInfo, emailInfo, instaInfo} = req.body;

    // Create a new action document
    const emailDetails = new Email(emailInfo);
    await emailDetails.save();
    
    const callDetails = new Call(callInfo);
    await callDetails.save();
    
    const instaDetails = new Insta(instaInfo);
    await instaDetails.save();

    const actionDetails = new Action({
      ...mainInfo,    // Spread the mainInfo object (title, description, graphic)
      emailId: emailDetails._id, // Reference to Email collection
      callId: callDetails._id,   // Reference to Call collection
      instaId: instaDetails._id, // Reference to Insta collection
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



