// Summarize service logic

const NotesModel = require('@/models/notes/NotesModel');
const { generateEducationalNotes } = require('@/utils/EducationNotesUtils');
const TranscriptList = require('@/models/notes/transcriptModel');

const formatTimestampForDisplay = (seconds) => {
  if (typeof seconds !== 'number' || isNaN(seconds) || seconds < 0) {
    return 'Unknown';
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

exports.getEducationalNotesService = async ({ videoId }) => {
  if (!videoId) throw { status: 400, message: 'Video ID is required' };
  // Check if notes exist in DB
  let notes = await NotesModel.findOne({ videoId });
  if (notes) {
    return {
      success: true,
      message: 'Notes retrieved successfully',
      notes,
      fromDatabase: true
    };
  }
  // Fetch transcript if notes are not found
  const transcriptData = await TranscriptList.findOne({ videoId });
  if (!transcriptData || !Array.isArray(transcriptData.transcript) || !transcriptData.transcript.length) {
    throw { status: 404, message: 'Transcript not found or invalid for this video' };
  }
  // Generate notes using AI
  const generatedNotes = await generateEducationalNotes(transcriptData.transcript);
  if (!generatedNotes) {
    throw { status: 500, message: 'Failed to generate notes from transcript' };
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
  return {
    success: true,
    message: 'Notes generated and stored successfully',
    notes,
    fromDatabase: false
  };
}; 