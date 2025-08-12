import React, { memo } from 'react';

const ProgressBar = memo(({ progress = 0, size = 'md' }) => {
    const sizeClasses = {
      sm: 'h-1.5',
      md: 'h-2',
      lg: 'h-3'
    };
  
    const getProgressColor = (progress) => {
      if (progress >= 80) return 'bg-green-500';
      if (progress >= 60) return 'bg-blue-500';
      if (progress >= 40) return 'bg-yellow-500';
      return 'bg-orange-500';
    };
  
    return (
      <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <div 
          className={`${getProgressColor(progress)} ${sizeClasses[size]} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${progress}%` }}
        />
      </div>
    );
});

export default ProgressBar;
