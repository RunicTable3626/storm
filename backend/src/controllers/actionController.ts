import { Request, Response } from 'express';
import dotenv from "dotenv"
dotenv.config();

const POST_ID = process.env.POST_ID as string;
const EMAIL = process.env.EMAIL as string;
const SUBJECT = process.env.SUBJECT as string;
const BODY = process.env.BODY as string;
const PHONE_NUMBER = process.env.PHONE_NUMBER as string;


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



