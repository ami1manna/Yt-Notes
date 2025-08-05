const mongoose = require('mongoose');

const sectionProgressSchema = new mongoose.Schema({
    completedCount: { type: Number, default: 0 },
    totalCount: { type: Number, default: 0 },
    percentage: { type: Number, default: 0 }
  }, { _id: false });
  
module.exports = sectionProgressSchema;