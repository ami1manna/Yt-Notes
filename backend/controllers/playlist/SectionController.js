const mongoose = require('mongoose');
const UserProgress = require('../../models/playlists/userProgressModel');
const User = require('../../models/users/userModel');
const { genAIModel } = require('../../genAi/AiModel');
const { handleDelete, checkEmpty, fetchVideoDetails, handleAddSectionVideo } = require('../../utils/VideoUtils');
const BasePlaylist = require('../../models/playlists/base/basePlaylistModel');
const { arrangeVideosService } = require('../../services/section/sectionService');

exports.arrangeVideos = async (req, res) => {
  try {
    const result = await arrangeVideosService(req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

