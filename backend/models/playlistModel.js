const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  videoId: String,
  title: String,
  channelTitle: String,
  thumbnailUrl: String,
  publishedAt: String
});

const singlePlaylistSchema = new mongoose.Schema({
  playlistId: {type :String, unique: true},
  playlistUrl: String,
  videos: [videoSchema]
});

const userPlaylistSchema = new mongoose.Schema({
  userEmail: { type: String, required: true, unique: true },
  playlists: [singlePlaylistSchema]
});

module.exports = mongoose.model('UserPlaylist', userPlaylistSchema);
