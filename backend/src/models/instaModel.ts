import mongoose from "mongoose";

const instaSchema = new mongoose.Schema({
  id:                   { type: String, required: true, unique: true },
  name:                 { type: String, required: true},
  postOrPage:           { type: String, required: true},
  instagramId:          { type: String, required: true}
});

const insta = mongoose.model("instaSchema", instaSchema);
export default insta;