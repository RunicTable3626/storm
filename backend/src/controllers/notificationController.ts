import { Express, Request, Response } from 'express';
import Subscriber from '../models/subscriberModel';  // Your Mongoose model
import admin from '../lib/firebaseAdmin';



// POST: /api/notifications/subscribe
export const createSubscriber = async (req: Request, res: Response) : Promise<void> => {
  const { userId, fcmToken } = req.body;

  // Validate request
  if (!userId || !fcmToken) {
    res.status(400).json({ message: 'userId and fcmToken are required.' });
  }

  try {
    // Check if user already exists in the database
    const existingSubscriber = await Subscriber.findOne({ userId });

    if (existingSubscriber) {
      // Subscriber exists, skip creation
      res.status(200).json({ message: 'User already subscribed' });
    } else {

        const newSubscriber = new Subscriber({
        userId: userId,
        fcmToken: fcmToken,
        });
    
        await newSubscriber.save();
    
        res.status(201).json({ message: 'Subscription successful' });

    }


  } catch (error) {
    console.error('Error during subscription', error);
    res.status(500).json({ message: 'An error occurred while subscribing.' });
  }
};


export const postCreateActionNotification = async (req: Request, res: Response) => {
    const { message } = req.body.title;

    if (!message) {
      res.status(400).json({ message: 'Notification message is required.' });
    }
  
    try {
      // Retrieve all subscribers (FCM tokens)
      const subscribers = await Subscriber.find({}, 'fcmToken');
      const tokens = subscribers.map(sub => sub.fcmToken);
  
      if (tokens.length === 0) {
        res.status(200).json({ message: 'No subscribers to notify.' });
      } {
              // Build the message object with notification payload
      const messagePayload: admin.messaging.MulticastMessage = {
        notification: {
          title: 'New Alert',
          body: message,
        },
        tokens: tokens, // List of device tokens to send the message to
      };
      // Send notification to all tokens
      const response = await admin.messaging().sendEachForMulticast(messagePayload);
  
      // Check for failures
        const failedTokens = response.failureCount > 0 ? response.responses.filter(r => !r.success) : [];
        if (failedTokens.length > 0) {
            console.error('Failed to send notifications to tokens:', failedTokens);
            res.status(500).json({ message: 'Failed to send notifications to some users.' });
        } else {
            res.status(200).json({ message: 'Notifications sent successfully.' });
        }
      }
    } catch (error) {
      console.error('Error broadcasting notification:', error);
      res.status(500).json({ message: 'Failed to send notifications.' });
    }
  };
