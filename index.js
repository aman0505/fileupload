
const express = require("express")
const bodyParser = require('body-parser');
const app = express()
require('dotenv').config()
const port =process.env.PORT||5000
const cors = require('cors');


// spawn = require('child_process').spawn;



app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.urlencoded({ extended: false }))

app.use(
    cors({
        origin: '*',
        methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
    })
);


app.get("/", (req, res) => {

    res.send("console getdata")
})

// user Routes
const user=require("./module/user/router/userRouter");


app.use(user)



app.listen(port, () => {
    console.log(port, 'Run successfully!');
});