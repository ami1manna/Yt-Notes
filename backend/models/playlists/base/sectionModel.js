const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  sectionId: { type: String, required: true },
  name: { type: String, required: true },
  videoIds: { type: [String], required: true },
  thumbnailUrl: { type: String }
}, { _id: false });

module.exports = sectionSchema; // Export as schema (not model)
