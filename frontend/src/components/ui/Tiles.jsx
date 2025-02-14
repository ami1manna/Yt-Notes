import React from "react";

const Tiles = ({ children, onClick }) => {
  return (
    <div
      className="relative w-full h-16 p-3 text-gray-800 dark:text-white
                 rounded-lg flex items-center justify-start text-balance cursor-pointer
                 transition-transform duration-200 hover:scale-105 active:scale-95 overflow-hidden"
      onClick={onClick}
    >
      {/* Truncated Text */}
      <span className="w-full overflow-hidden text-ellipsis line-clamp-2">
        {children}
      </span>

      {/* Tooltip */}
      <div className="absolute bottom-full mb-2 hidden w-max max-w-xs bg-black text-white text-xs rounded-md px-2 py-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        {children}
      </div>
    </div>
  );
};

export default Tiles;
