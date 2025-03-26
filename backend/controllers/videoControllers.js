const UserPlaylist = require('../models/playlistModel');

exports.toggleVideo = async (req, res) => {
    try {
        const { userEmail, playlistId, videoId } = req.body;

        // Find the user's playlist document
        const userPlaylist = await UserPlaylist.findOne({ userEmail });

        if (!userPlaylist) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Find the playlist
        const playlist = userPlaylist.playlists.get(playlistId);
        if (!playlist) {
            return res.status(404).json({ error: 'Playlist not found' });
        }

        // Find the video
        const video = playlist.videos.get(videoId);
        if (!video) {
            return res.status(404).json({ error: 'Video not found' });
        }

        // Toggle video done state
        video.done = !video.done;

        // Update playlist progress
         playlist.playlistProgress = video.done ? playlist.playlistProgress + 1 : playlist.playlistProgress - 1;
         
        // Update sections containing the video
        for (let [sectionId, section] of playlist.sections.entries()) {
            if (section.videoIds.includes(videoId)) {
                // Update completed length based on new `video.done` state
                section.completedLength += video.done ? 1 : -1;

                // Recalculate section progress percentage
                section.progressPercentage = section.sectionLength > 0
                    ? Math.round((section.completedLength / section.sectionLength) * 100)
                    : 0;
            }
        }

        // Save the updated document
        await userPlaylist.save();

        res.status(200).json({
            message: 'Video status toggled successfully',
            video,
            playlistProgress: playlist.playlistProgress
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
