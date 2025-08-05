const express = require('express');
const { searchUsersByUsername } = require('../controllers/user/UserController');
const router = express.Router();



router.get('/search', searchUsersByUsername);

module.exports = router;
