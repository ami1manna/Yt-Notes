const UserPlaylist = require('../models/playlistModel');
const TranscriptList = require('../models/transcriptModel');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Google Generative AI with API key
const geminiApiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI('AIzaSyA88srZwqJVOE_F0x0Sus0BX_7zVJhGR8w');

// First, let's create a schema for our summaries and notes
// You would typically put this in your models directory
const mongoose = require('mongoose');

// This should be placed in models/summaryModel.js
const summarySchema = new mongoose.Schema({
    videoId: {
        type: String,
        required: true,
        unique: true
    },
    summary: {
        overview: String,
        keyPoints: [String],
        mainTopics: [String]
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// This should be placed in models/educationalNotesModel.js
const educationalNotesSchema = new mongoose.Schema({
    videoId: {
        type: String,
        required: true,
        unique: true
    },
    notes: {
        title: String,
        topics: [{
            title: String,
            summary: String,
            keyPoints: [String],
            codeSnippets: [{
                language: String,
                code: String,
                explanation: String
            }],
            examples: [String],
            subtopics: [{
                title: String,
                content: String
            }]
        }]
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Create models (normally in separate files)
const VideoSummary = mongoose.model('VideoSummary', summarySchema);
const EducationalNotes = mongoose.model('EducationalNotes', educationalNotesSchema);

// Updated getSummarize endpoint
exports.getSummarize = async (req, res) => {
    const { videoId } = req.query;
    
    if (!videoId) {
        return res.status(400).json({ message: 'Video ID is required' });
    }
    
    try {
        // First check if summary already exists in database
        let existingSummary = await VideoSummary.findOne({ videoId });
        
        // If summary exists, return it
        if (existingSummary) {
            return res.status(200).json({
                message: 'Summary retrieved from database',
                videoId,
                summary: existingSummary.summary,
                fromDatabase: true
            });
        }
        
        // If no existing summary, find transcript in database
        const transcriptData = await TranscriptList.findOne({ videoId });
        
        if (!transcriptData) {
            return res.status(404).json({ message: 'Transcript not found for this video ID' });
        }
        
        const transcript = transcriptData.transcript;
        
        // Get combined transcript text
        let fullTranscript = '';
        transcript.forEach(segment => {
            if (segment.text) {
                fullTranscript += segment.text + ' ';
            }
        });
        
        // Check if transcript is empty
        if (!fullTranscript.trim()) {
            return res.status(404).json({ message: 'Transcript content is empty' });
        }
        
        // Generate summary using Gemini
        const summary = await generateTranscriptSummary(fullTranscript);
        
        // Store the summary in database
        const newSummary = new VideoSummary({
            videoId,
            summary
        });
        
        await newSummary.save();
        
        // Return the summary
        return res.status(200).json({
            message: 'Summary generated and stored successfully',
            videoId,
            summary,
            fromDatabase: false
        });
        
    } catch (error) {
        console.error('Summary generation error:', error);
        return res.status(500).json({ 
            message: 'Error generating summary', 
            error: error.message 
        });
    }
};

// Updated getEducationalNotes endpoint
exports.getEducationalNotes = async (req, res) => {
    const { videoId } = req.query;
    
    if (!videoId) {
        return res.status(400).json({ message: 'Video ID is required' });
    }
    
    try {
        // First check if educational notes already exist in database
        let existingNotes = await EducationalNotes.findOne({ videoId });
        
        // If notes exist, return them
        if (existingNotes) {
            return res.status(200).json({
                message: 'Educational notes retrieved from database',
                videoId,
                notes: existingNotes.notes,
                fromDatabase: true
            });
        }
        
        // If no existing notes, find transcript in database
        const transcriptData = await TranscriptList.findOne({ videoId });
        
        if (!transcriptData) {
            return res.status(404).json({ message: 'Transcript not found for this video ID' });
        }
        
        const transcript = transcriptData.transcript;
        
        // Get combined transcript text
        let fullTranscript = '';
        transcript.forEach(segment => {
            if (segment.text) {
                fullTranscript += segment.text + ' ';
            }
        });
        
        // Check if transcript is empty
        if (!fullTranscript.trim()) {
            return res.status(404).json({ message: 'Transcript content is empty' });
        }
        
        // Generate educational notes using Gemini
        const notes = await generateEducationalNotes(fullTranscript);
        
        // Store the notes in database
        const newNotes = new EducationalNotes({
            videoId,
            notes
        });
        
        await newNotes.save();
        
        // Return the educational notes
        return res.status(200).json({
            message: 'Educational notes generated and stored successfully',
            videoId,
            notes,
            fromDatabase: false
        });
        
    } catch (error) {
        console.error('Educational notes generation error:', error);
        return res.status(500).json({ 
            message: 'Error generating educational notes', 
            error: error.message 
        });
    }
};

// Add endpoint to forcefully regenerate summary
exports.regenerateSummary = async (req, res) => {
    const { videoId } = req.query;
    
    if (!videoId) {
        return res.status(400).json({ message: 'Video ID is required' });
    }
    
    try {
        // Find transcript in database
        const transcriptData = await TranscriptList.findOne({ videoId });
        
        if (!transcriptData) {
            return res.status(404).json({ message: 'Transcript not found for this video ID' });
        }
        
        const transcript = transcriptData.transcript;
        
        // Get combined transcript text
        let fullTranscript = '';
        transcript.forEach(segment => {
            if (segment.text) {
                fullTranscript += segment.text + ' ';
            }
        });
        
        // Generate new summary
        const summary = await generateTranscriptSummary(fullTranscript);
        
        // Update or create summary in database
        await VideoSummary.findOneAndUpdate(
            { videoId },
            { 
                summary,
                updatedAt: Date.now()
            },
            { upsert: true, new: true }
        );
        
        return res.status(200).json({
            message: 'Summary regenerated successfully',
            videoId,
            summary
        });
        
    } catch (error) {
        console.error('Summary regeneration error:', error);
        return res.status(500).json({ 
            message: 'Error regenerating summary', 
            error: error.message 
        });
    }
};

// Add endpoint to forcefully regenerate educational notes
exports.regenerateEducationalNotes = async (req, res) => {
    const { videoId } = req.query;
    
    if (!videoId) {
        return res.status(400).json({ message: 'Video ID is required' });
    }
    
    try {
        // Find transcript in database
        const transcriptData = await TranscriptList.findOne({ videoId });
        
        if (!transcriptData) {
            return res.status(404).json({ message: 'Transcript not found for this video ID' });
        }
        
        const transcript = transcriptData.transcript;
        
        // Get combined transcript text
        let fullTranscript = '';
        transcript.forEach(segment => {
            if (segment.text) {
                fullTranscript += segment.text + ' ';
            }
        });
        
        // Generate new educational notes
        const notes = await generateEducationalNotes(fullTranscript);
        
        // Update or create notes in database
        await EducationalNotes.findOneAndUpdate(
            { videoId },
            { 
                notes, 
                updatedAt: Date.now()
            },
            { upsert: true, new: true }
        );
        
        return res.status(200).json({
            message: 'Educational notes regenerated successfully',
            videoId,
            notes
        });
        
    } catch (error) {
        console.error('Educational notes regeneration error:', error);
        return res.status(500).json({ 
            message: 'Error regenerating educational notes', 
            error: error.message 
        });
    }
};

/**
 * Generate a concise summary of the video transcript using Gemini
 * @param {string} transcriptText - The full transcript text
 * @returns {Object} - Summary object with key points and overview
 */
async function generateTranscriptSummary(transcriptText) {
    try {
        // For very long transcripts, take the first ~10000 characters for the overview
        // and process the full transcript for key points
        const overviewText = transcriptText.length > 10000 
            ? transcriptText.substring(0, 10000) + '...' 
            : transcriptText;

        // Initialize Gemini model
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        
        // Create prompt for Gemini
        const prompt = `
        Analyze the following video transcript and generate a concise summary:
        
        ${overviewText}
        
        Please provide:
        1. A brief overview (2-3 paragraphs)
        2. 5-7 key points covered in the video
        3. Main topics discussed
        
        Format the response as a JSON object with the following structure:
        {
          "overview": "Overview text here...",
          "keyPoints": ["Point 1", "Point 2", ...],
          "mainTopics": ["Topic 1", "Topic 2", ...]
        }
        
        Return ONLY the JSON object, nothing else.
        `;
        
        // Generate content using Gemini
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        
        // Parse JSON from response
        // Extract JSON object from response text (it might be wrapped in code blocks)
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        } else {
            throw new Error('Failed to parse JSON from Gemini response');
        }
    } catch (error) {
        console.error('Error generating summary with Gemini:', error);
        throw error;
    }
}

/**
 * Generate detailed educational notes from the video transcript using Gemini
 * @param {string} transcriptText - The full transcript text
 * @returns {Object} - Structured educational notes
 */
async function generateEducationalNotes(transcriptText) {
    try {
        // Initialize Gemini model
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        
        // Create prompt for educational notes
        const prompt = `
        # TASK
        Analyze the provided transcript thoroughly and create detailed educational notes, including examples, code snippets, syntax, or formulas discussed within the text, organized by relevant topics.
        
        ## TRANSCRIPT
        ${transcriptText}
        
        ## OUTPUT FORMAT
        Format your response as a JSON object with the following structure:
        {
          "title": "Main title describing the content",
          "topics": [
            {
              "title": "Topic title",
              "summary": "Brief summary of this topic",
              "keyPoints": ["Point 1", "Point 2", ...],
              "codeSnippets": [
                {
                  "language": "programming language",
                  "code": "code here",
                  "explanation": "explanation of code"
                }
              ],
              "examples": ["Example 1", "Example 2"],
              "subtopics": [
                {
                  "title": "Subtopic title",
                  "content": "Subtopic content"
                }
              ]
            }
          ]
        }
        
        Return ONLY the JSON object, nothing else. If certain fields are not applicable, you can omit them from the response.
        `;
        
        // Generate content using Gemini
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        
        // Parse JSON from response
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        } else {
            throw new Error('Failed to parse JSON from Gemini response');
        }
    } catch (error) {
        console.error('Error generating educational notes with Gemini:', error);
        throw error;
    }
}