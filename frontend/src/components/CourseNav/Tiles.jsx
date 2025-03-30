import React, { useState, useRef, useEffect } from 'react';
import { Play } from 'lucide-react';

const Tiles = ({ children, onClick, selected = false, duration, index }) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const tileRef = useRef(null);
  const contentRef = useRef(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  // Check if content is overflowing and needs tooltip
  useEffect(() => {
    if (contentRef.current) {
      const isTextOverflowing = contentRef.current.scrollWidth > contentRef.current.clientWidth;
      setIsOverflowing(isTextOverflowing);
    }
  }, [children]);

  return (
    <div
      ref={tileRef}
      className={`
        relative w-full 
        flex items-center justify-start 
        p-2
        group
        rounded-lg 
        transition-all duration-300 ease-in-out
        cursor-pointer 
        overflow-hidden
        hover:bg-gray-100 dark:hover:bg-gray-800/60
        ${selected
          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 shadow-sm'
          : 'text-gray-800 dark:text-white hover:text-gray-900 dark:hover:text-white'
        }
      `}
      onClick={onClick}
      onMouseEnter={() => isOverflowing && setIsTooltipVisible(true)}
      onMouseLeave={() => setIsTooltipVisible(false)}
    >
     

      {/* Main Text */}
      <div className="flex-1 flex flex-col">
        <span 
          ref={contentRef}
          className={`
            w-full 
            overflow-hidden text-ellipsis line-clamp-2
            transition-all duration-300
            ${selected ? 'font-medium' : 'font-normal'}
          `}
        >
          {children}
        </span>
        
        {duration && (
          <span className="text-xs mt-1 text-gray-500 dark:text-gray-400">
            {duration}
          </span>
        )}
      </div>

      {/* Enhanced Tooltip - Only show when content is overflowing */}
      {isTooltipVisible && (
        <div 
          className="absolute bottom-full left-0 mb-2 z-50
            w-max max-w-xs 
            bg-gray-900 dark:bg-gray-800
            text-white text-sm
            rounded-lg
            px-3 py-2
            shadow-lg
            transition-all duration-200"
          style={{ 
            maxWidth: '90vw',
            wordBreak: 'break-word'
          }}
        >
          <div className="relative">
            {children}
            {/* Tooltip Arrow */}
            <div 
              className="absolute -bottom-2 left-4
                         w-2 h-2
                         bg-gray-900 dark:bg-gray-800
                         transform rotate-45"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Tiles;