import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { CheckCircle2, PlayCircle, Clock } from 'lucide-react';
import { formatDuration } from "@/utils/Coverter";

const VideoNode = memo(({ data, selected }) => {
    const isCompleted = data.completed || false;
    
    return (
      <div className={`
        ${isCompleted ? 'bg-green-50 border-green-500' : 'bg-gray-50 border-gray-400'} 
        dark:bg-gray-700 border-2 rounded-lg shadow-md 
        w-64 text-gray-900 dark:text-gray-100 p-4
        transform transition-all duration-300 ease-out
        hover:scale-105 hover:shadow-lg
        ${selected ? 'ring-4 ring-green-300 scale-105' : ''}
        ${isCompleted ? 'hover:border-green-400' : 'hover:border-gray-500'}
      `}>
        <Handle type="target" position={Position.Top} className={`!border-white !border-2 !w-3 !h-3 ${isCompleted ? '!bg-green-500' : '!bg-gray-400'}`} />
        
        <div className="flex items-start space-x-3">
          <div className={`flex-shrink-0 p-2 rounded-lg ${isCompleted ? 'bg-green-100 dark:bg-green-900/30' : 'bg-gray-100 dark:bg-gray-600'}`}>
            {isCompleted ? (
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
            ) : (
              <PlayCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <p className={`font-semibold text-sm leading-tight ${isCompleted ? 'text-green-800 dark:text-green-300' : 'text-gray-800 dark:text-gray-200'}`}>
              {data.title}
            </p>
            <div className="flex items-center mt-2 space-x-2">
              <Clock className="w-3 h-3 text-gray-500" />
              <span className="text-xs text-gray-600 dark:text-gray-400">{formatDuration(data.duration)}</span>
            </div>
          </div>
        </div>
      </div>
    );
});

export default VideoNode;
