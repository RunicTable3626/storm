import mongoose from "mongoose";

const actionSchema = new mongoose.Schema({
  id:           { type: String, required: true, unique: true },
  createdAt:    { type: Date, required: true, unique: true },
  graphic:      { type: String},
  title:        { type: String},
  description:  { type: String},
  email_id :    { type: String},
  call_id :     { type: String},
  insta_id :    { type: String},
  email_count:  { type: Number},
  call_count:   { type: Number},
  insta_count:  { type: Number},
});

const Action = mongoose.model("actionSchema", actionSchema);
export default Action;