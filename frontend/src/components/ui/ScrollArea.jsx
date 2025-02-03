import React from "react";

const ScrollArea = ({ children, className, maxHeight = "90vh" }) => {
  return (
    <div 
      className={`overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-200 rounded-lg p-4 bg-gradient-to-b from-gray-800 to-gray-900 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out ${className}`} 
      style={{ maxHeight }}
    >
      {children}
    </div>
  );
};

export default ScrollArea;