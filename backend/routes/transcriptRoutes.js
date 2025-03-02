const express = require('express');
const { addTranscript, getTranscript } = require('../controllers/transcriptController');
const transcriptController = require('../controllers/sumarizeController');
const router = express.Router();


router.post('/addTranscript' , addTranscript);
router.get('/getTranscript',getTranscript);
 
// Main endpoints
router.get('/summarize', transcriptController.getSummarize);
router.get('/educational-notes', transcriptController.getEducationalNotes);

// Regeneration endpoints
router.get('/regenerate-summary', transcriptController.regenerateSummary);
router.get('/regenerate-notes', transcriptController.regenerateEducationalNotes);

module.exports = router;
