const mongoose = require('mongoose');
const UserProgress = require('../models/playlists/userProgressModel');
const User = require('../models/users/userModel');
const { genAIModel } = require('../genAi/AiModel');
const { handleDelete, checkEmpty, fetchVideoDetails, handleAddSectionVideo } = require('../utils/VideoUtils');
const BasePlaylist = require('../models/playlists/base/basePlaylistModel');

exports.arrangeVideos = async (req, res) => {
  try {
    const { userId, playlistId } = req.body;
    // Fetch the base playlist
    const basePlaylist = await BasePlaylist.findOne({ playlistId });
    if (!basePlaylist) {
      return res.status(404).json({ error: 'Base playlist not found' });
    }
    // Convert videos array to mapping for AI
    const videos = basePlaylist.videoOrder.map(videoId => basePlaylist.videos.find(v => v.videoId === videoId));
    if (!videos || videos.length === 0) {
      return res.status(400).json({ error: 'Playlist has no videos to arrange' });
    }
    const videoMapping = videos.map((video, index) => ({
      index,
      title: video.title,
      id: basePlaylist.videoOrder[index]
    }));
    // Create prompt for AI to group videos into sections
    const prompt = `Given a YouTube playlist about ${basePlaylist.channelTitle}, organize these videos into 3-5 logical thematic sections based on their content and titles.

    INSTRUCTIONS:
    1. Analyze the video titles to identify common themes, topics, or progression patterns
    2. Create  clearly distinct sections that group related videos together
    3. Give each section a brief, descriptive name that accurately reflects its content
    4. Ensure all videos are assigned to exactly one section
    5. Return your response as a valid, parseable JSON object with no additional text
    6. Make Sure That Each Video in Section Are Properly Ordered e.g episode 1, episode 2, episode 3, etc.
    VIDEO LIST:
    ${videoMapping.map(v => `[${v.index}] "${v.title}"`).join('\n')}
    
    REQUIRED RESPONSE FORMAT:
    {
      "sections": [
        {
          "name": "Section Name",
          "videoIndices": [0, 1, 2]
        }
      ]
    }
    
    Return ONLY the JSON object with no preamble, explanations, or concluding text. Ensure the JSON is valid and can be parsed directly.`;
    // Get response from AI (using model.generateContent or your preferred AI service)
    const result = await genAIModel.generateContent(prompt);
    const responseText = await result.response.text();
    // Parse AI response
    let sectionsData;
    try {
      sectionsData = JSON.parse(responseText.trim());
    } catch (error) {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        sectionsData = JSON.parse(jsonMatch[0]);
      } else {
        return res.status(500).json({ error: 'Invalid AI response', aiResponse: responseText });
      }
    }
    if (!sectionsData?.sections?.length) {
      return res.status(500).json({ error: 'AI response did not contain valid sections', aiResponse: responseText });
    }
    // Build new sections array for BasePlaylist
    const newSections = sectionsData.sections.map(section => {
      const sectionVideoIds = section.videoIndices
        .filter(index => index >= 0 && index < basePlaylist.videoOrder.length)
        .map(index => basePlaylist.videoOrder[index]);
      return {
        sectionId: new mongoose.Types.ObjectId().toString(),
        name: section.name,
        videoIds: sectionVideoIds,
        thumbnailUrl: videos[section.videoIndices[0]]?.thumbnailUrl || basePlaylist.playlistThumbnailUrl
      };
    });
    // Update sections in BasePlaylist
    basePlaylist.sections = newSections;
    await basePlaylist.save();
    return res.status(200).json({
      message: 'Sections arranged/updated successfully',
      sections: basePlaylist.sections
    });
  } catch (error) {
    console.error('Error rearranging playlist into sections:', error);
    return res.status(500).json({ error: error.message });
  }
};

