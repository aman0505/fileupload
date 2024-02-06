
const express = require("express")
const bodyParser = require('body-parser');
const app = express()
const port = 5000
const cors = require('cors');
const { initializeApp } = require("firebase/app");
const { getStorage, ref, uploadBytes, uploadBytesResumable, getDownloadURL } = require("firebase/storage")
const { signInWithEmailAndPassword, getAuth } = require("firebase/auth")
var Minizip = require('minizip-asm.js');
var fs = require("fs");
// spawn = require('child_process').spawn;


const multer = require('multer');
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }))
const upload = multer({
    storage: multer.memoryStorage()
});
app.use(
    cors({
        origin: '*',
        methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
    })
);


app.get("/", (req, res) => {

    res.send("console getdata")
})

// uploading files 

const firebaseConfig = {
    apiKey: "AIzaSyBF-8wuP6pXLMNFlbbK6HYexQX2tkvnnTM",
    authDomain: "filzupload.firebaseapp.com",
    projectId: "filzupload",
    storageBucket: "filzupload.appspot.com",
    messagingSenderId: "1046579677919",
    appId: "1:1046579677919:web:e899ea2fa75d814aa3776a"
};
const app1 = initializeApp(firebaseConfig);


app.post("/send", upload.any(), async (req, res) => {
   
    console.log(req.files)
   

   
    // console.log(req.files[0].originalname)
    // zip algo 1
    // ===============================================
    // var text = new Buffer(req.files[0].buffer);
    // var mz = new Minizip();
    // mz.append("abc.jpeg", req.files[0].buffer, { password: "123" });
    // const data = fs.writeFileSync("new.zip", new Buffer(mz.zip()));
 
    // ==========================================

    // zip algo 2

    // ===========================================

    // zip = spawn('zip', ['-p', 'password123', 'zipfile22s.zip', req.files[0].buffer]);
    // console.log(zip, "zip files")
    // zip.on('exit', function (code) {
        // do something with zipfile archive.zip
        // which will be in same location as file/folder given
    //     console.log(code)
    // });

    // ==========================================
    const storage = getStorage();
    const auth = getAuth(app1);
    await signInWithEmailAndPassword(auth, "quickearth4@gmail.com", "9805999374")
    const storageRef = ref(storage, req.files[0].originalname)
    const uploadTask = uploadBytesResumable(storageRef, req.files[0].buffer)
    console.log(uploadTask)
    uploadTask.on('state_changed',
        (snapshot) => {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
                case 'paused':
                    console.log('Upload is paused');
                    break;
                case 'running':
                    console.log('Upload is running');
                    break;
            }
        },
        (error) => {
            // A full list of error codes is available at
            // https://firebase.google.com/docs/storage/web/handle-errors
            switch (error.code) {
                case 'storage/unauthorized':
                    // User doesn't have permission to access the object
                    break;
                case 'storage/canceled':
                    // User canceled the upload
                    break;

                // ...

                case 'storage/unknown':
                    // Unknown error occurred, inspect error.serverResponse
                    break;
            }
        },
        () => {
            // Upload completed successfully, now we can get the download URL
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                console.log('File available at');
                res.status(200).send([downloadURL])
            });
        }
    );

})





app.listen(port, () => {
    console.log(port, 'Run successfully!');
});