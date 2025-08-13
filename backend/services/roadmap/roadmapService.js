const Group = require('../../models/groups/GroupModel');
const BasePlaylist = require('../../models/playlists/base/basePlaylistModel');

const getRoadmapData = async (groupId, userId) => {
  try {
    // 1. Get the group and its shared playlists
    const group = await Group.findById(groupId)
      .populate({
        path: 'sharedPlaylists.sharedBy',
        select: 'name email'
      })
      .lean();

    if (!group) {
      throw new Error('Group not found');
    }

    if (!group.sharedPlaylists || group.sharedPlaylists.length === 0) {
      return {
        nodes: [{
          id: 'root_node',
          position: { x: 0, y: 0 },
          data: { label: group.name },
          type: 'rootNode'
        }],
        edges: []
      };
    }

    // 2. Process each shared playlist
    const nodes = [];
    const edges = [];
    let xPosition = 0;
    const yPosition = 150;
    const xSpacing = 350;

    // Add root node
    nodes.push({
      id: 'root_node',
      position: { x: 0, y: 0 },
      data: { label: group.name },
      type: 'rootNode'
    });

    // Process each playlist
    for (const sharedPlaylist of group.sharedPlaylists) {
      if (!sharedPlaylist.playlistId) continue;

      // Find the base playlist by its ID
      const playlist = await BasePlaylist.findOne({ 
        playlistId: sharedPlaylist.playlistId 
      }).lean();

      if (!playlist) continue;

      const nodeId = `pl_${playlist._id}`;
      
      // Format videos for the frontend
      const videos = (playlist.videos || []).map((video, index) => ({
        id: video.videoId || `video_${index}`,
        title: video.title || 'Untitled Video',
        duration: video.duration || 0,
        thumbnail: video.thumbnailUrl || ''
      }));

      // Process sections if any
      const sections = (playlist.sections || []).map(section => ({
        id: section.sectionId,
        name: section.name,
        videoIds: section.videoIds || []
      }));

      // Calculate total duration in seconds
      const totalDuration = playlist.totalDuration || 
        videos.reduce((sum, video) => sum + (video.duration || 0), 0);

      // Add playlist node
      nodes.push({
        id: nodeId,
        position: { x: xPosition, y: yPosition },
        data: {
          label: playlist.playlistTitle,
          duration: totalDuration,
          type: 'playlist',
          difficulty: 'Beginner',
          videos: videos,
          sections: sections,
          thumbnail: playlist.playlistThumbnailUrl
        },
        type: 'playlistNode'
      });

      // Add edge from root to playlist
      edges.push({
        id: `eroot-${playlist._id}`,
        source: 'root_node',
        target: nodeId,
        type: 'smoothstep'
      });

      xPosition += xSpacing;
    }

    return { nodes, edges };

  } catch (error) {
    console.error('Error in getRoadmapData:', error);
    throw error;
  }
};

module.exports = {
  getRoadmapData
};
