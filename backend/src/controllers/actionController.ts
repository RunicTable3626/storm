import { Request, Response } from 'express';
import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config();
import Action from '../models/actionModel';  
import Email  from '../models/emailModel';      
import Call from '../models/callModel';         
import Insta from '../models/instaModel'; 
import Groq from "groq-sdk";
import dayjs from "dayjs"; // Using dayjs for date manipulation
import { getAuth, clerkClient } from '@clerk/express';
import { nanoid } from 'nanoid';
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

const POST_ID = process.env.POST_ID as string;
const EMAIL = process.env.EMAIL as string;
const SUBJECT = process.env.SUBJECT as string;
const BODY = process.env.BODY as string;
const PHONE_NUMBER = process.env.PHONE_NUMBER as string;
const MODEL_NAME = "llama-3.1-8b-instant";


export const generateContent = async (req: Request, res: Response) => {
  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const query: string = req.body.query;
    const tone: string = req.body.tone;

    const MAX_RETRIES = 3;

    const promptTemplates = {
      email: `You are a helpful assistant.\n\nGenerate an email with a "${tone}" tone based on the following description:\n\n${query}\n\nReturn only the subject line and body in this format:\n\nSubject: <subject line here>\nBody: <email body here>`,
      voicemail: `You are a helpful assistant.\n\nGenerate a voicemail script with a "${tone}" tone based on the following description:\n\n${query}\n\nReturn only the voicemail message.`,
      comment: `You are a helpful assistant.\n\nGenerate a social media comment with a "${tone}" tone based on the following description:\n\n${query}\n\nReturn only the comment.`,
    };

    const fetchGroqOutput = async (prompt: string): Promise<string> => {
      let attempts = 0;
      while (attempts < MAX_RETRIES) {
        const chatCompletion = await groq.chat.completions.create({
          messages: [{ role: "user", content: prompt }],
          model: MODEL_NAME,
        });

        const content = chatCompletion.choices[0]?.message?.content?.trim();
        if (content) return content;
        console.log(attempts);
        attempts++;
      }
      throw new Error("Failed to get valid Groq response");
    };

    const [emailOutput, voicemailOutput, commentOutput] = await Promise.all([
      fetchGroqOutput(promptTemplates.email),
      fetchGroqOutput(promptTemplates.voicemail),
      fetchGroqOutput(promptTemplates.comment),
    ]);

    const subjectMatch = emailOutput.match(/Subject:\s*(.*)/);
    const bodyMatch = emailOutput.match(/Body:\s*([\s\S]*)/);

    const subject = subjectMatch?.[1]?.trim() || "";
    const body = bodyMatch?.[1]?.trim() || "";
    const callScript = normalizeQuotes(voicemailOutput.trim());
    const comment = normalizeQuotes(commentOutput.trim());

    if (!subject || !body || !callScript || !comment) {
      res.status(500).json({ error: "Failed to parse one or more Groq responses." });
    } else {
      res.status(200).json({ subject, body, callScript, comment });
    }

  } catch (error) {
    res.status(500).json({ error: "Unexpected server error." });
  }
};


function normalizeQuotes(str: string) { //helper for rephraseContent
  const first = str[0];
  const last = str[str.length - 1];

  if (
    (first === '"' && last === '"') ||
    (first === "'" && last === "'")
  ) {
    return str.slice(1, -1);
  }

  return str;
}


export const rephraseContent = async (req: Request, res: Response) => {
  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const content: string = req.body.content as string;
    const contentType: string = req.body.contentType as string;
    const rephrasePrompt = `Rephrase the following ${contentType} using completely different wording and sentence structure.
                            Keep the original tone and the exact same word count.
                            
                            If the content is a social media comment, make the language sound more natural, conversational, and human—avoid sounding stiff or robotic.
                            
                            Respond with only the rephrased text. Do not include any labels, explanations, or extra formatting.
                            
                            ${content}
    `;
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: rephrasePrompt,
          },
        ],
        model: MODEL_NAME,
      });

      const rephrasedResult = chatCompletion.choices[0]?.message?.content || "";
      res.status(200).json({ rephrasedResult: normalizeQuotes(rephrasedResult) });
    
  } catch (error: unknown) {
    // Type assertion to make sure `error` is an `Error` object
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred." });
    }
  }
}

