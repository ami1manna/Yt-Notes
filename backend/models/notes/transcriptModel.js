const mongoose = require('mongoose');
const transcriptSchema = new mongoose.Schema({
  start: String,
  end: String,
  text: String
});


const TranscriptList = new mongoose.Schema({
  videoId: String,
  transcript: [transcriptSchema] 
});


module.exports = mongoose.model('TranscriptList', TranscriptList);
