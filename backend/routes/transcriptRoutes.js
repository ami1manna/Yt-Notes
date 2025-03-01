const express = require('express');
const { addTranscript, getTranscript } = require('../controllers/transcriptController');
const router = express.Router();


router.post('/addTranscript' , addTranscript);
router.get('/getTranscript',getTranscript);
 
module.exports = router;
