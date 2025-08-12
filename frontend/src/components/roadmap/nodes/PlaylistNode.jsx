import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { ChevronDown, ChevronUp, Clock } from 'lucide-react';
import ProgressBar from './ProgressBar';
import { formatDuration } from "@/utils/Coverter";
const PlaylistNode = memo(({ data, selected }) => {
    const isExpanded = data.expanded || false;
    
    return (
      <div className={`
        bg-white dark:bg-gray-800 border-2 border-blue-500 rounded-xl shadow-lg 
        w-80 text-gray-900 dark:text-gray-100 p-5 cursor-pointer
        transform transition-all duration-300 ease-out
        hover:scale-105 hover:shadow-xl hover:border-blue-400
        ${selected ? 'ring-4 ring-blue-300 scale-105' : ''}
        ${isExpanded ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
      `}>
        <Handle type="target" position={Position.Top} className="!bg-blue-500 !border-white !border-2 !w-3 !h-3" />
        <Handle type="source" position={Position.Bottom} className="!bg-blue-500 !border-white !border-2 !w-3 !h-3" />
        
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-1 leading-tight">
              {data.label}
            </h3>
          </div>
          <div className="flex items-center space-x-1 ml-2 text-blue-500">
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </div>
  
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <Clock size={16} />
            <span>{formatDuration(data.duration)}</span>
          </div>
          
          {data.progress !== undefined && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
                <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{data.progress}%</span>
              </div>
              <ProgressBar progress={data.progress} />
            </div>
          )}
        </div>
      </div>
    );
});

export default PlaylistNode;
