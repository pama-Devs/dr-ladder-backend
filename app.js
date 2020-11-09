const express = require('express');
const app = express()
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

// app.use(bodyParser.urlencoded({extended: true}));
// app.use(bodyParser.json());
app.use(bodyParser.json({ limit: 1024*1024*20, type: 'application/json' }))
app.use(bodyParser.urlencoded({extended: true, limit: 1024*1024*20}))

app.use('/uploads', express.static('uploads'));

//connecting to mongoDB
const uri = 'mongodb+srv://minhaj:' + process.env.DB_PASSWORD + '@node-api-shop.5wrjk.mongodb.net/test?retryWrites=true&w=majority';
 mongoose.connect(uri, {
          useNewUrlParser: true,
          useUnifiedTopology: true
    }, () => console.log("connected to mongodb atlas..."));


const userRouter = require('./routes/user')
const hireUsRouter = require('./routes/hire_us')

app.use(cors());

app.use('/contact-us', userRouter);
app.use('/hire-us', hireUsRouter);

module.exports = app;