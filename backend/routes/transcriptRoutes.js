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

// Test endpoint for AI model
router.get('/test-ai', async (req, res) => {
  try {
    const { genAIModel } = require('../genAi/AiModel');
    const response = await genAIModel.generateContent('Hello, this is a test. Please respond with "AI is working".');
    const text = response.response.text();
    res.json({ success: true, message: 'AI test successful', response: text });
  } catch (error) {
    console.error('AI test error:', error);
    res.status(500).json({ success: false, message: 'AI test failed', error: error.message });
  }
});

// Check transcript endpoint
router.get('/check-transcript', async (req, res) => {
  try {
    const { videoId } = req.query;
    if (!videoId) {
      return res.status(400).json({ success: false, message: 'Video ID is required' });
    }
    
    const TranscriptList = require('../models/notes/transcriptModel');
    const transcript = await TranscriptList.findOne({ videoId });
    
    if (!transcript) {
      return res.status(404).json({ success: false, message: 'Transcript not found' });
    }
    
    res.json({ 
      success: true, 
      message: 'Transcript found',
      transcriptLength: transcript.transcript ? transcript.transcript.length : 0,
      hasTranscript: !!transcript.transcript && transcript.transcript.length > 0
    });
  } catch (error) {
    console.error('Check transcript error:', error);
    res.status(500).json({ success: false, message: 'Error checking transcript', error: error.message });
  }
});

// Regeneration endpoints
// router.get('/regenerate-summary', transcriptController.regenerateSummary);
// router.get('/regenerate-notes', transcriptController.regenerateEducationalNotes);

module.exports = router;
