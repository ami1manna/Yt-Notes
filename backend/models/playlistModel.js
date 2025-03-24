const mongoose = require('mongoose');



const videoSchema = new mongoose.Schema({
  videoId: String,
  title: String,
  thumbnailUrl: String,
  publishedAt: String,
  done: { type: Boolean, default: false },
  notes: { type: String, default: " " },  // Fixed syntax
  duration: { type: Number, default: 0 },
  
});

const sectionSchema = new mongoose.Schema({
  name: String, // Section name
  sectionLength: Number, // Total number of videos in section
  completedLength: Number, // Number of completed videos
  progressPercentage: Number, // Progress in percentage
  totalDuration: Number, // Total duration of all videos in section
  videos: [videoSchema], // Videos under this section
  videoIds: [String], // Array of video IDs
  thumbnailUrl: String // Thumbnail for section
});

const singlePlaylistSchema = new mongoose.Schema({
  playlistId: String,
  playlistUrl: String,
  channelTitle: String,
  playlistLength: Number,
  selectedVideoIndex: { type: Number, default: 0 },
  playlistProgress: { type: Number, default: 0 },
  playlistThumbnailUrl: String,
  totalDuration: { type: Number, default: 0 },
  sections: [sectionSchema],
  videos: [videoSchema]
  
});

const userPlaylistSchema = new mongoose.Schema({
  userEmail: { type: String, required: true, unique: true },
  playlists: [singlePlaylistSchema]
});

module.exports = mongoose.model('UserPlaylist', userPlaylistSchema);
