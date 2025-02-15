import React, { useState } from 'react';

// Tiles Component
const Tiles = ({ children, onClick, selected = false }) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  return (
    <div
      className={`
        relative w-full h-16 
        flex items-center justify-start 
        group
        rounded-lg 
        transition-all duration-300 ease-in-out
        cursor-pointer 
        overflow-hidden
        ${selected
          ? 'text-white'
          : 'text-gray-800 dark:text-white hover:text-gray-900 dark:hover:text-white'
        }
      `}
      onClick={onClick}
      onMouseEnter={() => setIsTooltipVisible(true)}
      onMouseLeave={() => setIsTooltipVisible(false)}
    >
      {/* Main Text */}
      <span className={`
        w-full 
        overflow-hidden text-ellipsis line-clamp-2
        transition-all duration-300
        ${selected ? 'font-medium' : 'font-normal'}
      `}>
        {children}
      </span>

      {/* Enhanced Tooltip */}
      {isTooltipVisible && (
        <div className={`
          absolute bottom-full left-0 mb-2 z-50
          w-max max-w-xs 
          bg-gray-900 dark:bg-gray-800
          text-white text-sm
          rounded-lg
          px-3 py-2
          shadow-lg
          transform transition-all duration-200
          ${isTooltipVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}
        `}>
          <div className="relative">
            {children}
            {/* Tooltip Arrow */}
            <div className="absolute -bottom-1 left-4 
                          w-2 h-2 
                          bg-gray-900 dark:bg-gray-800 
                          transform rotate-45"
            />
          </div>
        </div>
      )}

      {/* Selection Indicator */}
      {selected && (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-blue-600/10" />
      )}

      {/* Hover Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/10 to-transparent
                transform transition-transform duration-700 ease-in-out
                translate-x-[-100%] group-hover:translate-x-[100%]"/>

    </div>
  );
};

export default Tiles;