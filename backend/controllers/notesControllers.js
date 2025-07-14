const UserProgress = require('../models/playlists/userProgressModel');
const User = require('../models/users/userModel');

exports.addNoteToVideo = async (req, res) => {
    try {
        const { userId, playlistId, videoId, text } = req.body;
        // Find the user's progress document for this playlist
        const userProgress = await UserProgress.findOne({ userId, playlistId });
        if (!userProgress) {
            return res.status(404).json({ error: 'User progress not found' });
        }
        // Find the video status
        const videoStatus = userProgress.videoStatus.get(videoId);
        if (!videoStatus) {
            return res.status(404).json({ error: 'Video not found in progress' });
        }
        // Update the notes for the video
        videoStatus.notes = text;
        userProgress.videoStatus.set(videoId, videoStatus);
        // Save the updated user progress
        await userProgress.save();
        res.status(201).json({ message: 'Note added successfully', notes: videoStatus.notes });
    } catch (error) {
        res.status(400).json({ error: error.message });
        console.log(error);
    }
};

exports.getNotesForVideo = async (req, res) => {
    try {
        const { userId, playlistId, videoId } = req.body;
        // Find the user's progress document for this playlist
        const userProgress = await UserProgress.findOne({ userId, playlistId });
        if (!userProgress) {
            return res.status(404).json({ error: 'User progress not found' });
        }
        // Find the video status
        const videoStatus = userProgress.videoStatus.get(videoId);
        if (!videoStatus) {
            return res.status(404).json({ error: 'Video not found in progress' });
        }
        res.status(200).json({ notes: videoStatus.notes });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteNoteFromVideo = async (req, res) => {
    try {
        const { userId, playlistId, videoId } = req.body;
        // Find the user's progress document for this playlist
        const userProgress = await UserProgress.findOne({ userId, playlistId });
        if (!userProgress) {
            return res.status(404).json({ error: 'User progress not found' });
        }
        // Find the video status
        const videoStatus = userProgress.videoStatus.get(videoId);
        if (!videoStatus) {
            return res.status(404).json({ error: 'Video not found in progress' });
        }
        // Clear the notes
        videoStatus.notes = "";
        userProgress.videoStatus.set(videoId, videoStatus);
        // Save the updated document
        await userProgress.save();
        res.status(200).json({ message: 'All notes deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
