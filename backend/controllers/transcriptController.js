const UserPlaylist = require('../models/playlists/userPlaylistModel');
const axios = require('axios');
const TranscriptList = require('../models/notes/transcriptModel');

exports.addTranscript = async (req, res) => {
    const {videoId} = req.body;
    if(!videoId)
        {
        return res.status(400).json({ message: 'Missing required fields' });
        }
    
    try
    {
        //  Check id transcript already Exist 
        const existingTranscript = await TranscriptList.findOne({videoId});
        
        if(existingTranscript)
        {
            return res.status(200).json({ message: 'Transcript already exists',  existingTranscript });
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
        // Get the first available language key dynamically
        const transcriptKey = Object.keys(transcriptsData)[0];
        if (!transcriptKey) {
            return res.status(404).json({ message: 'Transcript not available in any language' });
        }
        // Extract the "custom" transcript
        const customTranscript = transcriptsData[transcriptKey]?.custom;
        if (!customTranscript || customTranscript.length === 0) {
            return res.status(404).json({ message: 'Custom transcript not found' });
        }
        // Save the transcript to the database
        const transcript = new TranscriptList({ videoId, transcript: customTranscript });
        await transcript.save();
        res.status(200).json({ message: 'Transcript added successfully', transcript: customTranscript });
       
    }
    catch(error)
    {
        res.status(500).json({ message: 'Error adding transcript', error: error.message });
        

    }
}



exports.getTranscript = async (req, res) => {
    const {videoId} = req.query;
    try
    {
        const transcript = await TranscriptList.findOne({videoId});
        if(!transcript)
        {
            return res.status(404).json({ message: 'Transcript not found' });
        }
        res.status(200).json({ message: 'Transcript fetched successfully', transcript: transcript.transcript });
    }
    catch(error)
    {
        res.status(500).json({ message: 'Error fetching transcript', error: error.message });
    }
}