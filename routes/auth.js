const express = require('express');
const authController = require('../controllers/auth')
const router = express.Router();
// const { cookieJwTAuth } = require("../middleware/cookieJwTAuth")

router.post('/register', authController.register )
router.post('/login', authController.login )

// Private Route
// router.post("/shop", cookieJwTAuth, shop)

module.exports = router;