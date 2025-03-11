import mongoose from "mongoose";

const emailSchema = new mongoose.Schema({
  name:                 { type: String},
  emailAddress:         { type: String, required: true},
  subject:              { type: String},
  body:                 { type: String}, 
});

const Email = mongoose.model("Email", emailSchema);
export default Email;