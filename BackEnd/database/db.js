require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async function(){
    try{
        await mongoose.connect(process.env.MONGO_URI)
        .then(()=>{console.log("Connected to DB")});
    } catch(e){
        console.log(`Error in connecting DB. ${e}`);
    }
};

module.exports = connectDB;