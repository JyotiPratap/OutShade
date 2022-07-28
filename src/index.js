require("dotenv").config();
const express = require('express');
var bodyParser = require('body-parser');
const route = require('./routes/route.js');
const cookie=require('cookie-parser');
const multer=require('multer');
const mongoose = require("mongoose")


const app = express();
app.use(bodyParser.json());
app.use(multer().any())
app.use(cookie())
app.use('/', route);

mongoose.connect("mongodb+srv://rubygupta7505:GDDYMfHDEGehjUj0@cluster0.xf64f.mongodb.net/Jyoti2" )
    .then(() => console.log('mongodb is connected'))
    .catch(err => console.log(err))


app.listen(3000, function(){
    console.log('Express is running on port 3000');
})