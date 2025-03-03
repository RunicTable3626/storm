import mongoose from "mongoose";

const { Schema } = mongoose;
const actionSchema = new mongoose.Schema({
  graphic:      { type: String},
  title:        { type: String, required: true},
  description:  { type: String},
  emailId:      { type: Schema.Types.ObjectId, ref: 'Email' },
  callId:       { type: Schema.Types.ObjectId, ref: 'Call' },
  instaId:      { type: Schema.Types.ObjectId, ref: 'Insta' },
  //set default values as 0 for all these
  emailCount:   { type: Number},
  callCount:    { type: Number},
  instaCount:   { type: Number},
}, { timestamps: true });

const Action = mongoose.model("Action", actionSchema);
export default Action;