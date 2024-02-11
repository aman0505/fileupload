const mongoose = require("mongoose")
mongoose.set("strictQuery", true)
const dotenv = require('dotenv').config();

const connectDn = async () => {
    try {
        const conn = await mongoose.connect(process.env.MongoUrl)
        console.log(`MongoDB Connected: ${conn.connection.host}`)
        
    } catch (error) {
    console.log(`DB connection error:${error}`);
    process.exit(1);
}
}

module.exports = connectDn




