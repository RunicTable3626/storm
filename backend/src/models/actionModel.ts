import mongoose, { Document, Types } from "mongoose";
import { IEmail } from "./emailModel"; // assuming you'll define this like ICall
import { ICall } from "./callModel";
import { IInsta } from "./instaModel";

const { Schema } = mongoose;

export interface IAction extends Document {
  title: string;
  description?: string;
  emailId?: Types.ObjectId | IEmail;
  callId?: Types.ObjectId | ICall;
  instaId?: Types.ObjectId | IInsta;
  emailCount?: number;
  callCount?: number;
  instaCount?: number;
  createdBy: string;
  shareId: string;
  startDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const actionSchema = new mongoose.Schema({
  title:        { type: String, required: true},
  description:  { type: String},
  emailId:      { type: Schema.Types.ObjectId, ref: 'Email' },
  callId:       { type: Schema.Types.ObjectId, ref: 'Call' },
  instaId:      { type: Schema.Types.ObjectId, ref: 'Insta' },
  //set default values as 0 for all these
  createdBy:    {type: String, required: true},
  shareId:      {type: String, unique: true, index: true},
  startDate:    {type: Date},
  emailCount:   { type: Number},
  callCount:    { type: Number},
  instaCount:   { type: Number},
}, { timestamps: true });

const Action = mongoose.model<IAction>("Action", actionSchema);
export default Action;