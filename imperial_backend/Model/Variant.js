import mongoose from "mongoose";

const variantSchema = new mongoose.Schema({
  size: String,          // "3ft", "6ft"
  price: String,         // each size has own price
  imageUrl: String,     
},{timestamps:true});

const variant = mongoose.models.variant ||  mongoose.model('variant',variantSchema);
export default variantSchema