const express = require('express');
const router = express.Router();

router.get('/', (req,res) => {
    res.redirect('/blog-api')
});

module.exports = router;