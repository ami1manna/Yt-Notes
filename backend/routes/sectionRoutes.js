const express = require('express');
const {arrangeVideos, deleteSectionVideo , addSectionVideo } = require('../controllers/sectionControllers');
const router = express.Router();

router.post('/arrange', arrangeVideos);
router.delete('/deleteSectionVideo' , deleteSectionVideo);
router.patch('/addSectionVideo' , addSectionVideo);

module.exports = router;