export const rephraseContentInternal = async (content: String, contentType: String) => {
  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const rephrasePrompt = `Rephrase the following ${contentType} using completely different wording and sentence structure.
                            Keep the original tone and the exact same word count.
                            
                            If the content is a social media comment, make the language sound more natural, conversational, and human—avoid sounding stiff or robotic.
                            
                            Respond with only the rephrased text. Do not include any labels, explanations, or extra formatting.
                            
                            ${content}
    `;
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: rephrasePrompt,
          },
        ],
        model: MODEL_NAME,
      });
  
      const rephrasedResult = normalizeQuotes(chatCompletion.choices[0]?.message?.content || "");
      return rephrasedResult;

  } catch (error: unknown) {
    // Type assertion to make sure `error` is an `Error` object
    if (error instanceof Error) {
      throw new Error(error.message); // Let the caller (API route) handle the response
    } else {
      throw new Error("An unknown error occurred.");
    }
  }
}

export const postAction = async (req: Request, res: Response) => {
  const { userId } = getAuth(req);

  if (!userId) {
    res.status(401).json({ message: 'Unauthorized' });
  } else {

    const session = await mongoose.startSession();
    session.startTransaction();
  
    try {
      const user = await clerkClient.users.getUser(userId);
      const createdBy = user.emailAddresses[0]?.emailAddress;
      const formData = req.body;
  
      const startDate = formData.startDate ? new Date(formData.startDate) : null;
  
      let emailId = null, callId = null, instaId = null;
  
      if (formData.emailInfo) {
        const emailDetails = new Email(formData.emailInfo);
        await emailDetails.save({ session });
        emailId = emailDetails._id;
      }
  
      if (formData.callInfo) {
        const callDetails = new Call(formData.callInfo);
        await callDetails.save({ session });
        callId = callDetails._id;
      }
  
      if (formData.instaInfo) {
        const instaDetails = new Insta(formData.instaInfo);
        await instaDetails.save({ session });
        instaId = instaDetails._id;
      }
  
      const shareId = nanoid(10);
  
      const actionDetails = new Action({
        ...formData.mainInfo,
        emailId,
        callId,
        instaId,
        createdBy,
        startDate,
        shareId,
      });
  
      await actionDetails.save({ session });
  
      await session.commitTransaction();
      session.endSession();
  
      console.log("Saved Action ID:", actionDetails.shareId);
      res.status(201).json({ shareId: actionDetails.shareId });
    } catch (error: unknown) {
      await session.abortTransaction();
      session.endSession();
  
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: "An unknown error occurred." });
      }
    }
  }
};



