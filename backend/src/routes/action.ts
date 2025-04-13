import express from "express";
import { requireAuth } from '@clerk/express'
const actionRouter = express.Router();

import {
    getCallInfo, 
    getEmailInfo, 
    getInstagramPostID, 
    postAction, 
    getAllActions, 
    updateCount, 
    generateContent,
    rephraseContent,
    deleteAction
} from "../controllers/actionController"

actionRouter.get("/email", getEmailInfo);
actionRouter.get("/instagram", getInstagramPostID);
actionRouter.get("/phone", getCallInfo);
actionRouter.post("/", requireAuth(), postAction);
actionRouter.get("/", getAllActions);
actionRouter.patch("/updateCount", updateCount);
actionRouter.post('/generate-content', requireAuth(), generateContent);
actionRouter.post('/rephrase-content', rephraseContent);
actionRouter.delete('/:actionId',  requireAuth(), deleteAction);


export default actionRouter; 