// authRoutes.js
const express = require('express');
const { signup, login ,logout ,getMe} = require('../controllers/auth/authControllers');
const {protect} = require('../middleware/authMiddleware');


const router = express.Router();
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protect, getMe);
module.exports = router;


// auth.routes.js
 