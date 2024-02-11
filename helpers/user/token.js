const jwt = require("jsonwebtoken")
const userCollection = require("../../module/user/models/userSignup")
const dotevn=require("dotenv").config()
const geterateAuthUserToken = async(_id) => {
    const user =await userCollection.findById({ _id: _id });
    // console.log(user)
    const token = jwt.sign({ _id: user._id.toString() }, process.env.SecretJwtToken)
    user.tokens = user.tokens.concat({ token })
   await user.save();
   
   return token

}
module.exports=geterateAuthUserToken