// Bookmark component
import React from 'react';

const Bookmark = () => {
  return (
    <div className="flex items-center justify-center">
      <svg 
        viewBox="0 0 24 24" 
        className="w-6 h-6 fill-none stroke-[#00ffaa] stroke-[3] stroke-linecap-round stroke-linejoin-round"
      >
        <path d="M3,12.5l7,7L21,5" />
      </svg>
    </div>
  );
};

export default Bookmark;