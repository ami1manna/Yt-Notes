// Summarize service logic

const NotesModel = require('../../models/notes/NotesModel');
const { generateEducationalNotes } = require('../../utils/EducationNotesUtils');
const TranscriptList = require('../../models/notes/transcriptModel');

const formatTimestampForDisplay = (seconds) => {
  if (typeof seconds !== 'number' || isNaN(seconds) || seconds < 0) {
    return 'Unknown';
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

exports.getEducationalNotesService = async ({ videoId }) => {
  try {
    console.log('getEducationalNotesService called with videoId:', videoId);
    
    if (!videoId) throw { status: 400, message: 'Video ID is required' };
    
    // Check if notes exist in DB
    let notes = await NotesModel.findOne({ videoId });
    if (notes) {
      console.log('Notes found in database for videoId:', videoId);
      return {
        success: true,
        message: 'Notes retrieved successfully',
        notes,
        fromDatabase: true
      };
    }
    
    console.log('No notes found in database, fetching transcript...');
    
    // Fetch transcript if notes are not found
    const transcriptData = await TranscriptList.findOne({ videoId });
    if (!transcriptData || !Array.isArray(transcriptData.transcript) || !transcriptData.transcript.length) {
      console.log('Transcript not found for videoId:', videoId);
      throw { status: 404, message: 'Transcript not found or invalid for this video' };
    }
    
    console.log('Transcript found, generating notes with AI...');
    
    // Generate notes using AI
    const generatedNotes = await generateEducationalNotes(transcriptData.transcript);
    if (!generatedNotes) {
      console.log('Failed to generate notes from transcript');
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
    
    console.log('Notes generated successfully, storing in database...');
    
    // Store new notes in DB
    notes = await NotesModel.create({
      videoId,
      ...generatedNotes,
      createdAt: new Date()
    });
    
    console.log('Notes stored in database successfully');
    
    return {
      success: true,
      message: 'Notes generated and stored successfully',
      notes,
      fromDatabase: false
    };
  } catch (error) {
    console.error('Error in getEducationalNotesService:', error);
    throw error;
  }
}; 