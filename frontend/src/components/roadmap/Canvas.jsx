// components/Canvas/Canvas.jsx
import React, { useState, useMemo } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Components
import VideoNode from './nodes/VideoNode';
import PlaylistNode from './nodes/PlaylistNode';
import VideoModal from './modals/VideoModal';

// Data
import playlistData from './data/nodes.json';

// Utils
import { formatDuration } from '@/utils/Coverter';

const Canvas = ({ filter = { showImages: true } }) => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
  };

  // Create nodes from the data
  const nodes = useMemo(() => {
    const nodesList = [];
    
    // Add playlist node
    nodesList.push({
      id: 'playlist-' + playlistData.playlistId,
      type: 'playlistNode',
      position: { x: 100, y: 100 },
      data: { 
        playlist: playlistData, 
        filter,
        onVideoClick: handleVideoClick
      },
    });
    
    // Add video nodes
    playlistData.videos.forEach((video, index) => {
      nodesList.push({
        id: 'video-' + video.videoId,
        type: 'videoNode',
        position: { x: 600 + (index % 3) * 340, y: 50 + Math.floor(index / 3) * 300 },
        data: { 
          video, 
          filter,
          onVideoClick: handleVideoClick
        },
      });
    });
    
    return nodesList;
  }, [filter]);
  
  // Create edges connecting playlist to videos
  const edges = useMemo(() => {
    return playlistData.videos.map(video => ({
      id: `playlist-${playlistData.playlistId}-to-video-${video.videoId}`,
      source: 'playlist-' + playlistData.playlistId,
      target: 'video-' + video.videoId,
      type: 'smoothstep',
      style: { stroke: '#3b82f6', strokeWidth: 2 },
      animated: true,
    }));
  }, []);
  
  // Define custom node types
  const nodeTypes = {
    videoNode: VideoNode,
    playlistNode: PlaylistNode,
  };
  
  return (
    <>
      <div className="w-full h-screen bg-gray-50 dark:bg-gray-900">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="top-right"
          className="bg-gray-50 dark:bg-gray-900"
        >
          <MiniMap 
            className="!bg-gray-100 dark:!bg-gray-800"
            nodeColor={(node) => node.type === 'playlistNode' ? '#10b981' : '#3b82f6'}
          />
          <Controls className="!bg-white dark:!bg-gray-800 !border-gray-200 dark:!border-gray-600" />
          <Background 
            color="#94a3b8" 
            gap={20} 
            size={1}
            className="dark:!bg-gray-900"
          />
        </ReactFlow>
      </div>

      {/* Video Modal */}
      <VideoModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        video={selectedVideo}
      />
    </>
  );
};

export default Canvas;