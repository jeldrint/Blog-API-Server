const express = require('express');
const router = express.Router();
require('dotenv').config();
const passport = require('passport');

const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const {body, validationResult} = require('express-validator');

const User = require('../models/user')
const Post = require('../models/post')

//MAIN PAGE DISPLAY FOR PUBLIC / NOT LOGGED ACCOUNTS
router.get('/', asyncHandler(async (req,res) => {
    const posts = await Post.find().populate('userId').populate('userIdUpdated').exec();
    res.render('techy-blog', {
        user: res.locals.currentUser,
        posts: posts
    })
}))

//LOG-IN
router.get('/log-in', (req,res)=> {
    res.render('log-in', {user: res.locals.currentUser})
})

router.post('/log-in',
    passport.authenticate('local', {
        failureRedirect: '/techy-blog/log-in',
    }), (req,res) => {
        const user = new User({
            _id: req.user._id,
            user_name: req.user.user_name
        })
        res.redirect(user.url);
    }
)

//LOG-OUT
router.get('/log-out',(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err)
        }
    })
    res.redirect('/')
})

// FOR SIGN UP
router.get('/sign-up', (req,res)=> {
    res.render('sign-up')
})

router.post('/sign-up',[
    body('firstname')
        .trim().isLength({min: 1}).escape().withMessage('First name is empty')
        .matches(/[a-zA-Z][a-zA-Z ]+/)
        .withMessage('Name must be alphabet letters'),
    body('lastname')
        .trim().isLength({min: 1}).escape().withMessage('Family name is empty')
        .matches(/[a-zA-Z][a-zA-Z ]+/)
        .withMessage('Name must be alphabet letters'),
    body('username')
        .trim().isLength({min: 1}).escape()
        .withMessage('Username cannot be empty'),
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
            res.render('sign-up',{
                errors: errors.array()
            })
            return;
        }else{
            req.body.admincode === process.env.ADMIN_CODE ? user.isAdmin = true : user.isAdmin = false;
    
            bcrypt.hash(req.body.password, 10, async (err, hashedPw) => {
                if(err){
                    return err
                }else{
                    user.password = hashedPw;
                    await user.save();
                    res.redirect('/');
                }
            })
        }
    })    
])

// WRITING POST (BLOG AUTHOR)
router.get('/:user/write-post', (req,res)=> {
    res.render('post-write', {user: res.locals.currentUser})
})

router.post('/:user/write-post', asyncHandler(async (req,res)=> {
    const post = new Post({
        title: req.body.title,
        timestamp: Date.now(),
        body: req.body.message,
        userId: res.locals.currentUser._id
    })
    await post.save();
    res.redirect(req.user.url)
}))

// UPDATE POST
router.get('/:user/update-post/:postId', asyncHandler(async (req,res) =>{
    const post = await Post.findById(req.params.postId).exec();
    res.render('post-update', {
        post: post,
        err: ''
    })
}))

router.post('/:user/update-post/:postId', [
    body('title').isLength({max: 500})
        .withMessage('Character for title exceeded the limit'),
    body('message').isLength({max: 7000})
        .withMessage('Character for your message exceeded the limit (7000 characters)'),
    asyncHandler(async(req,res)=>{
        const err = validationResult(req);
        if((Object.entries(req.body)[2][0]) === 'cancel-btn'){
            res.redirect(req.user.url);
        }
        if((Object.entries(req.body)[2][0]) === 'update-btn'){
            if(!err.isEmpty()){
                res.render('post-update',{
                    err: err.array(),
                    postLength: Object.keys(req.body.message).length
                })
                return;
            }else{
                await Post.updateOne({_id: req.params.id}, {$set:{
                    title: req.body.title,
                    body: req.body.message,
                    isUpdated: true,
                    updatedTimestamp: Date.now(),
                    userIdUpdated: res.locals.currentUser._id
                }}) 
                res.redirect(req.user.url);    
            }
        }
    })
])

// DELETE POST
router.get('/:user/delete-post/:postId', (req,res) =>{
    res.render('post-delete', {user: res.locals.currentUser})
})

router.post('/:user/delete-post/:postId', asyncHandler(async (req,res) => {
    if((Object.entries(req.body)[0][0]) === 'yes-btn'){
        await Post.findByIdAndDelete(req.params.postId)
        res.redirect(req.user.url);
   }
   if((Object.entries(req.body)[0][0]) === 'no-btn'){
        res.redirect(req.user.url);
   }
}))

//MAIN PAGE DISPLAY FOR LOGGED ACCOUNTS
router.get('/:user', asyncHandler (async (req,res)=> {
    const posts = await Post.find().populate('userId').populate('userIdUpdated').exec();
    res.render('techy-blog', {
        user: res.locals.currentUser,
        posts: posts
    })

}))

module.exports = router;