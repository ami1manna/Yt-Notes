const mongoose = require('mongoose');
const sectionProgressSchema = require('./sectionProgressSchema');
const videoStatusSchema = require('./videoStatusSchema');

const userProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, //unique
  playlistId: { type: String, required: true },                                 

  playlistProgress: { type: Number, default: 0 },
  selectedVideoId: { type: String, default: "" },

  videoStatus: {
    type: Map,
    of: videoStatusSchema,
    default: {}
  },

  sectionProgress: {
    type: Map,
    of: sectionProgressSchema,
    default: {}
  }
}, { timestamps: true });

userProgressSchema.index({ userId: 1, playlistId: 1 }, { unique: true });

module.exports = mongoose.model('UserProgress', userProgressSchema);
