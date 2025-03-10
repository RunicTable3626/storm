import express from "express";
const actionRouter = express.Router();

import {getCallInfo, getEmailInfo, getInstagramPostID, postAction, getAllActions, updateCount, generateContent} from "../controllers/actionController"

actionRouter.get("/email", getEmailInfo);
actionRouter.get("/instagram", getInstagramPostID);
actionRouter.get("/phone", getCallInfo);
actionRouter.post("/", postAction);
actionRouter.get("/", getAllActions);
actionRouter.patch("/updateCount", updateCount);
actionRouter.post('/generate-content', generateContent);


export default actionRouter; 