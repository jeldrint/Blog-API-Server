const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Post = require('../models/post')
const passport = require('passport')
const bcrypt = require('bcryptjs')

const User = require('../models/user')
require('dotenv').config();
const {body, validationResult} = require('express-validator');


//MAIN PAGE DISPLAY FOR PUBLIC / NOT LOGGED ACCOUNTS
router.get('/', asyncHandler(async (req,res) => {
    const posts = await Post.find().populate('userId').populate('userIdUpdated').exec();
    return res.json({
        user: req.user,
        posts: posts
    })
}))

//LOG-IN
router.post('/log-in', (req,res,next) => {
    passport.authenticate('local', (err,authUser,info,status)=> {
        if(err){
            console.log('internal error ',err)
            return next(err)
        }
        if(!authUser){
            return res.json({
                status: 'log in failed',
            }) 
        }else{
            req.logIn(authUser, (err)=>{
                if(err){
                    return res.json(err)
                }else{
                    return res.json({
                        status: 'logged in',
                        message: 'Logged in successfully'
                    })            
                }
            })
        }
    })(req,res)
})

//LOG-OUT
router.get('/log-out',(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err)
        }
    })
    return res.json({
        status: 'logged out',
        message: 'Logged out successfully'
    })
})

// FOR SIGN UP
router.post('/sign-up',[
    body('firstname')
        .trim().isLength({min: 1}).escape().withMessage('First name is empty')
        .matches(/^[a-zA-Z ]*$/)
        .withMessage('First Name must consist of alphabet letters only'),
    body('lastname')
        .trim().isLength({min: 1}).escape().withMessage('Family name is empty')
        .matches(/^[a-zA-Z ]*$/)
        .withMessage('Last Name must consist of alphabet letters only'),
    body('username')
        .trim().isLength({min: 7}).escape()
        .withMessage('User Name must be 7 characters long')
        .custom(async value => {
            const user = await User.findOne({user_name: value}).exec()
            if (user){
                throw new Error('User Name already exists')
            }
        }),
    body('password')
        .trim().isLength({min: 8}).escape()
        .withMessage('Password must be 8 characters long'),
    body('confirm-password')
        .custom((value, {req}) => value === req.body.password)
        .withMessage('Password does not match'),

    asyncHandler(async (req,res,next) =>{
        const errors= validationResult(req);

        const user = new User({
            first_name: req.body.firstname,
            family_name: req.body.lastname,
            user_name: req.body.username,
        })

        if(!errors.isEmpty()){
            return res.json({
                errors: errors.array()
            })
        }else{
            req.body.admincode === process.env.ADMIN_CODE ? user.isAdmin = true : user.isAdmin = false;
    
            bcrypt.hash(req.body.password, 10, async (err, hashedPw) => {
                if(err){
                    return err
                }else{
                    user.password = hashedPw;
                    await user.save();
                    res.json({
                        successMessage: 'Signed up sucessfully!'
                    })
                }
            })
        }
    })
])


// WRITING POST (ADMIN)
router.post('/write-post', [
    body('title').isLength({max: 200})
        .withMessage('Character for title exceeded the limit (200)'),
    body('message').isLength({max: 7000})
        .withMessage('Character for your message exceeded the limit (7000 characters)'),
    
    asyncHandler(async (req,res)=> {
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.json({
                errors: errors.array()
            })
        }else{
            const post = new Post({
                title: req.body.title,
                timestamp: Date.now(),
                body: req.body.message,
                userId: req.user._id
            })
            await post.save();
            return res.json({
                success: 'Post is successfully written!'
            })    
        }
    })
])

// UPDATE POST (ADMIN)
router.post('/update-post', [
    body('title').isLength({max: 200})
        .withMessage('Character for title exceeded the limit (200)'),
    body('message').isLength({max: 7000})
        .withMessage('Character for your message exceeded the limit (7000 characters)'),
    
    asyncHandler(async (req,res)=> {
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.json({
                errors: errors.array()
            })
        }else{
            const post = new Post({
                title: req.body.title,
                timestamp: Date.now(),
                body: req.body.message,
                userId: req.user._id
            })
            await post.save();
            return res.json({
                success: 'Post is successfully written!'
            })    
        }
    })
])


module.exports = router;