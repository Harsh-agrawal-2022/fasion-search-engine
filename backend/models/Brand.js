import mongoose from "mongoose";

const brandSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  website: { type: String },
  logo: { type: String }, // URL for brand logo
}, { timestamps: true });

export default mongoose.model("Brand", brandSchema);
