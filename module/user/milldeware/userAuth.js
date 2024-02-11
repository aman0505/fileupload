const userCollection = require("../models/userSignup")
const dotevn = require("dotenv").config()

const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {

    try {
        const token = req.header("Authorization").replace("Bearer ", "");
        const decode = jwt.verify(token, process.env.SecretJwtToken);
        console.log(decode)
        const IsValidUser = await userCollection.find({
            _id: decode._id,
            'tokens.token': token
        })

        req.user=IsValidUser
        // console.log(req.user,"users")
        req.token = token;
        next();
    } catch (error) {
        res.status(error.statusCode||400).send({
            msg:"Please authenticate ",
            error:error.message
        })
    }


}
module.exports = userAuth