const mongoose = require('mongoose');
const videoSchema = require('./videoModel');
const sectionSchema = require('./sectionModel');
 
const basePlaylistSchema = new mongoose.Schema({
  playlistId: { type: String, required: true, unique: true },
  playlistTitle: { type: String, required: true },
  playlistUrl: { type: String, required: true },
  channelTitle: { type: String, required: true },
  playlistThumbnailUrl: { type: String },
  totalDuration: { type: Number, default: 0 },
  videos: { type: [videoSchema], default: [] },
  videoOrder: { type: [String], default: [] },
  sections: { type: [sectionSchema], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('BasePlaylist', basePlaylistSchema);
