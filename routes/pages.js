const express = require('express');

const router = express.Router();

// Public Route
router.get('/', (req, res) =>    {
    res.status(200).render('index') 
});

router.get('/login', (req, res) => {
    res.render('login')
});

module.exports = router;