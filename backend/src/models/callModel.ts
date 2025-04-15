import mongoose, { Document } from "mongoose";

export interface ICall extends Document {
  phoneNumber: string;
  name: string;
  callScript: string;
}

const callSchema = new mongoose.Schema({
  phoneNumber:  { type: String, required: true},
  name:         {type: String, required: true},
  callScript:   { type: String, required: true }, 
});

const Call = mongoose.model<ICall>("Call", callSchema);
export default Call;