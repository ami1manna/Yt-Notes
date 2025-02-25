const UserPlaylist = require('../models/playlistModel');
const axios = require('axios');
const TranscriptList = require('../models/transcriptModel');

exports.postCustomTranscript = async (req, res) => {
    const { videoId, email, playlistId } = req.body;

    if (!videoId || !email || !playlistId) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        // Check if transcript already exists
        const existingUser = await UserPlaylist.findOne(
            { userEmail: email, 'playlists.playlistId': playlistId, 'playlists.videos.videoId': videoId },
            { 'playlists.$': 1 }
        );

        if (existingUser) {
            const existingTranscript = existingUser.playlists[0]?.videos.find(v => v.videoId === videoId)?.transcript;
            if (existingTranscript && existingTranscript.length > 0) {
                return res.status(200).json({ message: 'Transcript already exists', transcript: existingTranscript });
            }
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

        // Update the video transcript in the user's playlist
        const user = await UserPlaylist.findOneAndUpdate(
            { userEmail: email, 'playlists.playlistId': playlistId, 'playlists.videos.videoId': videoId },
            { $set: { 'playlists.$.videos.$[v].transcript': customTranscript } },
            { arrayFilters: [{ 'v.videoId': videoId }], new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User, playlist, or video not found' });
        }

        res.json({ message: 'Transcript added successfully', transcript: customTranscript });

    } catch (error) {
        console.error('Error fetching transcript:', error);
        res.status(500).json({ message: 'Error fetching transcript', error: error.message });
    }
};


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
            return res.status(200).json({ message: 'Transcript already exists', transcript: existingTranscript });
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
