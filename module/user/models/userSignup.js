const mongoose = require("mongoose")
const validator = require('validator');
const UserSignUpSchema = new mongoose.Schema({

    UserName: {
        type: String,
        required: true,

    },
    UserEmail: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Please insert a valid email.');
            }

        },
        unique: true

    },
    UserPassword: {
        type: String,
        required: true
    },
    tokens: [
        {
            token: {
                type: String,
                required: true,
            },
        },
    ],

})
const userCollection = mongoose.model("User", UserSignUpSchema)
module.exports = userCollection
