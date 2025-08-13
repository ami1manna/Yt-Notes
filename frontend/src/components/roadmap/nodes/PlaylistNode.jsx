import React, { memo, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { ChevronDown, ChevronUp, Clock, Play } from 'lucide-react';
import { formatDuration } from "@/utils/Coverter";

const PlaylistNode = memo(({ data, selected }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const { label, videos = [], duration } = data;
    
    const toggleExpand = (e) => {
        e.stopPropagation();
        setIsExpanded(!isExpanded);
    };
    
    return (
      <div 
        className={`
          bg-white dark:bg-gray-800 border-2 border-blue-500 rounded-xl shadow-lg 
          w-80 text-gray-900 dark:text-gray-100 overflow-hidden
          transform transition-all duration-300 ease-out
          hover:shadow-xl hover:border-blue-400
          ${selected ? 'ring-4 ring-blue-300 scale-105' : ''}
        `}
      >
        <Handle type="target" position={Position.Top} className="!bg-blue-500 !border-white !border-2 !w-3 !h-3" />
        <Handle type="source" position={Position.Bottom} className="!bg-blue-500 !border-white !border-2 !w-3 !h-3" />
        
        <div 
          className="p-5 cursor-pointer"
          onClick={toggleExpand}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-1 leading-tight">
                {label}
              </h3>
              {duration && (
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                  <Clock size={14} className="mr-1" />
                  {formatDuration(duration)}
                </div>
              )}
            </div>
            <div className="flex items-center space-x-1 ml-2 text-blue-500">
              {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
          </div>
        </div>
        
        {isExpanded && videos.length > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-700 px-5 py-3 bg-gray-50 dark:bg-gray-700/30">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Videos in this playlist:</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {videos.map((video, index) => (
                <div 
                  key={video.id || index} 
                  className="flex items-start p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600/30 transition-colors"
                >
                  <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-1 mr-2 mt-0.5">
                    <Play size={12} className="text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                      {video.title}
                    </p>
                    {video.duration && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDuration(video.duration)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
});

PlaylistNode.displayName = 'PlaylistNode';

export default PlaylistNode;
