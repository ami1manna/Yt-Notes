// App.jsx
import React, { useState } from 'react';
import Canvas from '@/components/roadmap/Canvas';
import { Eye, EyeOff } from 'lucide-react';
 
const Roadmap = () => {
  const [filter, setFilter] = useState({ showImages: true });

  const toggleImages = () => {
    setFilter(prev => ({ ...prev, showImages: !prev.showImages }));
  };

  return (
    <div className="relative w-full h-screen bg-gray-50 dark:bg-gray-900">
      {/* Control Panel */}
      <div className="absolute top-4 left-4 z-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 backdrop-blur-sm bg-white/95 dark:bg-gray-800/95">
        <div className="p-4">
          <button
            onClick={toggleImages}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
              filter.showImages
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            {filter.showImages ? <Eye size={16} /> : <EyeOff size={16} />}
            <span className="text-sm font-medium">
              {filter.showImages ? 'Hide' : 'Show'} Thumbnails
            </span>
          </button>
        </div>
      </div>

      <Canvas filter={filter} />
     
    </div>
  );
};

export default Roadmap;
