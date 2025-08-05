const UserProgress = require('@/models/playlists/userProgressModel');
const axios = require('axios');
const TranscriptList = require('@/models/notes/transcriptModel');
const { addTranscriptService, getTranscriptService } = require('@/services/notes/transcriptService');

exports.addTranscript = async (req, res) => {
    try {
        const result = await addTranscriptService(req.body);
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};

exports.getTranscript = async (req, res) => {
    try {
        const result = await getTranscriptService(req.query);
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};