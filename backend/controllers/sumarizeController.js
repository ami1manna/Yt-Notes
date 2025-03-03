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
            formulas: [{
                formula: String,
                explanation: String
            }],
            examples: [String],
            visualAids: [{
                description: String,
                imageUrl: String,
                altText: String
            }],
            subtopics: [{
                title: String,
                content: String,
                keyPoints: [String],
                visualAids: [{
                    description: String,
                    imageUrl: String,
                    altText: String
                }]
            }]
        }]
    },
    additionalResources: [String],
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
        Also If there are formuls Wrap them in $$
        #EXAMPLE
         $\theta_0 + \theta_1 * x$ or $$\sum_{j=0}^{n} \theta_j x_j$$

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
       
        // Create enhanced prompt for educational notes
        const prompt = `
        # 📚 EDUCATIONAL NOTES EXTRACTION TASK

        ## 🎯 OBJECTIVE
        Analyze the provided transcript thoroughly and create comprehensive, well-structured educational notes that capture all key concepts, examples, and technical details discussed.

        ## 📝 TRANSCRIPT
        ${transcriptText}

        ## 🔍 ANALYSIS INSTRUCTIONS
        1. Identify main topics and logical subtopics from the transcript
        2. Extract key learning points, definitions, and important concepts
        3. Include ONLY code snippets that were explicitly mentioned or discussed in the transcript
        4. Capture any mathematical formulas, using proper notation
        5. Note real-world examples that illustrate concepts
        6. Use emoji indicators where appropriate to highlight important concepts (🔑), warnings (⚠️), tips (💡), etc.
        7. If concepts would benefit from visual representation, suggest relevant image links

        ## 📋 OUTPUT FORMAT
        Return ONLY a JSON object with the following structure:

        {
          "title": "📌 [Descriptive title based on content]",
          "topics": [
            {
              "title": "🔷 [Topic title]",
              "summary": "Brief yet comprehensive summary of this topic",
              "keyPoints": [
                "🔑 [Key point 1]", 
                "🔑 [Key point 2]",
                ...
              ],
              "codeSnippets": [
                {
                  "language": "programming language",
                  "code": "code here exactly as presented in transcript",
                  "explanation": "Clear explanation with practical context"
                }
              ],
              "formulas": [
                {
                  "formula": "$$formula_here$$",
                  "explanation": "What this formula represents and how it's used"
                }
              ],
              "examples": [
                "💡 [Practical example 1]",
                "💡 [Practical example 2]"
              ],
              "visualAids": [
                {
                  "description": "Brief description of what this image shows",
                  "imageUrl": "https://example.com/image.jpg",
                  "altText": "Descriptive alt text for accessibility"
                }
              ],
              "subtopics": [
                {
                  "title": "🔹 [Subtopic title]",
                  "content": "Detailed yet concise subtopic content",
                  "keyPoints": ["[Point 1]", "[Point 2]"],
                  "visualAids": [
                    {
                      "description": "Brief description of what this image shows",
                      "imageUrl": "https://example.com/image.jpg",
                      "altText": "Descriptive alt text for accessibility"
                    }
                  ]
                }
              ]
            }
          ],
          "additionalResources": [
            "📚 [Any mentioned books, articles, or resources]"
          ]
        }

        ## ⚠️ IMPORTANT GUIDELINES
        - Include code snippets ONLY if they were actually discussed in the transcript
        - Format mathematical formulas properly: inline as $formula$ or block as $$formula$$ (it can be in anywhere in the transcript)
        - For visual aids:
          - ONLY suggest image URLs if they would genuinely enhance understanding of complex concepts
          - Provide image URLs in standard format for direct use in HTML <img src=""> tags
          - cross check the url given by gemini
          - Ensure suggested images would be publicly available (educational resources, diagrams)
          - Include descriptive alt text for all images for accessibility
          - This field is OPTIONAL - only include when visuals would significantly aid comprehension
        - Omit any fields that aren't applicable rather than leaving them empty
        - Use clear, educational language suitable for learning
        - If definitions or terms are explained in the transcript, include them in the notes
        - Ensure all content comes directly from the transcript - do not add external information
        - Use emoji indicators to make notes more visually engaging and easier to navigate

        Return ONLY the properly formatted JSON object, nothing else.
        `;
       
        // Generate content using Gemini
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
       
        // Parse JSON from response with improved error handling
        try {
            // Look for JSON object in the response
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            } else {
                throw new Error('No JSON object found in Gemini response');
            }
        } catch (parseError) {
            console.error('JSON parsing error:', parseError);
            // Fallback: attempt to clean the response and retry parsing
            const cleanedResponse = responseText.replace(/```json|```/g, '').trim();
            return JSON.parse(cleanedResponse);
        }
    } catch (error) {
        console.error('Error generating educational notes with Gemini:', error);
        throw error;
    }
}