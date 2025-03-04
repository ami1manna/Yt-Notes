const mongoose = require('mongoose');

const transcriptSchema = new mongoose.Schema({
  start: String,
  end: String,
  text: String
});

const videoSchema = new mongoose.Schema({
  videoId: String,
  title: String,
  thumbnailUrl: String,
  publishedAt: String,
  done: { type: Boolean, default: false },
  notes: { type: String, default: " " },  // Fixed syntax
  duration: { type: Number, default: 0 },
  transcript: [transcriptSchema] 
});

const singlePlaylistSchema = new mongoose.Schema({
  playlistId: String,
  playlistUrl: String,
  channelTitle: String,
  playlistLength: Number,
  selectedVideoIndex:{type:Number, default: 0},
  playlistProgress:{type:Number, default: 0},
  playlistThumbnailUrl: String,
  totalDuration:{type:Number, default: 0},
  videos: [videoSchema]
});

const userPlaylistSchema = new mongoose.Schema({
  userEmail: { type: String, required: true, unique: true },
  playlists: [singlePlaylistSchema]
});

module.exports = mongoose.model('UserPlaylist', userPlaylistSchema);
