// Transcript service logic

const UserProgress = require('../../models/playlists/userProgressModel');
const axios = require('axios');
const TranscriptList = require('../../models/notes/transcriptModel');

exports.addTranscriptService = async ({ videoId }) => {
  if (!videoId) throw { status: 400, message: 'Missing required fields' };
  // Check if transcript already exists
  const existingTranscript = await TranscriptList.findOne({ videoId });
  if (existingTranscript) {
    return { message: 'Transcript already exists', existingTranscript };
  }
  // Fetch transcript from external API
  const options = {
    method: 'GET',
    url: 'https://youtube-video-summarizer-gpt-ai.p.rapidapi.com/api/v1/get-transcript-v2',
    params: { video_id: videoId, platform: 'youtube' },
    headers: {
      'x-rapidapi-key': process.env.RAPIDAPI_KEY,
      'x-rapidapi-host': 'youtube-video-summarizer-gpt-ai.p.rapidapi.com'
    }
  };
  const response = await axios.request(options);
  const transcriptsData = response.data?.data?.transcripts || {};
  const transcriptKey = Object.keys(transcriptsData)[0];
  if (!transcriptKey) throw { status: 404, message: 'Transcript not available in any language' };
  const customTranscript = transcriptsData[transcriptKey]?.custom;
  if (!customTranscript || customTranscript.length === 0) {
    throw { status: 404, message: 'Custom transcript not found' };
  }
  // Save the transcript to the database
  const transcript = new TranscriptList({ videoId, transcript: customTranscript });
  await transcript.save();
  return { message: 'Transcript added successfully', transcript: customTranscript };
};

exports.getTranscriptService = async ({ videoId }) => {
  const transcript = await TranscriptList.findOne({ videoId });
  if (!transcript) throw { status: 404, message: 'Transcript not found' };
  return { message: 'Transcript fetched successfully', transcript: transcript.transcript };
}; 