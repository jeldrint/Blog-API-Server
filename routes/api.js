const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Post = require('../models/post')

const passport = require('passport')
const User = require('../models/user')

//MAIN PAGE DISPLAY FOR PUBLIC / NOT LOGGED ACCOUNTS
router.get('/', asyncHandler(async (req,res) => {
    const posts = await Post.find().populate('userId').populate('userIdUpdated').exec();
    res.json({
        user: res.locals.currentUser,
        posts: posts
    })
}))

//LOG-IN
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

module.exports = router;