// playlistModel.js
const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  videoId: String,
  title: String,
  channelTitle: String,
  thumbnailUrl: String,
  publishedAt: String
});

const playlistSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  playlistId: { type: String, required: true },
  playlistUrl: { type: String, required: true },
  videos: [videoSchema]
});

module.exports = mongoose.model('Playlist', playlistSchema);
