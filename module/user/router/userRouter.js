const router =require("express").Router();
const user =require("../controller/user")
const multer = require('multer');
const upload = multer({
    storage: multer.memoryStorage()
});

router.post("/uploadWithOutLogin",upload.any(),user.FileUploadWithoutLogin)

module.exports = router;