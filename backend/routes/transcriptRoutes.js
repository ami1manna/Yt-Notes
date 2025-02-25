const express = require('express');
const { postCustomTranscript, addTranscript } = require('../controllers/transcriptController');
const router = express.Router();

router.post('/getCustomTranscript', postCustomTranscript);  
router.post('/addTranscript' , addTranscript);

module.exports = router;
