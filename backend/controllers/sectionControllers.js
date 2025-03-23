const UserPlaylist = require('../models/playlistModel');
const axios = require('axios');
const { playlistsMapToArray, playlistsArrayToMap } = require('./utils');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Google Generative AI with API key
const geminiApiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI("AIzaSyA88srZwqJVOE_F0x0Sus0BX_7zVJhGR8w");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

exports.rearrangePlaylistIntoSections = async (req, res) => {
  try {
    const { userEmail, playlistId } = req.body;
    
    // Find user's playlist document
    const userPlaylist = await UserPlaylist.findOne({ userEmail });
    
    if (!userPlaylist) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Convert array to map for easier manipulation
    const playlistsMap = playlistsArrayToMap(userPlaylist.playlists);
    
    // Check if playlist exists
    if (!playlistsMap[playlistId]) {
      return res.status(404).json({ error: 'Playlist not found' });
    }
    
    const playlist = playlistsMap[playlistId];
    const videos = playlist.videos;
    
    if (!videos || videos.length === 0) {
      return res.status(400).json({ error: 'Playlist has no videos to arrange' });
    }
    
    // Create mapping of videos with simplified data for AI processing
    const videoMapping = videos.map((video, index) => ({
      index,
      title: video.title,
      id: video.videoId
    }));
    
    // Create prompt for AI to group videos into sections
    const prompt = `
      I have a YouTube playlist about ${playlist.channelTitle} with the following videos.
      Please organize these videos into 3-5 logical thematic sections based on their titles.
      
      Return ONLY a JSON object with the format:
      { "sections": [ { "name": "Section Name", "videoIndices": [0, 1, 2] } ] }
      
      Do not include any text before or after the JSON. The response should be valid JSON only.
      
      Videos:
      ${videoMapping.map(v => `[${v.index}] "${v.title}"`).join('\n')}
    `;
    // Get response from AI (using model.generateContent or your preferred AI service)
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();
    
    // Parse AI response
    let sectionsData;
    try {
      // Try direct parsing first
      sectionsData = JSON.parse(responseText.trim());
    } catch (error) {
      // Fall back to regex extraction if necessary
      try {
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          sectionsData = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No valid JSON found in response');
        }
      } catch (innerError) {
        return res.status(500).json({
          error: 'Failed to parse AI response',
          aiResponse: responseText
        });
      }
    }
    
    // Validate expected structure
    if (!sectionsData || !sectionsData.sections || !Array.isArray(sectionsData.sections)) {
      return res.status(500).json({
        error: 'AI response did not contain valid sections data',
        aiResponse: responseText
      });
    }
    
    // Process each section and add all required attributes
    const processedSections = sectionsData.sections.map(section => {
      // Get all valid videos in this section
      const sectionVideos = section.videoIndices
        .filter(index => index >= 0 && index < videos.length)
        .map(index => {
          const video = videos[index];
          // Create simplified video object with required attributes
          return {
            videoId: video.videoId,
            title: video.title,
            thumbnailUrl: video.thumbnailUrl,
            done: video.done || false,
            notes: video.notes || "",
            duration: video.duration || 0
          };
        });
      
      // Calculate section metrics
      const sectionDuration = sectionVideos.reduce((sum, video) => sum + (video.duration || 0), 0);
      const completedVideos = sectionVideos.filter(video => video.done).length;
      const sectionProgress = sectionVideos.length > 0 
        ? Math.round((completedVideos / sectionVideos.length) * 100)
        : 0;
      
      // Format duration for display
      const formatDuration = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs > 0 ? hrs + 'h ' : ''}${mins}m ${secs}s`;
      };
      
      // Get videoIds array from section videos
      const videoIds = sectionVideos.map(video => video.videoId);
      
      // Return complete section object with all required attributes
      return {
        name: section.name,
        sectionLength: sectionVideos.length,
        completedLength: completedVideos,
        progressPercentage: sectionProgress,
        totalDuration: sectionDuration,
        formattedDuration: formatDuration(sectionDuration),
        videos: sectionVideos,
        videoIds: videoIds, // Keep videoIds array for compatibility
        thumbnailUrl: sectionVideos[0]?.thumbnailUrl || playlist.playlistThumbnailUrl
      };
    });
    
    // Update playlist with sections and recalculate overall progress
    const totalVideos = videos.length;
    const totalCompletedVideos = videos.filter(video => video.done).length;
    const overallProgress = totalVideos > 0 ? Math.round((totalCompletedVideos / totalVideos) * 100) : 0;
    
    // Update playlist object with all required attributes
    playlistsMap[playlistId] = {
      ...playlist,
      playlistId,
      playlistUrl: playlist.playlistUrl,
      channelTitle: playlist.channelTitle,
      playlistLength: totalVideos,
      selectedVideoIndex: playlist.selectedVideoIndex || 0,
      playlistProgress: overallProgress,
      playlistThumbnailUrl: playlist.playlistThumbnailUrl,
      totalDuration: playlist.totalDuration,
      sections: processedSections
    };
    
    // Convert map back to array for storage
    userPlaylist.playlists = playlistsMapToArray(playlistsMap);
    
    // Save updated document
    await userPlaylist.save();
    
    // Return success response with updated playlist
    return res.status(200).json({
      message: 'Playlist successfully organized into sections',
      playlist: playlistsMap[playlistId]
    });
    
  } catch (error) {
    console.error('Error rearranging playlist into sections:', error);
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Helper function to recalculate section progress when a video is updated
 * @param {string} userEmail - User's email
 * @param {string} playlistId - Playlist ID
 * @param {string} videoId - Updated video ID
 * @returns {Promise<Object>} - Status of the update operation
 */
exports.updateSectionProgress = async (userEmail, playlistId, videoId) => {
  try {
    const userPlaylist = await UserPlaylist.findOne({ userEmail });
    
    if (!userPlaylist) {
      throw new Error('User not found');
    }
    
    const playlist = userPlaylist.playlists.find(p => p.playlistId === playlistId);
    
    if (!playlist) {
      throw new Error('Playlist not found');
    }
    
    if (!playlist.sections || playlist.sections.length === 0) {
      return { updated: false, message: 'No sections found' };
    }
    
    let sectionsUpdated = false;
    
    // Update each section containing the video
    playlist.sections.forEach(section => {
      const videoIndex = section.videos.findIndex(v => v.videoId === videoId);
      
      if (videoIndex !== -1) {
        // Update video in section to match main playlist
        const mainVideo = playlist.videos.find(v => v.videoId === videoId);
        if (mainVideo) {
          section.videos[videoIndex] = {
            videoId: mainVideo.videoId,
            title: mainVideo.title,
            thumbnailUrl: mainVideo.thumbnailUrl,
            done: mainVideo.done || false,
            notes: mainVideo.notes || "",
            duration: mainVideo.duration || 0
          };
          
          // Recalculate section metrics
          const completedVideos = section.videos.filter(v => v.done).length;
          section.completedLength = completedVideos;
          section.progressPercentage = section.videos.length > 0 
            ? Math.round((completedVideos / section.videos.length) * 100)
            : 0;
          
          sectionsUpdated = true;
        }
      }
    });
    
    if (sectionsUpdated) {
      // Recalculate overall playlist progress
      const totalVideos = playlist.videos.length;
      const totalCompletedVideos = playlist.videos.filter(v => v.done).length;
      playlist.playlistProgress = totalVideos > 0 
        ? Math.round((totalCompletedVideos / totalVideos) * 100)
        : 0;
      
      // Save the updated document
      await userPlaylist.save();
    }
    
    return { 
      updated: sectionsUpdated, 
      playlistProgress: playlist.playlistProgress 
    };
    
  } catch (error) {
    console.error('Error updating section progress:', error);
    throw error;
  }
};