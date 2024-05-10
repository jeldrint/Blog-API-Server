const express = require('express');
const router = express.Router();

router.get('/', (req,res) => {
    res.redirect('/techy-blog')
});

module.exports = router;