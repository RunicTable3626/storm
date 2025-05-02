import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISubscriber extends Document {
  userId: string;
  fcmToken: string;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriberSchema: Schema<ISubscriber> = new Schema(
  {
    userId: { type: String, required: true, unique: true },
    fcmToken: { type: String, required: true },
  },
  { timestamps: true }
);

const Subscriber: Model<ISubscriber> =
  mongoose.models.Subscriber || mongoose.model<ISubscriber>('Subscriber', SubscriberSchema);

export default Subscriber;