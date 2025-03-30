const mongoose = require('mongoose');
const UserPlaylist = require('../models/playlistModel');
const { genAIModel } = require('../genAi/AiModel');
const { handleDelete, checkEmpty, fetchVideoDetails, handleAddSectionVideo } = require('../utils/VideoUtils');

exports.arrangeVideos = async (req, res) => {
  try {
    const { userEmail, playlistId } = req.body;

    // Find user's playlist document
    const userPlaylist = await UserPlaylist.findOne({ userEmail });

    if (!userPlaylist) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find the specific playlist
    const playlist = userPlaylist.playlists.get(playlistId);

    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found' });
    }

    // Convert videos Map to array for processing
    const videos = playlist.videoOrder.map(videoId => playlist.videos.get(videoId));

    if (!videos || videos.length === 0) {
      return res.status(400).json({ error: 'Playlist has no videos to arrange' });
    }

    // Create mapping of videos with simplified data for AI processing
    const videoMapping = videos.map((video, index) => ({
      index,
      title: video.title,
      id: playlist.videoOrder[index] // Use the actual video ID from videoOrder
    }));

    // Create prompt for AI to group videos into sections
    const prompt = `Given a YouTube playlist about ${playlist.channelTitle}, organize these videos into 3-5 logical thematic sections based on their content and titles.

    INSTRUCTIONS:
    1. Analyze the video titles to identify common themes, topics, or progression patterns
    2. Create 3-5 clearly distinct sections that group related videos together
    3. Give each section a brief, descriptive name that accurately reflects its content
    4. Ensure all videos are assigned to exactly one section
    5. Return your response as a valid, parseable JSON object with no additional text
    
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

    // Process each section and store it as a Map
    const processedSections = new Map();

    sectionsData.sections.forEach(section => {
      const sectionId = new mongoose.Types.ObjectId().toString(); // Generate unique section ID

      const sectionVideos = section.videoIndices
        .filter(index => index >= 0 && index < videos.length)
        .map(index => videos[index]);

      const sectionVideoIds = section.videoIndices
        .filter(index => index >= 0 && index < playlist.videoOrder.length)
        .map(index => playlist.videoOrder[index]);

      const sectionDuration = sectionVideos.reduce((sum, video) => sum + (video.duration || 0), 0);
      const completedVideos = sectionVideos.filter(video => video.done).length;
      const sectionProgress = sectionVideos.length > 0
        ? Math.round((completedVideos / sectionVideos.length) * 100)
        : 0;

      processedSections.set(sectionId, {
        name: section.name,
        sectionLength: sectionVideos.length,
        completedLength: completedVideos,
        progressPercentage: sectionProgress,
        totalDuration: sectionDuration,
        videoIds: sectionVideoIds,
        thumbnailUrl: sectionVideos[0]?.thumbnailUrl || playlist.playlistThumbnailUrl
      });
    });

    // Update playlist
    playlist.sections = processedSections;
    playlist.displaySection = true;
    playlist.playlistProgress = Math.round((videos.filter(v => v.done).length / videos.length) * 100);

    // Save updated document
    await userPlaylist.save();

    return res.status(200).json({
      message: 'Success Section Added',
      playlist: playlist
    });

  } catch (error) {
    console.error('Error rearranging playlist into sections:', error);
    return res.status(500).json({ error: error.message });
  }
};

exports.deleteSectionVideo = async (req, res) => {
  try {
    const { userEmail, playlistId, sectionId, videoId } = req.body;

    // Find user's playlist document 
    const userPlaylist = await UserPlaylist.findOne({ userEmail });

    if (!userPlaylist) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find Playlist 
    let playlist = userPlaylist.playlists.get(playlistId);
    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found' });
    }

    // Find Section 
    let section = playlist.sections.get(sectionId);

    if (!section) {
      return res.status(404).json({ error: 'Section not found' });
    }

    // Remove video from section's videoIds array
    section.videoIds = section.videoIds.filter(id => id !== videoId);

    // Remove video from playlist's videos map
    playlist.videos.delete(videoId);

    // Remove video from playlist's videoOrder array
    playlist.videoOrder = playlist.videoOrder.filter(id => id !== videoId);

    ({ playlist, section } = handleDelete(playlist, section));

    // Update playlist
    playlist.sections.set(sectionId, section);
    userPlaylist.playlists.set(playlistId, playlist);

    // Save the updated document
    await userPlaylist.save();

    res.status(200).json({
      message: 'Video deleted successfully',
      updatedSection: section
    });
  }
  catch (error) {
    console.error('Error deleting section video:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

exports.addSectionVideo = async (req, res) => {
  try {
    const { userEmail, playlistId, sectionId, videoId } = req.body;

    // Null Check
    if (checkEmpty(userEmail, playlistId, sectionId, videoId)) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Find the user playlist
    const userPlaylist = await UserPlaylist.findOne({ userEmail });
    
    if (!userPlaylist) {
      return res.status(404).json({ error: "User playlist not found" });
    }

    // Check if playlist exists
    const playlist = userPlaylist.playlists.get(playlistId);
    if (!playlist) {
      return res.status(404).json({ error: "Playlist not found" });
    }

    // Check if section exists
    const section = playlist.sections.get(sectionId);
    if (!section) {
      return res.status(404).json({ error: "Section not found" });
    }

    // Check if video already exists in playlist
    let video = playlist.videos.get(videoId);
    
    // If video does NOT exist, fetch from YouTube API and add
    if (!video) {
      try {
        // Fetch video details from YouTube API
        const videoDetails = await fetchVideoDetails(videoId);
        
        // Add video to playlist videos
        playlist.videos.set(videoId, videoDetails);
        
        // Update video reference
        video = videoDetails;
      } catch (error) {
        return res.status(404).json({ error: "Could not fetch video details" });
      }
    } else {
      return res.status(400).json({ error: "Video already exists in playlist" });
    }

    // Use the utility function to handle video addition and updates
    const { 
      playlist: updatedPlaylist, 
      section: updatedSection, 
      playlistProgress 
    } = handleAddSectionVideo(playlist, section, video, videoId);

    // Save the updated playlist
    await userPlaylist.save();

    return res.status(200).json({ 
      message: "Video added to section successfully",
      video: video,
      section: updatedSection,
      playlistProgress: playlistProgress
    });

  } catch (error) {
    console.error('Error adding section video:', error);
    return res.status(500).json({ error: error.message });
  }
};

