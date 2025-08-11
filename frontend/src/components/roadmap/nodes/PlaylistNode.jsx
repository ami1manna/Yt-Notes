import { Handle, Position } from '@xyflow/react';
import { formatDuration } from '@/utils/Coverter';
import { handleStyle } from '../styles/handleStyles';

import { Play, Clock, User, ExternalLink } from 'lucide-react';

const PlaylistNode = ({ data }) => {
  const { playlist, filter, onVideoClick } = data;

  const handlePlaylistClick = () => {
    window.open(playlist.playlistUrl, '_blank');
  };

  const handleVideoItemClick = (e, video) => {
    e.stopPropagation();
    if (onVideoClick) {
      onVideoClick(video);
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg hover:shadow-xl transition-shadow min-w-[350px] max-w-[400px]">
      <Handle
        type="target"
        position={Position.Left}
        style={handleStyle}
        className="!bg-green-500 !border-white"
      />
      
      <div className="p-4">
        {filter?.showImages && (
          <div className="mb-4 relative group cursor-pointer" onClick={handlePlaylistClick}>
            <img
              src={playlist.playlistThumbnailUrl}
              alt={playlist.playlistTitle}
              className="w-full h-40 object-cover rounded-md group-hover:opacity-90 transition-opacity"
              loading="lazy"
            />
            {/* Playlist overlay on hover */}
            <div className="absolute inset-0 bg-black bg-opacity-40 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="text-center text-white">
                <ExternalLink size={24} className="mx-auto mb-2" />
                <span className="text-sm font-medium">Open Playlist</span>
              </div>
            </div>
          </div>
        )}
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">
              PLAYLIST
            </span>
            <span className="text-xs font-mono text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded flex items-center gap-1">
              <Clock size={12} />
              {formatDuration(playlist.totalDuration)}
            </span>
          </div>
          
          <h3 
            className="text-sm font-bold text-gray-900 dark:text-white leading-tight line-clamp-2 hover:text-green-600 dark:hover:text-green-400 transition-colors cursor-pointer"
            onClick={handlePlaylistClick}
          >
            {playlist.playlistTitle}
          </h3>
          
          <div className="text-xs text-gray-600 dark:text-gray-300 flex items-center gap-1">
            <User size={12} />
            <strong>Channel:</strong> {playlist.channelTitle}
          </div>
          
          <div className="space-y-1">
            <div className="text-xs font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
              <Play size={12} />
              Videos ({playlist.videos.length}):
            </div>
            <div className="max-h-32 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
              {playlist.videos.slice(0, 5).map((video, index) => (
                <div 
                  key={video.videoId} 
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline cursor-pointer p-1 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  onClick={(e) => handleVideoItemClick(e, video)}
                >
                  <div className="flex items-center justify-between">
                    <span className="flex-1 truncate">
                      {index + 1}. {video.title}
                    </span>
                    <span className="ml-2 text-xs text-gray-500 dark:text-gray-400 font-mono">
                      {formatDuration(video.duration)}
                    </span>
                  </div>
                </div>
              ))}
              {playlist.videos.length > 5 && (
                <div className="text-xs text-gray-500 dark:text-gray-400 italic p-1">
                  +{playlist.videos.length - 5} more videos...
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handlePlaylistClick}
              className="w-full text-xs text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 flex items-center justify-center gap-1 py-1 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors"
            >
              <ExternalLink size={12} />
              Open Full Playlist
            </button>
          </div>
        </div>
      </div>
      
      <Handle
        type="source"
        position={Position.Right}
        style={handleStyle}
        className="!bg-green-500 !border-white"
      />
    </div>
  );
};

export default PlaylistNode;