import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']); 
import "dotenv/config"
import express from "express"
import cors from "cors"
import ConnectDB from './config/MongoDb.js';
import uploadonCloudinary from './config/Cloudinary.js';
import router from './routes/plant.js';
const app = express();
const PORT = process.env.PORT || 3000;
app.use(async (req, res, next) => {
  await ConnectDB();
  next();
});
 uploadonCloudinary()
 app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use('/api/plant',router)
app.get('/',(req,res)=>{
    res.send("Api Working")
})

export default app;

