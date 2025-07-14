const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  videoId: { type: String, required: true },
  title: { type: String, required: true },
  thumbnailUrl: { type: String },
  duration: { type: Number, default: 0 } // in seconds or minutes
}, { _id: false });

module.exports = videoSchema; // Export as schema (not model)
