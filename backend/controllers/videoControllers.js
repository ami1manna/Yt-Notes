const UserProgress = require('../models/playlists/userProgressModel');
const User = require('../models/users/userModel');

exports.toggleVideo = async (req, res) => {
    try {
        const { userId, playlistId, videoId } = req.body;

        // NOTE: In production, always verify req.body.userId matches the authenticated user.

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

        // Toggle video done state
        videoStatus.done = !videoStatus.done;
        userProgress.videoStatus.set(videoId, videoStatus);

        // Update playlist progress (recalculate percentage)
        const totalVideos = userProgress.videoStatus.size;
        const completedVideos = Array.from(userProgress.videoStatus.values()).filter(v => v.done).length;
        userProgress.playlistProgress = totalVideos > 0 ? Math.round((completedVideos / totalVideos) * 100) : 0;

        // Save the updated document
        await userProgress.save();

        res.status(200).json({
            message: 'Video status toggled successfully',
            videoStatus,
            playlistProgress: userProgress.playlistProgress
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
