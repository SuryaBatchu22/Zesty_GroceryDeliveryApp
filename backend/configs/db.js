import mongoose from "mongoose";

const connectDB = async ()=>{
    try{
        mongoose.connection.on('connected' , ()=> console.log("Database Connected"));

        await mongoose.connect(`${process.env.MONGODB_URI}/zesty`)
    } catch(error){
        console.error("DB error:", error.message);
    }
}

export default connectDB;