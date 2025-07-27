import React from 'react';
 

const VideoCard = ({ title, thumbnailUrl, key, progress, target }) => {
  return (
    <div
      className="w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 flex flex-col"
      key={key}
    >
      {/* Image container with flexbox */}
      <div className="flex flex-col w-full">
        <div className="w-full aspect-video">
          <img
            className="w-full h-full object-cover"
            src={thumbnailUrl || "/api/placeholder/400/225"}
            alt={title}
            loading="lazy"
          />
        </div>
        {/* Progress indicator */}
        <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 flex">
          <div 
            className={`h-full ${progress >= target ? 'bg-green-500' : 'bg-blue-500'}`}
            style={{ width: `${Math.min(100, (progress / target) * 100)}%` }}
          ></div>
        </div>
      </div>
      
      {/* Content section */}
      <div className="flex-grow flex flex-col p-4">
      <h3 className="text-sm font-semibold mb-2 truncate text-gray-800 dark:text-gray-100">
  {title}
</h3>
        
        {/* Progress info */}
        <div className="mt-auto pt-1 flex items-center justify-between text-sm">
          <span className="font-medium text-gray-600 dark:text-gray-300">
            {progress} / {target}
          </span>
          <span className={`font-semibold ${progress >= target ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'}`}>
            {Math.round((progress / target) * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;