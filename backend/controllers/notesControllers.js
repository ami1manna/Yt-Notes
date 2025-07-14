const UserPlaylist = require('../models/playlists/userPlaylistModel');

exports.addNoteToVideo = async (req, res) => {
    try {
        const { userEmail, playlistId, videoId, text } = req.body;
        
        // Find the user's playlist
        const userPlaylist = await UserPlaylist.findOne({ userEmail });
        if (!userPlaylist) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Find the playlist
        const playlist = userPlaylist.playlists.get(playlistId);

        if (!playlist) {
            return res.status(404).json({ error: 'Playlist not found' });
        }

        // get VideoId
        const video = playlist.videos.get(videoId);

        // Update the notes for the video
        video.notes = text; 

        // Save the updated user playlist
        await userPlaylist.save();
        
        
        res.status(201).json({ message: 'Note added successfully', notes: video.notes });
    } catch (error) {
        res.status(400).json({ error: error.message });
        console.log(error);
    }
};

exports.getNotesForVideo = async (req, res) => {
    try {
        const { userEmail, playlistId, videoId } = req.body;

        // Find the user's playlist document
        const userPlaylist = await UserPlaylist.findOne({ userEmail });
        if (!userPlaylist) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Get the playlist from the Map
        const playlist = userPlaylist.playlists.get(playlistId);
        if (!playlist) {
            return res.status(404).json({ error: 'Playlist not found' });
        }

        // Get the video from the Map
        const video = playlist.videos.get(videoId);
        if (!video) {
            return res.status(404).json({ error: 'Video not found' });
        }
        

        res.status(200).json({ notes: video.notes });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteNoteFromVideo = async (req, res) => {
    try {
        const { userEmail, playlistId, videoId } = req.body;

        // Find the user's playlist document
        const userPlaylist = await UserPlaylist.findOne({ userEmail });
        if (!userPlaylist) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Get the playlist from the Map
        const playlist = userPlaylist.playlists.get(playlistId);
        if (!playlist) {
            return res.status(404).json({ error: 'Playlist not found' });
        }

        // Get the video from the Map
        const video = playlist.videos.get(videoId);
        if (!video) {
            return res.status(404).json({ error: 'Video not found' });
        }

        // Clear the notes
        video.notes = "";  

        // Save the updated document
        await userPlaylist.save();

        res.status(200).json({ message: 'All notes deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
