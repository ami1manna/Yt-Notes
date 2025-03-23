// playlist
// Helper functions from previous code
exports.playlistsArrayToMap = (playlists) => {
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
  
  exports.playlistsMapToArray = (playlistsMap) => {
    return Object.keys(playlistsMap).map(id => ({
      playlistId: id,
      ...playlistsMap[id]
    }));
  };