const router =require("express").Router();
const user =require("../controller/user")
const multer = require('multer');
const userAuth=require("../milldeware/userAuth")
const upload = multer({
    storage: multer.memoryStorage()
}); 

router.post("/uploadWithOutLogin",upload.any(),user.FileUploadWithoutLogin)
router.post("/userSignup",user.UserSignup)
router.post("/userlogin",user.Userlogin)
router.post("/findUserById",user.FindUserByid)
router.post("/searchSingleFile",user.SearchFile)
router.post("/searchFileByUserId",userAuth,user.SearchFileByUserId)
router.post("/margeFiles",userAuth,user.mergeFilesWithUser)
router.get("/userlogout",userAuth,user.UserLogut)






module.exports = router;