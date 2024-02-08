const router =require("express").Router();
const user =require("../controller/user")
const multer = require('multer');
const upload = multer({
    storage: multer.memoryStorage()
});

router.post("/uploadWithOutLogin",upload.any(),user.FileUploadWithoutLogin)
router.get("/uploadfile",user.userupload)


module.exports = router;