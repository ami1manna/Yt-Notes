const { genAIModel } = require('../genAi/AiModel');

// Format transcript with timestamps
const formatTranscript = (transcript) => {
  return transcript
    .map(({ text, start }) => `[${formatTime(start)}] ${text}`)
    .join('\n');
};

// Format seconds to MM:SS timestamp
const formatTime = (seconds) => {
  if (typeof seconds !== 'number' || isNaN(seconds) || seconds < 0) {
    return 'Unknown';
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

 

// Generate structured educational notes from a transcript
const generateEducationalNotes = async (transcript) => {
  try {
    console.log('generateEducationalNotes called with transcript length:', transcript.length);
    
    // Prompt designed to generate user-friendly, well-structured notes
    const prompt = `
      Generate comprehensive, well-structured educational notes from this transcript:
      ${formatTranscript(transcript)}
      
       ### ⚠️ IMPORTANT ADDITIONAL GUIDELINES
       - Format mathematical formulas properly: inline as $formula$ or block as $$formula$$

      Return a JSON object with the following structure:
      {
        "title": "Descriptive title of the content",
        "overview": "A concise 2-3 sentence summary of the main concepts covered",
        "difficulty": "Beginner/Intermediate/Advanced/General",
        "prerequisites": ["List of required knowledge"],
        "topics": [
          {
            "title": "Topic title",
            "explanation": "Clear, concise explanation in plain language",
            "startTimestamp": startTimeInSeconds,
            "endTimestamp": endTimeInSeconds,
            "keyPoints": ["Important concepts in bullet form"],
            "codeSnippets": [
              {
                "language": "programming language",
                "code": "formatted code",
                "explanation": "What the code does",
                "timestamp": timestampInSeconds
              }
            ],
            "formulas": [
              {
                "formula": "$$formula_here$$",
                "explanation": "What the formula means and how to use it",
                "timestamp": timestampInSeconds
              }
            ],
            "examples": [
              {
                "text": "Practical example",
                "explanation": "How this example applies the concept",
                "timestamp": timestampInSeconds
              }
            ]
          }
        ],
        "summary": "A paragraph that ties everything together",
        "additionalResources": [
          {
            "title": "Resource name",
            "link": "URL or reference",
            "description": "Brief description of the resource"
          }
        ]
      }
      
      Focus on clarity, readability, and practical understanding. Make sure explanations avoid jargon when possible.
    `;

    console.log('Calling AI model with prompt...');
    const response = await genAIModel.generateContent(prompt);
    console.log('AI model response received');
    
    // Extract and parse the JSON response
    const responseText = response.response.text();
    console.log('AI response text length:', responseText.length);
    
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('Failed to extract JSON from AI response. Response text:', responseText.substring(0, 500));
      throw new Error('Failed to extract valid JSON from AI response');
    }
    
    console.log('JSON extracted successfully, parsing...');
    const parsedNotes = JSON.parse(jsonMatch[0]);
    console.log('Notes parsed successfully');
    
    return parsedNotes;
  } catch (error) {
    console.error('AI Generation Error:', error);
    throw new Error('Failed to generate educational notes: ' + error.message);
  }
};

// Helper functions for playlist management
const playlistsArrayToMap = (playlists) => {
  const playlistsMap = {};
  playlists.forEach(playlist => {
    playlistsMap[playlist.playlistId] = {
      playlistUrl: playlist.playlistUrl,
      channelTitle: playlist.channelTitle,
      playlistLength: playlist.playlistLength,
      playlistThumbnailUrl: playlist.playlistThumbnailUrl,
      totalDuration: playlist.totalDuration,
      videos: playlist.videos,
      selectedVideoIndex: playlist.selectedVideoIndex || 0,
      sections: playlist.sections || []
    };
  });
  return playlistsMap;
};

const playlistsMapToArray = (playlistsMap) => {
  return Object.keys(playlistsMap).map(id => ({
    playlistId: id,
    ...playlistsMap[id]
  }));
};


module.exports = { 
  generateEducationalNotes,
  playlistsArrayToMap,
  playlistsMapToArray,
  formatTime
};
 