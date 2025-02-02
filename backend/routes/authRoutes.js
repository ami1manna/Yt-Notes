// authRoutes.js
const express = require('express');
const { signup, login } = require('../controllers/authControllers');
const authMiddleware = require('../middleware/authMiddleware');


const router = express.Router();
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.get('/protected', authMiddleware, (req, res) => res.json({ message: 'Protected Data', user: req.user }));

module.exports = router;