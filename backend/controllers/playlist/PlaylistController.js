const UserProgress = require('@/models/playlists/userProgressModel');
const axios = require('axios');
const { handleDelete, parseDuration, fetchPlaylistFromYouTube } = require('@/utils/VideoUtils');
const BasePlaylist = require('@/models/playlists/base/basePlaylistModel');
const { addPlaylistService, getPlaylistsByUserService, deletePlaylistService, selectedVideoIdService, deleteVideoService, displaySectionService, getUserPlaylistSummariesService, fetchPlaylistByIdService } = require('@/services/playlist/playlistService');
 
// Helper function to convert ISO 8601 duration (PT5M30S) to seconds
exports.addPlaylist = async (req, res) => {
  try {
    const result = await addPlaylistService(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(error.status || 400).json({ error: error.message });
  }
};


exports.getPlaylistsByUser = async (req, res) => {
  try {
    const result = await getPlaylistsByUserService(req.body);
    res.json(result);
  } catch (error) {
    res.status(error.status || 400).json({ error: error.message });
  }
};

exports.deletePlaylist = async (req, res) => {
  try {
    const result = await deletePlaylistService(req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.status || 400).json({ error: error.message });
  }
};

exports.selectedVideoId = async (req, res) => {
  try {
    const result = await selectedVideoIdService(req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

exports.deleteVideo = async (req, res) => {
  try {
    const result = await deleteVideoService(req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

exports.displaySection = async (req, res) => {
  try {
    const result = await displaySectionService(req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

// Get summarized playlist info for a user (for CourseScreen)
exports.getUserPlaylistSummaries = async (req, res) => {
  try {
    const result = await getUserPlaylistSummariesService(req.body);
    res.json(result);
  } catch (error) {
    res.status(error.status || 400).json({ error: error.message });
  }
};

// Fetch full playlist data for a user and playlistId
exports.fetchPlaylistById = async (req, res) => {
  try {
    const result = await fetchPlaylistByIdService(req.body);
    res.json(result);
  } catch (error) {
    res.status(error.status || 400).json({ error: error.message });
  }
};
