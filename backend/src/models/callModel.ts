import mongoose from "mongoose";

const callSchema = new mongoose.Schema({
  id:           { type: String, required: true, unique: true },
  phoneNumber:  { type: Date, required: true, unique: true },
  name:         {type: String, required: true},
  callScript:   { type: String, required: true }, 
});

const Call = mongoose.model("callSchema", callSchema);
export default Call;