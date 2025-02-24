import mongoose from "mongoose";

const emailSchema = new mongoose.Schema({
  id:                   { type: String, required: true, unique: true },
  name:                 { type: String, required: true},
  emailAddress:         { type: String, required: true},
  subject:              { type: String},
  body:                 { type: String}, 
});

const Email = mongoose.model("emailSchema", emailSchema);
export default Email;