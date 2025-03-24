const express = require('express');
const {arrangeVideos } = require('../controllers/sectionControllers');
const router = express.Router();

router.post('/arrange', arrangeVideos);

module.exports = router;