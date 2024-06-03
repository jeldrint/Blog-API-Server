const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Post = require('../models/post')
const passport = require('passport')

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


module.exports = router;