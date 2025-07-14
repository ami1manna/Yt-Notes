const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  privacy: { type: String, enum: ['public', 'private'], required: true },
  rules: [{ type: String }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  memberCount: { type: Number, default: 1 }
});

module.exports = mongoose.model('Group', groupSchema); 