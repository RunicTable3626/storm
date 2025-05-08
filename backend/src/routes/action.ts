import express from "express";
import { requireAuth } from '@clerk/express'
const actionRouter = express.Router();

import {
    getCallInfo, 
    getEmailInfo, 
    getInstagramPostID, 
    postAction, 
    getAllActions, 
    getActionsFromLastNDays,
    getAllCreatedActions,
    updateCount, 
    generateContent,
    rephraseContent,
    deleteAction,
    editAction
} from "../controllers/actionController"

actionRouter.get("/email", getEmailInfo);
actionRouter.get("/instagram", getInstagramPostID);
actionRouter.get("/phone", getCallInfo);
actionRouter.post("/", requireAuth(), postAction);
actionRouter.get("/", getAllActions);
actionRouter.get("/lastNDays", getActionsFromLastNDays);
actionRouter.get("/created", requireAuth(), getAllCreatedActions);
actionRouter.patch("/updateCount", updateCount);
actionRouter.post('/generate-content', requireAuth(), generateContent);
actionRouter.post('/rephrase-content', rephraseContent);
actionRouter.delete('/:actionId',  requireAuth(), deleteAction);
actionRouter.patch('/:actionId',  requireAuth(), editAction);


export default actionRouter; 