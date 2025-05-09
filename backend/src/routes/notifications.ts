import express from "express";
import { requireAuth } from '@clerk/express'
const notificationsRouter = express.Router();

import {
    createSubscriber, 
    postCreateActionNotification
} from "../controllers/notificationController"

notificationsRouter.post("/subscribe", createSubscriber);
notificationsRouter.post("/create-action", requireAuth(), postCreateActionNotification);
export default notificationsRouter; 