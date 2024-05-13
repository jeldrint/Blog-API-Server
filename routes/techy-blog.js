const express = require('express');
const router = express.Router();
require('dotenv').config();

const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const {body, validationResult} = require('express-validator');

const User = require('../models/user')
const Post = require('../models/post')

//MAIN PAGE DISPLAY FOR PUBLIC / NOT LOGGED ACCOUNTS
router.get('/', asyncHandler(async (req,res) => {
    const posts = await Post.find().exec();
    console.log(posts)
    res.render('techy-blog', {
        user: res.locals.currentUser,
        posts: posts
    })
}))

router.get('/sign-up', (req,res)=> {
    res.render('sign-up')
})

router.get('/log-in', (req,res)=> {
    res.render('log-in', {user: res.locals.currentUser})
})

router.get('/log-out',(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err)
        }
    })
    res.redirect('/')
})

//MAIN PAGE DISPLAY FOR LOGGED ACCOUNTS
router.get('/:id', asyncHandler (async (req,res)=> {
    const posts = await Post.find().exec();
    console.log(posts)
    res.render('techy-blog', {
        user: res.locals.currentUser,
        posts: posts
    })
}))

// WRITING POST (BLOG AUTHOR)
router.get('/:id/write-post', (req,res)=> {
    res.render('write-post', {user: res.locals.currentUser})
})

router.post('/:id/write-post', asyncHandler(async (req,res)=> {
    console.log(res.locals.currentUser)
    const post = new Post({
        title: req.body.title,
        timestamp: Date.now(),
        body: req.body.message,
        userId: res.locals.currentUser._id
    })
    await post.save();
    res.redirect(`/techy-blog/${req.params.id}`)
}))

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

module.exports = router;