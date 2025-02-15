import React from "react";

const CircularProgress = ({ progress = 0, target = 100, radius = 17}) => {
  const percentage = Math.min(100, Math.max(0, (progress / target) * 100));
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  const strokeWidth = radius * 0.4; // Adjust stroke width relative to radius
  const textSize = `${radius * 0.6}px`; // Dynamically adjust text size

  return (
          <div className=" relative" style={{ width: radius * 5, height: radius * 5 }}>
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            className="stroke-gray-200 dark:stroke-gray-700 fill-none"
            cx="50"
            cy="50"
            r={radius}
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <circle
            className="stroke-blue-500 dark:stroke-blue-400 fill-none transition-all duration-300 ease-in-out"
            cx="50"
            cy="50"
            r={radius}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>
        {/* Centered text overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="font-bold text-gray-700 dark:text-gray-200"
            style={{ fontSize: textSize }}
          >
            {Math.round(percentage)}%
          </span>
        </div>
      </div>
 
  );
};

export default CircularProgress;
