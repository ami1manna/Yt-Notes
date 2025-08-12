import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { ChevronDown, ChevronUp, Layers } from 'lucide-react';
import ProgressBar from './ProgressBar';

const SectionNode = memo(({ data, selected }) => {
    const isExpanded = data.expanded || false;
    
    return (
      <div className={`
        bg-purple-50 dark:bg-gray-700 border-2 border-purple-500 rounded-lg shadow-md 
        w-72 text-gray-900 dark:text-gray-100 p-4 cursor-pointer
        transform transition-all duration-300 ease-out
        hover:scale-105 hover:shadow-lg hover:border-purple-400
        ${selected ? 'ring-4 ring-purple-300 scale-105' : ''}
        ${isExpanded ? 'bg-purple-100 dark:bg-purple-900/30' : ''}
      `}>
        <Handle type="target" position={Position.Top} className="!bg-purple-500 !border-white !border-2 !w-3 !h-3" />
        <Handle type="source" position={Position.Bottom} className="!bg-purple-500 !border-white !border-2 !w-3 !h-3" />
        
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <p className="font-semibold text-purple-800 dark:text-purple-300">{data.name}</p>
          </div>
          <div className="text-purple-500">
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </div>
        
        {data.progress !== undefined && (
          <div className="mt-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Section Progress</span>
              <span className="text-xs font-bold text-gray-800 dark:text-gray-200">{data.progress}%</span>
            </div>
            <ProgressBar progress={data.progress} size="sm" />
          </div>
        )}
      </div>
    );
});

export default SectionNode;
