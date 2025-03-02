import mongoose from "mongoose";

const instaSchema = new mongoose.Schema({
  name:                 { type: String, required: true},
  instagramLink:          { type: String, required: true}
});

const Insta = mongoose.model("Insta", instaSchema);
export default Insta;