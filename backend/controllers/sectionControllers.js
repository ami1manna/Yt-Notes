const UserPlaylist = require('../models/playlistModel');
const { playlistsMapToArray, playlistsArrayToMap } = require('./utils');
const { genAIModel } = require('../genAi/AiModel');

exports.arrangeVideos = async (req, res) => {
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

    // Process each section and add required attributes
    const processedSections = sectionsData.sections.map(section => {
      const sectionVideos = section.videoIndices
        .filter(index => index >= 0 && index < videos.length)
        .map(index => videos[index]);

      const sectionDuration = sectionVideos.reduce((sum, video) => sum + (video.duration || 0), 0);
      const completedVideos = sectionVideos.filter(video => video.done).length;
      const sectionProgress = sectionVideos.length > 0 
        ? Math.round((completedVideos / sectionVideos.length) * 100)
        : 0;

      return {
        name: section.name,
        sectionLength: sectionVideos.length,
        completedLength: completedVideos,
        progressPercentage: sectionProgress,
        totalDuration: sectionDuration,
        videos: sectionVideos,
        videoIds: sectionVideos.map(video => video.videoId),
        thumbnailUrl: sectionVideos[0]?.thumbnailUrl || playlist.playlistThumbnailUrl
      };
    });

    // Update playlist with sections and remove videos array
    playlistsMap[playlistId] = {
      ...playlist,
      sections: processedSections,
      videos: [], // **Deleting the videos array**
      playlistProgress: Math.round((videos.filter(v => v.done).length / videos.length) * 100),
    };

    // Convert map back to array for storage
    userPlaylist.playlists = playlistsMapToArray(playlistsMap);

    // Save updated document
    await userPlaylist.save();

    return res.status(200).json({
      message: 'Playlist successfully organized into sections and videos removed',
      playlist: playlistsMap[playlistId]
    });

  } catch (error) {
    console.error('Error rearranging playlist into sections:', error);
    return res.status(500).json({ error: error.message });
  }
};
