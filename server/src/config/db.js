const mongoose = require("mongoose");

const mongo_uri = process.env.MONGO_URI

if(!mongo_uri){
    console.error("Please provide MONGO_URI in the .env file");
    process.exit(1);
}

const connectDB = async ()=>{

    try{
        await mongoose.connect(mongo_uri)
        console.log("Database connected successfully")
    }
    catch(err){
        console.error("Database connection failed")
        process.exit(1)
    }
}

module.exports = connectDB;