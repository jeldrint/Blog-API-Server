const express = require('express');

const router = express.Router();

router.get('/', (req,res) => {
    res.redirect('/blog-api')
});

router.get('/blog-api', (req,res) => {
    res.render('index', {user: res.locals.currentUser});
})



module.exports = router;