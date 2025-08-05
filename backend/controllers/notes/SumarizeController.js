const NotesModel = require('../../models/notes/NotesModel');
const { generateEducationalNotes } = require('../../utils/EducationNotesUtils');
const TranscriptList = require('../../models/notes/transcriptModel');
const { getEducationalNotesService } = require('../../services/notes/sumarizeService');

exports.getEducationalNotes = async (req, res) => {
  try {
    const result = await getEducationalNotesService(req.query);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Server error while processing educational notes',
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