export const getAllActions = async (req: Request, res: Response): Promise<void> => {
  const { userId } = getAuth(req);
  if (!userId) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [rawActions, total] = await Promise.all([
      Action.aggregate([
        { $addFields: { effectiveDate: { $ifNull: ["$startDate", "$createdAt"] } } },
        { $sort: { effectiveDate: -1 } },
        { $skip: skip },
        { $limit: limit }
      ]),
      Action.countDocuments()
    ]);
    
    const actions = await Action.populate(rawActions, [
      { path: "emailId" },
      { path: "callId" },
      { path: "instaId" }
    ]);

    res.status(200).json({
      actions,
      total,
      page,
      pages: Math.ceil(total / limit),
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error fetching actions" });
  }
};

export const getActionsFromLastNDays = async (req: Request, res: Response): Promise<void> => {
  try {
    const daysAgo = parseInt(req.query.daysAgo as string) || 7;
    const start = dayjs.utc().subtract(daysAgo, "day").toDate();
    const end = dayjs.utc().toDate();  // exact current time in UTC

    // Construct the query
    const dateQuery = {
      $gte: start,
      $lt: end,
    };

    // Find actions where either startDate or createdAt is within range
    const actions = await Action.find({
      $or: [
        { startDate: dateQuery },
        { startDate: null, createdAt: dateQuery }
      ],
    })
      .populate("emailId")
      .populate("callId")
      .populate("instaId");

    res.status(200).json(actions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching actions" });
  }
};


export const getAllCreatedActions = async (req: Request, res: Response): Promise<void> => {
  const { userId } = getAuth(req);
  if (!userId) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  try {
    const user = await clerkClient.users.getUser(userId);
    const createdBy = user.emailAddresses[0]?.emailAddress;

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [rawActions, total] = await Promise.all([
      Action.aggregate([
        { $match: { createdBy } },
        { $addFields: { effectiveDate: { $ifNull: ["$startDate", "$createdAt"] } } },
        { $sort: { effectiveDate: -1 } },
        { $skip: skip },
        { $limit: limit }
      ]),
      Action.countDocuments({ createdBy })
    ]);
    
    const actions = await Action.populate(rawActions, [
      { path: "emailId" },
      { path: "callId" },
      { path: "instaId" }
    ]);

    res.status(200).json({
      actions,
      total,
      page,
      pages: Math.ceil(total / limit),
    });

  } catch (error) {
    console.log(error);
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

    res.status(200).json({ message: `${actionType} count incremented by 1!` });
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


export const deleteAction = async (req: Request, res: Response): Promise<void> => {
  //Deletes not just the action but all related types of actions in their respective collections.
  //modify this with similar logic as post action.
  const { actionId } = req.params;
  const { userId } = getAuth(req);
  const session = await mongoose.startSession();
  session.startTransaction();

  if (!userId) {
    res.status(401).json({ message: 'Unauthorized' });
  } else {
      try {
        // Find the Action document to get related IDs
        const user = await clerkClient.users.getUser(userId);
        const createdBy = user.emailAddresses[0]?.emailAddress;
        const action = await Action.findById(actionId).session(session);
        if (!action) {
          throw new Error("Action not found");
        }

        const isCreator = String(action.createdBy) === String(createdBy);
        const isSuperadmin = user.publicMetadata?.role === "superadmin";
        
        if (!isCreator && !isSuperadmin) {
          throw new Error("Must be Superadmin or Action Creator to edit this action");
        }

        // Delete related entries in Call, Email, and Insta collections (only one per action)
        await Promise.all([
          action.callId && Call.findByIdAndDelete(action.callId).session(session),
          action.emailId && Email.findByIdAndDelete(action.emailId).session(session),
          action.instaId && Insta.findByIdAndDelete(action.instaId).session(session),
        ]);

        // Delete the Action document
        await Action.findByIdAndDelete(actionId).session(session);

        // Commit transaction
        await session.commitTransaction();
        session.endSession();
        res.status(200).json({ message: `Action with id ${actionId} deleted successfully, along with related call, email or insta entries`});
      } catch (error: unknown) {
        await session.abortTransaction();
        session.endSession();
        if (error instanceof Error) {
          console.error("Error deleting action and related entries:", error);
          res.status(500).json({ error: error.message });
        } else {
          res.status(500).json({ error: `An unknown error occurred while deleting action ${actionId}` });
        }
      }
  }
};



export const editAction = async (req: Request, res: Response): Promise<void> => {
  //Deletes not just the action but all related types of actions in their respective collections.
  //modify this with similar logic as postAction
  const { actionId } = req.params;
  const formData = req.body;
  const session = await mongoose.startSession();
  session.startTransaction();
  const { userId } = getAuth(req);

  if (!userId) {
    res.status(401).json({ message: 'Unauthorized' });
  } else {
  try {
    // Find the Action document to get related IDs
    const user = await clerkClient.users.getUser(userId);
    const createdBy = user.emailAddresses[0]?.emailAddress;

    // Create a new action document
    const action = await Action.findById(actionId).session(session);
    //console.log(action);
    if (!action) throw new Error("Action not found");

    const isCreator = String(action.createdBy) === String(createdBy);
    const isSuperadmin = user.publicMetadata?.role === "superadmin";

    if (!isCreator && !isSuperadmin) {
      throw new Error("Must be Superadmin or Action Creator to edit this action");
    }

    if (formData.mainInfo) {
        await Action.findByIdAndUpdate(
        actionId,
        { $set: formData.mainInfo },
        { new: true, session} 
      );
    }

    if (formData.emailInfo && action.emailId) {
      await Email.findByIdAndUpdate(
        action.emailId,
        { $set: formData.emailInfo },
        { new: true, session }
      );
    }
    
    if (formData.callInfo && action.callId) {
      await Call.findByIdAndUpdate(
        action.callId,
        { $set: formData.callInfo },
        { new: true, session }
      );
    }
    
    if (formData.instaInfo && action.instaId) {
      await Insta.findByIdAndUpdate(
        action.instaId,
        { $set: formData.instaInfo },
        { new: true, session }
      );
    }

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ message: `Action with id ${actionId} updated successfully`});
  } catch (error: unknown) {
    await session.abortTransaction();
    session.endSession();

    if (error instanceof Error) {
      console.error("Error editing action and related entries:", error);
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: `An unknown error occurred while updating action ${actionId}` });
    }
  }
}
};