import mongoose, { Document } from "mongoose";

export interface IEmail extends Document {
  name?:  string;                
  emailAddress: string;        
  subject?: string;              
  body?: string;                 
}

const emailSchema = new mongoose.Schema({
  name:                 { type: String},
  emailAddress:         { type: String, required: true},
  subject:              { type: String},
  body:                 { type: String}, 
});

const Email = mongoose.model<IEmail>("Email", emailSchema);
export default Email;