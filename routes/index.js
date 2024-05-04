const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const {body, validationResult} = require('express-validator');

const User = require('../models/user')


router.get('/', (req,res) => {
    res.redirect('/blog-api')
});

router.get('/blog-api', (req,res) => {
    res.render('index');
})

router.get('/blog-api/login', (req,res)=> {
    res.render('login', {user: res.locals.currentUser})
})



//SIGN-UP
router.get('/blog-api/sign-up', (req,res)=> {
    res.render('sign-up', {user: res.locals.currentUser})
})

router.post('/blog-api/sign-up',[
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

        console.log(errors.array())
        if(!errors.isEmpty()){
            res.render('sign-up',{
                errors: errors.array()
            })
            return;
        }else{
            bcrypt.hash(req.body.password, 10, async (err, hashedPW) => {
                if(err){
                    return err
                }else{
                    user.password = hashedPW;
                    await user.save();
                    res.redirect('/');
                }
            })
        }
    })
    
])

module.exports = router;