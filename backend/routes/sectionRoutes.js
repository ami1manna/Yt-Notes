const express = require('express');
const {arrangeVideos  } = require('../controllers/sectionControllers');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(protect);

router.post('/arrange', arrangeVideos);
// router.delete('/deleteSectionVideo' , deleteSectionVideo);
// router.patch('/addSectionVideo' , addSectionVideo);

module.exports = router;