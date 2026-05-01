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
    console.log(filter)  
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
    const { name, scientificName, description } = req.body;
    const category = JSON.parse(req.body.category);
    const careDetails = JSON.parse(req.body.careDetails);

    // ✅ Dynamic — works for any number of files
    const imageFile = req.files.find(f => f.fieldname === 'image');
    if (!imageFile) {
      return res.json({ success: false, message: "No image file provided" });
    }

    const result = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: 'image'
    });
    const imageUrl = result.secure_url;
let variants = [];
let price = undefined;
let size = undefined;

if (req.body.variants) {
  const parsedVariants = JSON.parse(req.body.variants);

  variants = await Promise.all(
    parsedVariants.map(async (v, i) => {
      const variantFile = req.files.find(
        f => f.fieldname === `variantImages[${i}]`
      );

      let variantImageUrl = '';

      if (variantFile) {
        const result = await cloudinary.uploader.upload(variantFile.path);
        variantImageUrl = result.secure_url;
      }

      return {
        size: v.size,
        price: v.price,
        imageUrl: variantImageUrl
      };
    })
  );

} else {
  price = req.body.price;
  size = req.body.size; // 👈 add this
}
const getVariantFile = (index) =>
  req.files.find(f => f.fieldname === `variantImages[${index}]`);
    const plant = await Plant.create({
      name, scientificName, description,
        category: JSON.parse(req.body.category),
      careDetails, imageUrl,
      ...(price && { price }),
       ...(size && { size }),
      ...(variants.length > 0 && { variants }),
    });

    const BASE_URL = process.env.BASE_URL || "http://localhost:5173";
    const qrDataUrl = await QRCode.toDataURL(`${BASE_URL}/plant/${plant._id}`, {
      errorCorrectionLevel: "H",
      margin: 2,
      width: 300,
      color: { dark: "#1a3a1a", light: "#ffffff" },
    });

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
    const { name, scientificName, description, size } = req.body;

    // ✅ Parse JSON fields explicitly
    const careDetails = req.body.careDetails ? JSON.parse(req.body.careDetails) : undefined;
    const category = req.body.category ? JSON.parse(req.body.category) : undefined;

    // ✅ Main image
    const mainImage = req.files?.find(f => f.fieldname === 'image');
    let imageUrl = req.body.existingImageUrl || '';
    if (mainImage) {
      const result = await cloudinary.uploader.upload(mainImage.path);
      imageUrl = result.secure_url;
    }

    // ✅ Variants vs single price+size
    let variants = undefined;
    let price = undefined;
    // let size = undefined;

    const parsedVariants = req.body.variants ? JSON.parse(req.body.variants) : [];
    if (req.body.variants) {
      variants = await Promise.all(
        parsedVariants.map(async (v, i) => {
          const variantFile = req.files?.find(f => f.fieldname === `variantImages[${i}]`);
          let variantImageUrl = v.imageUrl || '';
          if (variantFile) {
            const result = await cloudinary.uploader.upload(variantFile.path);
            variantImageUrl = result.secure_url;
          }
          return { size: v.size, price: v.price, imageUrl: variantImageUrl };
        })
      );
    } else {
      price = req.body.price;
      size = req.body.size;  // ✅ explicit
    }

    // ✅ Build clean update object — no unwanted fields
    const updateData = {
      name,
      scientificName,
      description,
      imageUrl,
      variants, 
      size: req.body.size || '',  
      ...(careDetails && { careDetails }),
      ...(category && { category }),
      ...(price !== undefined && { price }),
      ...(size !== undefined && { size }),
      ...(variants !== undefined && { variants }),
    };

    // ✅ check what's going in

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
 
    const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
    const plantPageUrl = `${BASE_URL}/plant.html?id=${plant._id}`;
 
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