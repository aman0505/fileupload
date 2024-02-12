const { initializeApp } = require("firebase/app");
const { getStorage, ref, uploadBytesResumable, getDownloadURL } = require("firebase/storage")
const { signInWithEmailAndPassword, getAuth } = require("firebase/auth")
var Minizip = require('minizip-asm.js');
const generate = require('nanoid/generate')
const collection = require("../models/fileupload");
const userCollection = require("../models/userSignup");
const geterateAuthUserToken = require("../../../helpers/user/token");
const bcrypt = require("bcryptjs");
// const collection = require("../models/fileupload");
const dotenv=require("dotenv").config()
const firebaseConfig = {
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId
};
const app1 = initializeApp(firebaseConfig);

const GenerateUniquekey = () => {
    const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*';
    return generate(alphabet, 6)
}


const ValiDateFileMb = (fileLength, filesarray) => {
    TotalFileSizeBytes = 0
    for (let i = 0; i < fileLength; i++) {
        TotalFileSizeBytes += filesarray[i].size
    }
    fileInKb = TotalFileSizeBytes / 1000
    return fileInKb / 1000

}

const FileUploadWithoutLogin = async (req, res) => {


    try {




        // 1000 byte=1kb
        // 1000 kb =1mb

        // 340153 bytes 
        // generating unique id 


        // ================================================
        // Files Size Restriction



        const FileSIze = 4
        const fileLength = req.files.length
        if (ValiDateFileMb(fileLength, req.files) > FileSIze) {
            res.status(400).send({
                error: `File Must Be Less Than ${FileSIze}MB`
            })
            return false
        }
        // ============================================
        // console.log(TotalFileSizeBytes + "total bytes")
        // console.log(fileInMb.toFixed(3) + "MB")
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
        const email= process.env.firebaseEmail
        const password=process.env.firebasePassword
        // await signInWithEmailAndPassword(auth,"quickearth4@gmail.com","9805999374" )
        const storageRef = ref(storage, req.body.FileName + ".zip")
        var metadata = {
            customMetadata: {
                'uniqueId': GenerateUniquekey(),
                "date": new Date(),
                "size": ValiDateFileMb(fileLength, req.files)
            },
        }

        if (req.body.userId == null) {
            metadata.customMetadata.userId = null
        } else {
            metadata.customMetadata.userId = req.body.userId
        }
        const uploadTask = uploadBytesResumable(storageRef, Buffer.from(mz.zip()), metadata)
        console.log(uploadTask, "uploadTask");

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
                        res.status(error.code || 400).send({
                            msg: "User doesn't have permission to access the object",
                            error: error.message
                        })
                        return false
                        break;
                    case 'storage/canceled':
                        // User canceled the upload
                        res.status(error.code || 400).send({
                            msg: "User canceled the upload",
                            error: error.message
                        })
                        return false
                        break;

                    // ...

                    case 'storage/unknown':
                        // Unknown error occurred, inspect error.serverResponse
                        res.status(error.code || 400).send({
                            msg: "Unknown error occurred, inspect error.serverResponse",
                            error: error.message
                        })
                        return false
                        break;
                }
            },
            () => {
                // Upload completed successfully, now we can get the download URL
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log('File available at');

                    try {


                        if (downloadURL) {
                            (async () => {
                                const filedatas = {
                                    FileUnqueId: GenerateUniquekey(),
                                    FileName: req.body.FileName,
                                    FileUrl: downloadURL,
                                    FileSizeMb: ValiDateFileMb(fileLength, req.files),
                                    UserID: req.body.userID ? req.body.userID : null,
                                    FilePassword: req.body.FilePassword,
                                }
                                const objfiles = new collection(filedatas);
                                const fileAknowladgement = await objfiles.save()

                                res.status(200).send(fileAknowladgement)
                                return false

                            })()



                        } else {
                            return false
                        }

                    } catch (error) {
                        res.status(e.statusCode || 400).send({

                            msg: "someting unwanted occured...",
                            error: e.message
                        });
                    }



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

const UserSignup = async (req, res) => {
    try {
        const Passwordhash = await bcrypt.hash(req.body.Password, 10)
        const Signupdata = {
            UserName: req.body.UserName,
            UserEmail: req.body.UserEmail,
            UserPassword: Passwordhash,
        }

        const data = new userCollection(Signupdata);
        const signupAknowladgement = await data.save()
        const token = await geterateAuthUserToken(signupAknowladgement._id)

        res.status(200).send({ signupAknowladgement, token });




    } catch (error) {
        res.status(error.statusCode || 400).send({
            msg: "Something Unwanted Occoured....",
            error: error.message
        })
    }

}
const Userlogin = async (req, res) => {
    try {
        if (!req.body.UserEmail || !req.body.UserPassword) {
            res.status(400).send({
                error: "Crendetails must required"
            })
            return false
        }
        const data = await userCollection.find({
            UserEmail: req.body.UserEmail
        });
        if (data.length == 0) {
            res.status(400).send({
                error: "Enter Valid Crendentials.."
            })
            return false
        }
        const ismatch = await bcrypt.compare(req.body.UserPassword, data[0].UserPassword)

        if (!ismatch) {
            res.status(400).send({
                error: "Enter Valid Crendentials.."
            })
            return false
        }
        delete data[0]._doc.tokens
        const token = await geterateAuthUserToken(data[0]._id)
        res.status(200).send({ data, token })




    } catch (error) {
        res.status(error.statusCode || 400).send({
            msg: "Something Unwanted Occoured....",
            error: error.message
        })
    }

}
const FindUserByid = async (req, res) => {
    try {
        if (!req.body.UserID) {
            res.status(400).send({
                error: "UserID must required"
            })
            return false
        }
        const data = await userCollection.findById({
            _id: req.body.UserID
        });
        // userdata._doc.user_district
        delete data._doc.tokens
        res.status(200).send(data)

    } catch (error) {
        res.status(error.statusCode || 400).send({
            msg: "Something Unwanted occured ",
            error: error.message
        })

    }

}

const SearchFile = async (req, res) => {

    try {
        if (!req.body.FileID) {
            res.status(400).send({
                error: "FileUnieueId field required."
            })
            return false;
        }
        const isfile = await collection.find({
            FileUnqueId: req.body.FileID
        })
        if (isfile.length == 0) {
            res.status(200).send("File not found.");
            return false
        }
        res.status(200).send(isfile)
    } catch (error) {
        res.status(error.statusCode || 400).send({
            msg: "Something Unwanted occured ",
            error: error.message
        })
    }

}

const SearchFileByUserId = async (req, res) => {

    try {
        // if (!req.body.UserID) {
        //     res.status(400).send({
        //         error: "UserID field required."
        //     })
        //     return false;
        // }
        const isfile = await collection.find({
            UserID: req.user[0]._id
        })
        if (isfile.length == 0) {
            res.status(200).send("File not found.");
            return false
        }
        res.status(200).send(isfile)
    } catch (error) {
        res.status(error.statusCode || 400).send({
            msg: "Something Unwanted occured ",
            error: error.message
        })
    }

}
const mergeFilesWithUser = async (req, res) => {

    try {
        console.log(req.user, "hyy")
        if (!req.body.FileID || !req.body.FilePassword) {
            res.status(400).send({
                error: "Credentials field required."
            })
            return false;
        }
        let IsPassword = await collection.find({
            _id: req.body.FileID,
            FilePassword: req.body.FilePassword,

        })


        if (IsPassword.length == 0) {
            res.status(200).send({
                error: "Please enter correct credentails."
            })
            return false;
        }
        // console.log(IsPassword)
        IsPassword[0]._doc.UserID = req.user[0]._id

        IsPassword = new collection(IsPassword[0])
        const fileAknowladgement = await IsPassword.save()


        res.status(200).send(fileAknowladgement);

    } catch (error) {
        res.status(error.statusCode || 400).send({
            msg: "Something Unwanted occured ",
            error: error.message
        })
    }
}

const UserLogut=async(req,res)=>{
    try {
        console.log(req.user[0]._doc.tokens)
        req.user[0]._doc.tokens = req.user[0].tokens.filter(
          (token) => token.token !== req.token
        );
        const data= new userCollection(req.user[0])

        await data.save();
        res.status(200).send({ success: "User logged out successfully!" });
      } catch (e) {
        res.status(e.statusCode||400).send({
    
          msg:"someting unwanted occured...",
          error:e.message
        });
      }

}


module.exports = {
    FileUploadWithoutLogin,
    UserSignup,
    Userlogin,
    FindUserByid,
    SearchFile,
    SearchFileByUserId,
    mergeFilesWithUser,
    UserLogut
}