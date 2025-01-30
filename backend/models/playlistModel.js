const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  timestamp: Number, // Time in seconds
  text: String, // Note content
});

const videoSchema = new mongoose.Schema({
  videoId: String,
  title: String,
  channelTitle: String,
  thumbnailUrl: String,
  publishedAt: String,
  done:{ type: Boolean, default: false },
  notes: [noteSchema] // Array of notes for this video
});

const singlePlaylistSchema = new mongoose.Schema({
  playlistId: String,
  playlistUrl: String,
  videos: [videoSchema]
});

const userPlaylistSchema = new mongoose.Schema({
  userEmail: { type: String, required: true, unique: true },
  playlists: [singlePlaylistSchema]
});

module.exports = mongoose.model('UserPlaylist', userPlaylistSchema);
