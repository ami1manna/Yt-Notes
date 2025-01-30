const UserPlaylist = require('../models/playlistModel');
exports.toggleVideo = async (req, res) => {
    try {
        const { userEmail, playlistId, videoId } = req.body;
        const userPlaylist = await UserPlaylist.findOne({  userEmail });

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

        // Add the note
        video.done = !video.done;

        // Save the updated user playlist
        await userPlaylist.save();

        res.status(201).json({ message: 'Note added successfully', video });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}