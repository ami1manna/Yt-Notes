import React from 'react';
import { Handle, Position } from '@xyflow/react';
 
import { handleStyle } from '../styles/handleStyles';

import { Play, Clock } from 'lucide-react';
import { formatDuration } from '@/utils/Coverter';

const VideoNode = ({ data }) => {
  const { video, filter, onVideoClick } = data;

  const handleVideoClick = (e) => {
    e.stopPropagation();
    if (onVideoClick) {
      onVideoClick(video);
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-md hover:shadow-lg transition-shadow min-w-[280px] max-w-[320px] cursor-pointer group">
      <Handle
        type="target"
        position={Position.Left}
        style={handleStyle}
        className="!bg-blue-500 !border-white"
      />
      
      <div onClick={handleVideoClick} className="p-4">
        {filter?.showImages && (
          <div className="mb-3 relative">
            <img
              src={video.thumbnailUrl}
              alt={video.title}
              className="w-full h-32 object-cover rounded-md group-hover:opacity-90 transition-opacity"
              loading="lazy"
            />
            {/* Play overlay on hover */}
            <div className="absolute inset-0 bg-black bg-opacity-40 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Play size={24} className="text-white" fill="currentColor" />
            </div>
            {/* Duration badge */}
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs font-mono">
              {formatDuration(video.duration)}
            </div>
          </div>
        )}
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded">
              VIDEO
            </span>
            {!filter?.showImages && (
              <span className="text-xs font-mono text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded flex items-center gap-1">
                <Clock size={12} />
                {formatDuration(video.duration)}
              </span>
            )}
          </div>
          
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white leading-tight line-clamp-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {video.title}
          </h3>
          
          <div className="text-xs text-gray-500 dark:text-gray-400">
            ID: {video.videoId}
          </div>

          {/* Click hint */}
          <div className="text-xs text-blue-500 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity pt-1">
            Click to preview →
          </div>
        </div>
      </div>
      
      <Handle
        type="source"
        position={Position.Right}
        style={handleStyle}
        className="!bg-blue-500 !border-white"
      />
    </div>
  );
};

export default VideoNode;