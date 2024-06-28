const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Post = require('../models/post')
const passport = require('passport')
const bcrypt = require('bcryptjs')

const User = require('../models/user')
require('dotenv').config();
const {body, validationResult} = require('express-validator');

const Comment = require('../models/comment')

const jwt = require('jsonwebtoken')


const verifyToken = (req,res,next) => {
    const token = req.headers['authorization'].split(' ')[1];

    if(typeof token != 'undefined'){
        req.token = token;
        next();
    }else{
        res.json({
            error: '403: Error in token verification 1'
        })
    }
}

//MAIN PAGE DISPLAY FOR PUBLIC / NOT LOGGED ACCOUNTS
router.get('/', asyncHandler(async (req,res) => {
    const posts = await Post.find().populate('userId').populate('userIdUpdated').sort({timestamp: -1}).exec();
    const comments = await Comment.find().populate('userId').populate('postId', 'id title').exec();
    return res.json({
        user: req.user,
        posts: posts,
        comments: comments
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
                    jwt.sign({authUser}, process.env.JWT_SECRET, (err,token) =>{
                        if(err){
                            return res.json({
                                error: err,
                            })
                        }else{
                            return res.json({
                                status: 'logged in',
                                message: 'Logged in successfully',
                                token,
                            })
                        }
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
        .withMessage('Character for your message exceeded the limit (7000 characters)')],
    verifyToken,
    
    asyncHandler(async (req,res)=> {
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.json({
                errors: errors.array()
            })
        }else{
            jwt.verify(req.token, process.env.JWT_SECRET, async (err,authData)=> {
                if(err){
                    return res.json({
                        error: err,
                        message: 'error in jwt (Write Post)'
                    })
                }else{
                    const post = new Post({
                        title: req.body.title,
                        timestamp: Date.now(),
                        body: req.body.message,
                        userId: req.body.userId
                    })
                    await post.save();
                    return res.json({
                        success: 'Post is successfully written!',
                        authData
                    })
                
                }
            })
        }
    })
)

// UPDATE POST (ADMIN)
router.post('/update-post', [
    body('title').isLength({max: 200})
        .withMessage('Character for title exceeded the limit (200)'),
    body('message').isLength({max: 7000})
        .withMessage('Character for your message exceeded the limit (7000 characters)'),
    verifyToken,
    
    asyncHandler(async (req,res)=> {
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.json({
                errors: errors.array()
            })
        }else{
            jwt.verify(req.token, process.env.JWT_SECRET, async (err,authData)=> {
                if(err){
                    return res.json({
                        error: err,
                        message: 'error in jwt (Update Post)'
                    })
                }else{
                    await Post.updateOne({_id: req.body.postId}, {$set:{
                        title: req.body.title,
                        body: req.body.message,
                        isUpdated: true,
                        updatedTimestamp: Date.now(),
                        userIdUpdated: req.body.userId
                    }}) 
                    return res.json({
                        success: 'Post is successfully updated!',
                        authData
                    })
                
                }
            })
        }
    })
])

// DELETE POST (ADMIN)
router.post('/delete-post', verifyToken, asyncHandler(async (req,res) => {
    try{
        jwt.verify(req.token, process.env.JWT_SECRET, async (err,authData)=> {
            if(err){
                return res.json({
                    error: err,
                    message: 'error in jwt (Delete Post)'
                })
            }else{
                await Post.findByIdAndDelete(req.body.postId)
                return res.json({
                    success: 'Post is successfully deleted!',
                    authData
                })
            
            }
        })
    }catch(err){
        return res.json({
            error: 'Error in deleting this post!'
        })
    }

}))

// COMMENTS (ADMIN)
router.post('/comments', [
    body('comment').isLength({max: 1000})
        .withMessage('Character for title exceeded the limit (1000)'),
    verifyToken,
    asyncHandler(async (req,res)=> {
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.json({
                errors: errors.array()
            })
        }else{
            jwt.verify(req.token, process.env.JWT_SECRET, async (err,authData)=> {
                if(err){
                    return res.json({
                        error: err,
                        message: 'error in jwt (Writing a Comment)'
                    })
                }else{
                    const comment = new Comment({
                        comment: req.body.comment,
                        timestamp: req.body.timestamp,
                        userId: req.body.userId,
                        postId: req.body.postId
                    })
                    await comment.save();
                    return res.json({
                        success: 'Commented successfully!',
                        authData
                    })            
                }
            })
        }
    })
])

//DELETE COMMENTS (ADMIN)
router.post('/delete-comment', verifyToken, asyncHandler(async (req,res) => {
    try{
        jwt.verify(req.token, process.env.JWT_SECRET, async (err,authData)=> {
            if(err){
                return res.json({
                    error: err,
                    message: 'error in jwt (Deleting a Comment)'
                })
            }else{
                const deletedComment = await Comment.findByIdAndDelete(req.body.commentId);
                if(deletedComment){
                    return res.json({
                        success: 'Comment is successfully deleted!',
                        authData
                    })
                }else{
                    return res.json({
                        errorMsg: 'There were no deleted comments',
                        authData
                    })
                }
            }
        })
    }catch(err){
        return res.json({
            error: 'Error in deleting this comment!'
        })
    }
}))


//SET POST TO BE PUBLISHED/ UNPUBLISHED
router.post('/publish-post', verifyToken, asyncHandler(async (req,res)=> {
    const errors = validationResult(req);
    //console.log(req.body)

    if(!errors.isEmpty()){
        return res.json({
            errors: errors.array()
        })
    }else{
        jwt.verify(req.token, process.env.JWT_SECRET, async (err,authData)=> {
            if(err){
                res.json({
                    error: err,
                    message: 'error in jwt (Publish Post)'
                })
            }else{
                await Post.updateOne({_id: req.body.postId}, {$set:{
                    isPublished: req.body.isPostPublished,
                }}) 
                return res.json({
                    success: 'Post is successfully updated!',
                    authData
                })    
            
            }
        })
    }
}))

module.exports = router;