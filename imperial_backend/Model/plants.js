import mongoose from 'mongoose';
import variantSchema from './Variant.js';
const plantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  scientificName: String,
  category:{
    type:[String],
    default:[]},
  price:String, 
  description: String,
  qrCodeUrl: String, 
  imageUrl: String,
  size:String,
  variants: [variantSchema],
  careDetails: {
    watering: String,
    sunlight: String,
    temperature: String
  }
}, { timestamps: true });

const Plant = mongoose.models.Plant ||  mongoose.model('Plant', plantSchema);
export default Plant;