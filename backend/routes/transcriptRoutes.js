const express = require('express');
const { addTranscript, getTranscript } = require('../controllers/notes/TranscriptController');
const transcriptController = require('../controllers/notes/SumarizeController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(protect);
router.post('/addTranscript' , addTranscript);
router.get('/getTranscript',getTranscript);
 
// Main endpoints
// router.get('/summarize', transcriptController.getSummarize);
router.get('/educational-notes', transcriptController.getEducationalNotes);

// Regeneration endpoints
// router.get('/regenerate-summary', transcriptController.regenerateSummary);
// router.get('/regenerate-notes', transcriptController.regenerateEducationalNotes);

module.exports = router;
