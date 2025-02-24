const express = require('express');
const { postCustomTranscript } = require('../controllers/transcriptController');
const router = express.Router();

router.post('/getCustomTranscript', postCustomTranscript);  


module.exports = router;
