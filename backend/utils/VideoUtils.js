// imports
const { google } = require('googleapis');


// SectionModel section
exports.handleDelete = (playlist, section) => {

    section.sectionLength = section.videoIds.length;
    section.completedLength = section.videoIds.filter(id =>
        playlist.videos.get(id)?.done
    ).length;
    section.progressPercentage = section.sectionLength > 0
        ? Math.round((section.completedLength / section.sectionLength) * 100)
        : 0;

    // Recalculate section total duration
    section.totalDuration = section.videoIds.reduce((total, id) => {
        const video = playlist.videos.get(id);
        return total + (video?.duration || 0);
    }, 0);

    // playlist Length Update 
    playlist.playlistLength = playlist.videoOrder.length;

    return { playlist, section };

}

// handle Add Update 
exports.handleAddSectionVideo = (playlist, section, video, videoId) => {
    // Add video to section if not already present
    if (!section.videoIds.includes(videoId)) {
      section.videoIds.push(videoId);
      section.sectionLength += 1;
      section.totalDuration += video.duration;
    }
  
    // Update playlist metadata
    playlist.totalDuration += video.duration;
    playlist.playlistLength += 1;
  
    // Update section progress
    section.completedLength = section.videoIds.filter(id => {
      const vid = playlist.videos.get(id);
      return vid && vid.done;
    }).length;
  
    // Recalculate section progress percentage
    section.progressPercentage = section.sectionLength > 0 
      ? Math.round((section.completedLength / section.sectionLength) * 100) 
      : 0;
  
    // Ensure videoId is in videoOrder if not already present
    if (!playlist.videoOrder.includes(videoId)) {
      playlist.videoOrder.push(videoId);
    }
  
    // Recalculate playlist progress
    const completedVideos = Array.from(playlist.videos.values()).filter(v => v.done);
    playlist.playlistProgress = playlist.playlistLength > 0
      ? Math.round((completedVideos.length / playlist.playlistLength) * 100)
      : 0;
  
    // Return updated playlist and section
    return {
      playlist,
      section,
      playlistProgress: playlist.playlistProgress
    };
  };

//  To Check Whether Video is in Playlist
exports.isVideoInPlaylist = (playlist, videoId) => {
    return playlist.videos.has(videoId);
};

// to Fetch Video Details from Yt
exports.fetchVideoDetails = async (videoId) => {
    try {
        const youtube = google.youtube({
            version: 'v3',
            auth: process.env.YOUTUBE_API_KEY // Make sure to set this in your environment variables
          });

        const response = await youtube.videos.list({
            part: ['snippet', 'contentDetails'],
            id: [videoId]
        });

        const video = response.data.items[0];
        if (!video) {
            throw new Error('Video not found');
        }

        // Convert ISO 8601 duration to seconds
        const duration = this.parseDuration(video.contentDetails.duration);

        return {
            title: video.snippet.title,
            thumbnailUrl: video.snippet.thumbnails.medium.url,
            publishedAt: video.snippet.publishedAt,
            duration: duration,
            done: false,
            notes: ""
        };
    } catch (error) {
        console.error('Error fetching video details:', error);
        throw error;
    }
};

// Helper function to parse YouTube duration (ISO 8601)
exports.parseDuration = (duration) => {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    const hours = (parseInt(match[1]) || 0);
    const minutes = (parseInt(match[2]) || 0);
    const seconds = (parseInt(match[3]) || 0);
    return (hours * 3600) + (minutes * 60) + seconds;
};


// null checker
exports.checkEmpty = (...params) => {
    return params.some(attribute => attribute == null);
};