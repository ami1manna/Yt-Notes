const NotesModel = require('../models/notes/NotesModel');
const { generateEducationalNotes } = require('./utils');
const TranscriptList = require('../models/notes/transcriptModel');

exports.getEducationalNotes = async (req, res) => {
  const { videoId } = req.query;
  
  if (!videoId) {
    return res.status(400).json({ success: false, message: 'Video ID is required' });
  }
  
  try {
    // Check if notes exist in DB
    let notes = await NotesModel.findOne({ videoId });
    
    if (notes) {
      return res.json({ 
        success: true, 
        message: 'Notes retrieved successfully', 
        notes, 
        fromDatabase: true 
      });
    }
    
    // Fetch transcript if notes are not found
    const transcriptData = await TranscriptList.findOne({ videoId });
    
    if (!transcriptData || !Array.isArray(transcriptData.transcript) || !transcriptData.transcript.length) {
      return res.status(404).json({ 
        success: false, 
        message: 'Transcript not found or invalid for this video' 
      });
    }
    
    // Generate notes using AI
    const generatedNotes = await generateEducationalNotes(transcriptData.transcript);
    
    if (!generatedNotes) {
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to generate notes from transcript' 
      });
    }
    
    // Format timestamps to be human-readable in the response
    if (generatedNotes.topics && Array.isArray(generatedNotes.topics)) {
      generatedNotes.topics.forEach(topic => {
        if (topic.startTimestamp) {
          topic.displayStartTime = formatTimestampForDisplay(topic.startTimestamp);
        }
        if (topic.endTimestamp) {
          topic.displayEndTime = formatTimestampForDisplay(topic.endTimestamp);
        }
      });
    }
    
    // Store new notes in DB
    notes = await NotesModel.create({ 
      videoId, 
      ...generatedNotes,
      createdAt: new Date() 
    });
    
    return res.json({ 
      success: true, 
      message: 'Notes generated and stored successfully', 
      notes, 
      fromDatabase: false 
    });
    
  } catch (error) {
    console.error('Error in getEducationalNotes:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error while processing educational notes', 
      error: error.message 
    });
  }
};

// Helper function to format timestamps for display
const formatTimestampForDisplay = (seconds) => {
  if (typeof seconds !== 'number' || isNaN(seconds) || seconds < 0) {
    return 'Unknown';
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};