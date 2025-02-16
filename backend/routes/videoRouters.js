const express = require('express');
const { toggleVideo } = require('../controllers/videoControllers');
const router = express.Router();
router.put('/toggle', toggleVideo); // Add a note

module.exports = router;
