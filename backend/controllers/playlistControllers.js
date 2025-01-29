// playlistController.js
const Playlist = require('../models/playlistModel');
const axios = require('axios');

exports.addPlaylist = async (req, res) => {
  try {
    const { userEmail, playlistId, playlistUrl } = req.body;
    
    // Fetch videos using YouTube API
    const API_KEY = process.env.YOUTUBE_API_KEY;
    const response = await axios.get(`https://www.googleapis.com/youtube/v3/playlistItems`, {
      params: {
        part: 'snippet',
        maxResults: 50,
        playlistId,
        key: API_KEY,
      },
    });
    
    const videos = response.data.items.map(item => ({
      videoId: item.snippet.resourceId.videoId,
      title: item.snippet.title,
      channelTitle: item.snippet.channelTitle,
      thumbnailUrl: item.snippet.thumbnails.default.url,
      publishedAt: item.snippet.publishedAt,
    }));

    const playlist = new Playlist({ userEmail, playlistId, playlistUrl, videos });
    await playlist.save();

    res.status(201).json({ message: 'Playlist added successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getPlaylistsByUser = async (req, res) => {
  try {
    const { userEmail } = req.params;
    const playlists = await Playlist.find({ userEmail });
    res.json(playlists);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};