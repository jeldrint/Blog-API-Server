const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const session = require('express-session');

//ENV
require('dotenv').config();

//MONGODB
const mongoDb = process.env.URI;
mongoose.connect(mongoDb);
const db = mongoose.connection;
db.on('error',console.error.bind(console, 'mongoDB connection error'));

//VIEWS AND EJS
const app = express();
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

//MIDDLEWARES (MAIN)
app.use(express.urlencoded({extended: false}))
app.use(express.json());

//MIDDLEWARES (PASSPORT AND EXPRESS SESSION)
app.use(session({ secret: process.env.SECRET, resave: false, saveUninitialized: true}));


//PORT CONNECT
const port = process.env.PORT || 3000 ;
app.listen(port,'0.0.0.0',() => console.log(`server running on port ${port}`))