const express = require('express');
const { toggleVideo } = require('../controllers/playlist/VideoControllers');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(protect);
router.put('/toggle', toggleVideo); // Add a note

module.exports = router;
