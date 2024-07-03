const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');

const User = require('./models/user')
const indexRoute = require('./routes/index');
const techyBlogRoute = require('./routes/techy-blog')
const apiRoute = require('./routes/api')

const cors = require('cors')

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

//PASSPORT LOCAL STRATEGY FOR LOGIN
passport.use(
    new LocalStrategy(asyncHandler(async (username, password, done) =>{
        const user = await User.findOne({user_name: username});
        if(!user){
            return done(null, false, {message: 'Incorrect Username. Try again.'});
        }
        const match = await bcrypt.compare(password, user.password);
        if(!match){
            //passwords do not match
            return done(null, false, {message: 'Incorrect Password'});
        }
        return done(null, user)
    }))
)

passport.serializeUser((user,done)=> {
    done(null,user.id);
});

passport.deserializeUser(asyncHandler(async (id, done)=>{
    const user = await User.findById(id);
    done(null, user);
}))


//MIDDLEWARES (MAIN)
app.use(express.urlencoded({extended: false}))
app.use(express.json());
app.use(cors());

//MIDDLEWARES (PASSPORT AND EXPRESS SESSION)
app.use(session({ secret: process.env.SECRET, resave: false, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());


//saving the current user data
app.use((req,res,next) => {
    res.locals.currentUser = req.user;
    next();
})

//ROUTES
app.use('/', indexRoute)
app.use('/techy-blog/api', apiRoute)
app.use('/techy-blog', techyBlogRoute)

//PORT CONNECT
const port = process.env.PORT || 3000 ;
app.listen(port,'0.0.0.0',() => console.log(`server running on port ${port}`))