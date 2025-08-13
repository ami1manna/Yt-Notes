import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { GraduationCap } from 'lucide-react';

const RootNode = memo(({ data, selected }) => {
    return (
      <div className={`
        bg-gradient-to-br from-emerald-500 to-teal-600 
        border-2 border-emerald-400 rounded-xl shadow-xl 
        w-64 h-16 flex justify-center items-center 
        text-xl font-bold text-white cursor-pointer
        transform transition-all duration-300 ease-out
        hover:scale-105 hover:shadow-2xl hover:from-emerald-400 hover:to-teal-500
        ${selected ? 'ring-4 ring-emerald-300 scale-105' : ''}
      `}>
        <Handle type="source" position={Position.Bottom} className="!bg-white !border-emerald-500 !border-2 !w-3 !h-3" />
        <div className="flex items-center space-x-2">
          <GraduationCap className="w-6 h-6" />
          <span>{data.label}</span>
        </div>
      </div>
    );
});

export default RootNode;
