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
    deleteAction
} from "../controllers/actionController"

actionRouter.get("/email", getEmailInfo);
actionRouter.get("/instagram", getInstagramPostID);
actionRouter.get("/phone", getCallInfo);
actionRouter.post("/", postAction);
actionRouter.get("/", getAllActions);
actionRouter.patch("/updateCount", updateCount);
actionRouter.post('/generate-content', generateContent);
actionRouter.delete('/:actionId',  deleteAction);


export default actionRouter; 