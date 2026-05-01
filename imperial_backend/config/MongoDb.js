import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);
import mongoose from "mongoose";

// Use a global variable to persist the connection across serverless "warm" starts
let cachedConnection = null;

const ConnectDB = async () => {
  mongoose.set("strictQuery", true);

  // 1. If we have a cached connection, use it immediately
  if (cachedConnection) {
    console.log("Using cached DB connection");
     return cachedConnection;
   }

  try {
    console.log("Establishing new DB connection...");
    
    // 2. Establish connection and store it in the cache
    const db = await mongoose.connect(`${process.env.MONGODB_URI}/ImperialGarden`, {
      // These options help prevent the 10s buffering hang
      serverSelectionTimeoutMS: 5000, 
      socketTimeoutMS: 45000,
    });

    cachedConnection = db.connections[0].readyState;
    console.log("DB CONNECTED SUCCESSFULLY");
    
    return db;
  } catch (error) {
    console.error("CRITICAL DB CONNECTION ERROR:", error.message);
    // Throw the error so the API handler knows the DB is down
    throw error; 
  }
};

export default ConnectDB;