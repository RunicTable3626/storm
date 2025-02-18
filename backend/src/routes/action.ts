import express from "express";
const actionRouter = express.Router();

import {getCallInfo, getEmailInfo, getInstagramPostID} from "../controllers/actionController"

actionRouter.get("/action/email", getEmailInfo);
actionRouter.get("/action/instagram", getInstagramPostID);
actionRouter.get("/action/phone", getCallInfo);

export default actionRouter; 