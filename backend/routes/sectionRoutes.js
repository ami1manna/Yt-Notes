const express = require('express');
const {rearrangePlaylistIntoSections } = require('../controllers/sectionControllers');
const router = express.Router();

router.post('/arrange', rearrangePlaylistIntoSections);

module.exports = router;