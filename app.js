const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const session = require('express-session');

const indexRoute = require('./routes/index')

//ENV
require('dotenv').config();

//MONGODB
const mongoDb = process.env.URI;
mongoose.connect(mongoDb, {dbName: 'blog_API'});
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


//saving the current user data
app.use((req,res,next) => {
    res.locals.currentUser = req.user;
    next();
})

//ROUTES
app.use('/', indexRoute)

//PORT CONNECT
const port = process.env.PORT || 3000 ;
app.listen(port,'0.0.0.0',() => console.log(`server running on port ${port}`))