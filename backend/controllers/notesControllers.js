const UserPlaylist = require('../models/playlistModel');

exports.addNoteToVideo = async (req, res) => {
    try {
        const { userEmail, playlistId, sectionId, videoId, text } = req.body;

        // Find the user's playlist
        const userPlaylist = await UserPlaylist.findOne({ userEmail });
        if (!userPlaylist) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Find the playlist
        const playlist = userPlaylist.playlists.find(pl => pl.playlistId === playlistId);
        if (!playlist) {
            return res.status(404).json({ error: 'Playlist not found' });
        }

        // Find the section
        const section = playlist.sections[sectionId];
        if (!section) {
            return res.status(404).json({ error: 'Section not found' });
        }

        // Find the video within the section
        const video = section.videos.find(v => v.videoId === videoId);
        if (!video) {
            return res.status(404).json({ error: 'Video not found in the given section' });
        }

        // Update the notes for the video
        video.notes = text; // Replace or update the note

        // Save the updated user playlist
        await userPlaylist.save();

        res.status(201).json({ message: 'Note added successfully', notes: video.notes });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getNotesForVideo = async (req, res) => {
    try {
        const { userEmail, playlistId, videoId } = req.params;

        // Find the user's playlist
        const userPlaylist = await UserPlaylist.findOne({ userEmail });
        if (!userPlaylist) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Find the playlist
        const playlist = userPlaylist.playlists.find(pl => pl.playlistId === playlistId);
        if (!playlist) {
            return res.status(404).json({ error: 'Playlist not found' });
        }

        // Find the video
        const video = playlist.videos.find(v => v.videoId === videoId);
        if (!video) {
            return res.status(404).json({ error: 'Video not found' });
        }

        res.status(200).json({ notes: video.notes });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteNoteFromVideo = async (req, res) => {
    try {
        const { userEmail, playlistId, videoId } = req.body;

        // Find the user's playlist
        const userPlaylist = await UserPlaylist.findOne({ userEmail });
        if (!userPlaylist) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Find the playlist
        const playlist = userPlaylist.playlists.find(pl => pl.playlistId === playlistId);
        if (!playlist) {
            return res.status(404).json({ error: 'Playlist not found' });
        }

        // Find the video
        const video = playlist.videos.find(v => v.videoId === videoId);
        if (!video) {
            return res.status(404).json({ error: 'Video not found' });
        }

        // Clear the notes (since it's a single string)
        video.notes = " ";

        // Save the updated user playlist
        await userPlaylist.save();

        res.status(200).json({ message: 'All notes deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
