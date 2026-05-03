import express from 'express'
import QRCode from 'qrcode'
import Plant from '../Model/plants.js';
import jwt  from 'jsonwebtoken'
const router = express.Router();
import { v2 as cloudinary } from "cloudinary";

// ─── GET all plants ────────────────────────────────────────────────────────────
export const AllPlant = async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (search) filter.name = { $regex: search, $options: "i" };
      
    const plants = await Plant.find(filter).select("-__v").sort({ name: 1 });
    
    res.json({ success: true, count: plants.length, data: plants });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
 
// ─── GET single plant by ID ────────────────────────────────────────────────────
export  const Single = async (req, res) => {
  try {
    const plant = await Plant.findById(req.params.id).select("-__v");
    if (!plant) return res.status(404).json({ success: false, message: "Plant not found" });
    res.json({ success: true, data: plant });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
 
// ─── POST create plant + auto-generate QR code ────────────────────────────────
 export const Create = async (req, res) => {
  try {
    const {
      name, scientificName, category,
      description, imageUrl, careDetails,
      variants, price, size
    } = req.body;  // ✅ plain JSON — no multer needed

    const plant = await Plant.create({
      name, scientificName, description,
      category,
      careDetails,
      imageUrl,
      ...(price && { price }),
      ...(size && { size }),
      ...(variants?.length > 0 && { variants }),
    });

    const qrDataUrl = await QRCode.toDataURL(
      `${process.env.BASE_URL}/plant/${plant._id}`,
      { errorCorrectionLevel: 'H', margin: 2, width: 300,
        color: { dark: '#1a3a1a', light: '#ffffff' } }
    );
    plant.qrCodeUrl = qrDataUrl;
    await plant.save();

    res.status(201).json({ success: true, data: plant });

  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: err.message });
  }
};
// ─── PUT update plant ──────────────────────────────────────────────────────────
export const Update = async (req, res) => {
  try {
    const {
      name, scientificName, description,
      imageUrl, category, careDetails,
      variants, price, size
    } = req.body;  // ✅ plain JSON — no parsing needed, no multer

    const updateData = {
      name,
      scientificName,
      description,
      imageUrl,           // ✅ already cloudinary URL from frontend
      category,           // ✅ already array from frontend
      careDetails,        // ✅ already object from frontend
      variants: variants || [],  // ✅ empty array clears variants
      ...(price !== undefined && { price }),
      ...(size !== undefined && { size }),
    };

    console.log('updateData:', updateData);

    const plant = await Plant.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!plant) return res.status(404).json({ success: false, message: 'Plant not found' });

    res.json({ success: true, data: plant });

  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: err.message });
  }
};
 
// ─── DELETE plant ──────────────────────────────────────────────────────────────
export const Delete = async (req, res) => {
  try {
    const plant = await Plant.findByIdAndDelete(req.params.id);
    if (!plant) return res.status(404).json({ success: false, message: "Plant not found" });
    res.json({ success: true, message: "Plant deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
export const Qr = async (req, res) => {
  try {
    const plant = await Plant.findById(req.params.id);
    if (!plant) return res.status(404).json({ success: false, message: "Plant not found" });
 
    const BASE_URL = process.env.BASE_URL
    const plantPageUrl = `${BASE_URL}/plant/${plant._id}`;
 
    const qrDataUrl = await QRCode.toDataURL(plantPageUrl, {
      errorCorrectionLevel: "H",
      margin: 2,
      width: 300,
      color: { dark: "#1a3a1a", light: "#ffffff" },
    });
 
    plant.qrCodeUrl = qrDataUrl;
    await plant.save();
 
    res.json({ success: true, qrCodeUrl: qrDataUrl, plantPageUrl });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
export const Login = async (req,res)=>{
    const {email,password} = req.body;
     try {
    const admin = process.env.EMAIL
    if (!admin) return res.json({ success: false, message: 'Invalid credentials' });
    if(admin !== email){
        return res.json({ success: false, message: 'Invalid credentials' });
    }
    if(password !== process.env.PASSWORD){
        return res.json({ success: false, message: 'Invalid credentials' });
    }
    
  

    const token = jwt.sign({ id: 1234 }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ success: true, token });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}
 

 
export default router