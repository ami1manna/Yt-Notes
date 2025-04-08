import React, { useEffect, useState } from "react";

const HorizontalProgress = ({ progress = 0, target = 100 }) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setAnimatedProgress(progress), 200);
    
    if (progress >= target) {
      setIsCompleted(true);
    } else {
      setIsCompleted(false);
    }
    
    return () => clearTimeout(timeout);
  }, [progress, target]);

  const percentage = Math.min(100, Math.max(0, (animatedProgress / target) * 100));
  const statusText = isCompleted ? "Completed" : "In Progress";

  return (
    <div className="py-6 w-full max-w-md mx-auto">
      {/* Top row with status and percentage */}
      <div className="flex mb-4 items-center justify-between">
        <div>
          <span
            className={`text-sm tracking-wide font-medium py-1 px-3 rounded-md ${
              isCompleted 
                ? "text-green-800 bg-green-100" 
                : "text-blue-800 bg-blue-100"
            }`}
          >
            {statusText}
          </span>
        </div>
        <div className="text-right">
          <span className="text-base font-bold inline-block text-gray-800">
            {Math.round(percentage)}%
          </span>
        </div>
      </div>
      
      {/* Progress and target values */}
      <div className="flex mb-2 items-center justify-between text-sm text-gray-600">
        <span className="font-medium">Progress: {animatedProgress}</span>
        <span className="font-medium">Target: {target}</span>
      </div>
      
      {/* Progress bar */}
      <div className="flex rounded-md h-3 bg-gray-100 shadow-inner overflow-hidden">
        <div
          style={{ width: `${percentage}%` }}
          className={`${
            isCompleted 
              ? "bg-green-500" 
              : percentage < 30 
                ? "bg-blue-400" 
                : percentage < 70 
                  ? "bg-blue-500" 
                  : "bg-blue-600"
          } transition-all duration-700 ease-out`}
        ></div>
      </div>
    </div>
  );
};

export default HorizontalProgress;