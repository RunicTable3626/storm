import mongoose from "mongoose";

const callSchema = new mongoose.Schema({
  phoneNumber:  { type: String, required: true},
  name:         {type: String, required: true},
  callScript:   { type: String, required: true }, 
});

const Call = mongoose.model("Call", callSchema);
export default Call;