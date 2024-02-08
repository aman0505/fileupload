const { initializeApp } = require("firebase/app");
const { getStorage, ref, uploadBytes, uploadBytesResumable, getDownloadURL } = require("firebase/storage")
const { signInWithEmailAndPassword, getAuth } = require("firebase/auth")
var Minizip = require('minizip-asm.js');
var fs = require("fs");
const JSZip = require('jszip');
const generate = require('nanoid/generate')

const firebaseConfig = {
    apiKey: "AIzaSyBF-8wuP6pXLMNFlbbK6HYexQX2tkvnnTM",
    authDomain: "filzupload.firebaseapp.com",
    projectId: "filzupload",
    storageBucket: "filzupload.appspot.com",
    messagingSenderId: "1046579677919",
    appId: "1:1046579677919:web:e899ea2fa75d814aa3776a"
};
const app1 = initializeApp(firebaseConfig);

const FileUploadWithoutLogin = async (req, res) => {
  

    try {




        // 1000 byte=1kb
        // 1000 kb =1mb

        // 340153 bytes 
        // generating unique id 
        const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*';
        model = generate(alphabet, 6)
        // ================================================
        // Files Size Restriction
        TotalFileSizeBytes = 0
        for (let i = 0; i < req.files.length; i++) {
            TotalFileSizeBytes += req.files[i].size
        }
        fileInKb = TotalFileSizeBytes / 1000
        fileInMb = fileInKb / 1000
        if (fileInMb > 5) {
            res.status(400).send({
                error: 'File Must Be Less Than 5MB'
            })
            return false
        }
        // ============================================
        console.log(TotalFileSizeBytes + "total bytes")
        console.log(fileInMb.toFixed(3) + "MB")
        if (req.body.FileName == null || req.body.FileName == '') {

            res.status(400).send("Please Enter File Name")
            return false
        }
        // ===============================================
        // zip algo 1
        var mz = new Minizip();
        if (req.files.length == 0) {
            mz.append(req.files[0].originalname, req.files[0].buffer);

        }
        if (req.files.length > 0) {
            for (let i = 0; i < req.files.length; i++) {

                mz.append(req.files[i].originalname, req.files[i].buffer);
            }
        }
        // ==========================================
        const storage = getStorage();
        const auth = getAuth(app1);
        // authentation 
        await signInWithEmailAndPassword(auth, "quickearth4@gmail.com", "9805999374")
        const storageRef = ref(storage, req.body.FileName + ".zip")
        var metadata = {
            customMetadata: {
                'uniqueId': model,
                "date": new Date(),
                "size": fileInMb
            },
        }

        if (req.body.userId == null) {
            metadata.customMetadata.userId = null
        } else {
            metadata.customMetadata.userId = req.body.userId
        }
        const uploadTask = uploadBytesResumable(storageRef, Buffer.from(mz.zip()), metadata)

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
    } catch (e) {
        res.status(e.statusCode || 400).send({

            msg: "someting unwanted occured...",
            error: e.message
        });
    }

}
module.exports = {
    FileUploadWithoutLogin
}