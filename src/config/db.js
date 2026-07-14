import mongoose from "mongoose";
import config from "./config.js"

async function connectDB() {
    try{
        await mongoose.connect(config.MONGO_URI);
        console.log("MongoDB connected");
        console.log(mongoose.connection.name);
    }catch(err){
        console.error("MongoDB connection error:", err);
        process.exit(1);
    }
}

export default connectDB;