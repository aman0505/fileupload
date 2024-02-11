const mongoose = require("mongoose")
mongoose.set("strictQuery", true)
const dotenv = require('dotenv').config();
(async () => {



    try {
        mongoose.connect("mongodb://127.0.0.1/FileUploads").then(() => {
            console.log("DB connection successful.......");
        })
            .catch((err) => {
                console.log(`DB connection error:${err}`);
            });
    } catch (error) {
        console.log(`DB connection error:${error}`);
    }
       
 
})();
