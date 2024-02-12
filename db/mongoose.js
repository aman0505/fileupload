const mongoose = require("mongoose")
mongoose.set("strictQuery", true)
const dotenv = require('dotenv').config();

const connectDn = async () => {


    try {
        // OjYU25YOVaTB7xGN
        url = "mongodb+srv://rauniyaraman463:hello123@testfileupload.dn9c2xp.mongodb.net/?retryWrites=true&w=majority"
        url2 = "mongodb://127.0.0.1:27017/FileUploads"
        const conn = await mongoose.connect(url)

        console.log(`mongodb Connected ${conn.connection.host}`)
        // .then(() => {

        //     console.log(`MongoDB Connected: ${conn.connection.host}`)
        // }).catch((error) => {

        //     console.log(`DB connection error:${error}`);
        // })

    } catch (error) {
        console.log(`DB connection error:${error}`);
    }


}

module.exports = connectDn




