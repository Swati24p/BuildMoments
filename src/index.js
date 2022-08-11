const express = require("express");
const multer = require("multer");
const bodyParser = require("body-parser")
const route = require("./routes/route")
const mongoose = require("mongoose")
const app = express();

const { AppConfig } = require('aws-sdk');

app.use(bodyParser.json());

app.use(multer().any())

mongoose.connect("mongodb+srv://swati_pathak:DGhDxlBIIfyRwGwk@cluster0.ogdpf.mongodb.net/buildMoments", {
    useNewUrlParser: true
})
.then(() => console.log("MongoDB(Server: 27017) Is Connected !!!"))
.catch(err => console.log(err))

app.use('/', route);

app.all('*', function (req, res) {
    throw new Error("You Hit Wrong Api!!!, Plz Check !!!")
});

app.use(function (e, req, res, next) {
    if (e.message === "You Hit Wrong Api!!!, Plz Check !!!") {
        res.status(400).send({ status: false, error: e.message });
    }
});

app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});