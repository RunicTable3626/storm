import mongoose, { Document } from "mongoose";

export interface IInsta extends Document {
  name?:  string;                
  comment: string;        
  instagramLink: string;                
}

const instaSchema = new mongoose.Schema({
  name:                 { type: String},
  comment:              { type: String},
  instagramLink:        { type: String, required: true}
});

const Insta = mongoose.model<IInsta>("Insta", instaSchema);
export default Insta;