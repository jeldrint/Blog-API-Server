const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Post = require('../models/post')


router.get('/', asyncHandler(async (req,res) => {
    const posts = await Post.find().populate('userId').populate('userIdUpdated').exec();
    res.json({
        user: res.locals.currentUser,
        posts: posts
    })
}))


router.post('/login', asyncHandler(async (req,res) =>{
/*     res.json({
        
    })
 */}))

module.exports = router;