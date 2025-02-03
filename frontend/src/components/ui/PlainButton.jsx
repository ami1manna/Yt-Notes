import React from "react";

const PlainButton = ({ children, onClick}) => {
  return (
    <button
      className="relative flex items-center justify-center font-semibold text-sm px-4 py-2 rounded-full 
                 bg-orange-500 text-white shadow-md transition-all transform 
                 hover:bg-orange-600 hover:shadow-orange-400 hover:shadow-lg hover:-translate-y-1 
                 active:bg-orange-700 active:scale-95 
                 dark:bg-orange-600 dark:hover:bg-orange-700 dark:shadow-orange-500 
                 "
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default PlainButton;
