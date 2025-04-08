const mongoose = require('mongoose');

const educationalNotesSchema = new mongoose.Schema({
  videoId: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  overview: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,

    default: "Intermediate"
  },
  prerequisites: [String],
  topics: [{
    title: { type: String, required: true },
    explanation: { type: String, required: true },
    startTimestamp: Number,
    endTimestamp: Number,
    displayStartTime: String, // Human-readable format (MM:SS)
    displayEndTime: String,   // Human-readable format (MM:SS)
    keyPoints: [String],      // Added for better note structure
    codeSnippets: [{
      language: String,
      code: String,
      explanation: String,
      timestamp: Number,
      displayTime: String    // Human-readable format (MM:SS)
    }],
    formulas: [{
      formula: String,
      explanation: String,
      timestamp: Number,
      displayTime: String    // Human-readable format (MM:SS)
    }],
    examples: [{
      text: String,
      explanation: String,
      timestamp: Number,
      displayTime: String    // Human-readable format (MM:SS)
    }]
  }],
  summary: String,           // Added for better note structure
  additionalResources: [{
    title: String,
    link: String,
    description: String      // Added for better context
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });


// educationalNotesSchema.index({ videoId: 1 });

module.exports = mongoose.model('EducationalNotes', educationalNotesSchema);