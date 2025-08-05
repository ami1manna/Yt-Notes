const UserProgress = require('../../models/playlists/userProgressModel');
const User = require('../../models/users/userModel');
const { toggleVideoService } = require('../../services/video/videoService');

exports.toggleVideo = async (req, res) => {
    try {
        const result = await toggleVideoService(req.body);
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message });
    }
};
