const UserPlaylist = require('../models/playlistModel');
const axios = require('axios');

 
// Helper function to convert ISO 8601 duration (PT5M30S) to seconds
function isoDurationToSeconds(duration) {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  const hours = parseInt(match[1] || 0, 10);
  const minutes = parseInt(match[2] || 0, 10);
  const seconds = parseInt(match[3] || 0, 10);
  return hours * 3600 + minutes * 60 + seconds;
}

exports.addPlaylist = async (req, res) => {
  try {
    const { userEmail, playlistId, playlistUrl } = req.body;
    const API_KEY = process.env.YOUTUBE_API_KEY;
    
    // Function to fetch all playlist items using pagination
    async function getAllPlaylistItems(playlistId) {
      let allItems = [];
      let nextPageToken = '';
      
      do {
        const response = await axios.get(`https://www.googleapis.com/youtube/v3/playlistItems`, {
          params: {
            part: 'snippet',
            maxResults: 50,
            playlistId,
            pageToken: nextPageToken,
            key: API_KEY,
          },
        });
        
        allItems = [...allItems, ...response.data.items];
        nextPageToken = response.data.nextPageToken;
      } while (nextPageToken);
      
      return allItems;
    }
    
    // Function to fetch video details in batches
    async function getVideoDetails(videoIds) {
      const batchSize = 50; // YouTube API limit
      let allVideoDetails = [];
      
      for (let i = 0; i < videoIds.length; i += batchSize) {
        const batchIds = videoIds.slice(i, i + batchSize).join(',');
        const response = await axios.get(`https://www.googleapis.com/youtube/v3/videos`, {
          params: {
            part: 'contentDetails',
            id: batchIds,
            key: API_KEY,
          },
        });
        allVideoDetails = [...allVideoDetails, ...response.data.items];
      }
      
      return allVideoDetails;
    }
    
    // Fetch all playlist videos
    const videosData = await getAllPlaylistItems(playlistId);
    
    if (!videosData.length) {
      return res.status(404).json({ error: 'Playlist is empty or invalid' });
    }
    
    // Extract video IDs
    const videoIds = videosData.map(item => item.snippet.resourceId.videoId);
    
    // Fetch video details including duration
    const videoDetails = await getVideoDetails(videoIds);
    
    let totalDurationSeconds = 0;
    
    // Map videos with duration and calculate total duration
    const videos = videosData.map(item => {
      const videoDetail = videoDetails.find(v => v.id === item.snippet.resourceId.videoId);
      const durationSeconds = videoDetail ? isoDurationToSeconds(videoDetail.contentDetails.duration) : 0;
      
      totalDurationSeconds += durationSeconds;
      
      return {
        videoId: item.snippet.resourceId.videoId,
        title: item.snippet.title,
        thumbnailUrl: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
        publishedAt: item.snippet.publishedAt,
        duration: durationSeconds,
        notes: "", 
      };
    });
    
    // Common playlist data
    const channelTitle = videosData[0].snippet.channelTitle;
    const playlistLength = videos.length;
    const playlistThumbnailUrl = videosData[0].snippet.thumbnails.high?.url || 
                                videosData[0].snippet.thumbnails.default?.url;
    
    // Check if user has playlists
    let userPlaylist = await UserPlaylist.findOne({ userEmail });
    
    if (!userPlaylist) {
      userPlaylist = new UserPlaylist({
        userEmail,
        playlists: [{
          playlistId,
          playlistUrl,
          channelTitle,
          playlistLength,
          playlistThumbnailUrl,
          totalDuration: totalDurationSeconds,
          videos
        }]
      });
    } else {
      const existingPlaylist = userPlaylist.playlists.find(playlist => playlist.playlistId === playlistId);
      if (existingPlaylist) {
        return res.status(400).json({ error: 'Playlist already added' });
      }
      userPlaylist.playlists.push({
        playlistId,
        playlistUrl,
        channelTitle,
        playlistLength,
        playlistThumbnailUrl,
        totalDuration: totalDurationSeconds,
        videos
      });
    }
    
    await userPlaylist.save();
    res.status(201).json({
      message: 'Playlist added successfully',
      playlists: {
        playlistId,
        playlistUrl,
        channelTitle,
        playlistLength,
        playlistThumbnailUrl,
        totalDuration: totalDurationSeconds,
        videos
      }
    });
    
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getPlaylistsByUser = async (req, res) => {
  try {
    const { userEmail } = req.params;
    const playlists = await UserPlaylist.find({ userEmail });
    res.json(playlists);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deletePlaylist = async (req, res) => {
  try {
    const { userEmail, playlistId } = req.body;
    // Find the user's playlist
    const userPlaylist = await UserPlaylist.findOne({ userEmail });
    if (!userPlaylist) {
      return res.status(404).json({ error: 'User not found' });
    }
    // Find the index of the playlist to delete
    const playlistIndex = userPlaylist.playlists.findIndex(playlist => playlist.playlistId === playlistId);
    if (playlistIndex === -1) {
      return res.status(404).json({ error: 'Playlist not found' });
    }
    userPlaylist.playlists.splice(playlistIndex, 1);
    await userPlaylist.save();
    res.status(200).json({ message: 'Playlist deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};



exports.selectedVideoIndex = async (req, res) => {
  try {
      const { userEmail, playlistId, playlistIndex } = req.body;
      const userPlaylist = await UserPlaylist.findOne({ userEmail });
      if (!userPlaylist) {
          return res.status(404).json({ error: 'User not found' });
      }
      const playlist = userPlaylist.playlists.find(pl => pl.playlistId === playlistId);
      if (!playlist) {
          return res.status(404).json({ error: 'Playlist not found' });
      }

      playlist.selectedVideoIndex = playlistIndex;
      await userPlaylist.save();

      res.status(200).json({ message: 'Selected video index updated successfully' });
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
}