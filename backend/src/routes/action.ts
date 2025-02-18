import express from "express";
const actionRouter = express.Router();

import {getCallInfo, getEmailInfo, getInstagramPostID} from "../controllers/actionController"

actionRouter.get("/email", getEmailInfo);
actionRouter.get("/instagram", getInstagramPostID);
actionRouter.get("/phone", getCallInfo);

export default actionRouter;