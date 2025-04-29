import express from "express";
import { requireAuth } from '@clerk/express'
const notificationsRouter = express.Router();

import {
    createSubscriber
} from "../controllers/notificationController"

notificationsRouter.post("/create-action", requireAuth(), postNotification);
notificationsRouter.post("/subscribe", createSubscriber);
notificationsRouter.get("/subscribe", getSubscribers);


export default notificationsRouter; 