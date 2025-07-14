const mongoose = require('mongoose');

const videoStatusSchema = new mongoose.Schema({
  done: { type: Boolean, default: false },
  notes: { type: String, default: "" }
}, { _id: false });

module.exports = videoStatusSchema;