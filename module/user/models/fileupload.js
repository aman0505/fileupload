const mongoose = require("mongoose")
const FileSchema = new mongoose.Schema({

    FileUnqueId: {
        type: String,
        required: true,
        unique:true
    },
    FileName: {
        type: String
    },
    FileUrl: {
        type: String,
        required: true,
        unique:true
    },
    FileSizeMb: {
        type: Number,
        required: true
    },
    UserID: {
        type:String,
        default: null
    },
    FilePassword: {
        type: String,
        required: true
    },
    FileCreatedDate: {
        type: Date,
        default: Date.now(),
    }
})
const collection=mongoose.model("Filedata",FileSchema)
module.exports=collection
