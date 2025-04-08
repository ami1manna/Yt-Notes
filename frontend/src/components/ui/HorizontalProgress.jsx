import React, { useEffect, useState } from "react";

const HorizontalProgress = ({ progress = 0, target = 100 }) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setAnimatedProgress(progress), 200); // Delay for smooth transition
     
    if (progress === target) {
      setIsCompleted(true);
    } else {
      setIsCompleted(false);
    }
    return () => clearTimeout(timeout);
  }, [progress]);

  const percentage = Math.min(100, Math.max(0, (animatedProgress / target) * 100)); 
  const statusText = isCompleted ? "Completed" : "In Progress";
 
  return (
    <div className="py-4    mx-auto">
      <div className="flex mb-2 items-center justify-between">
        <div>
          <span className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full ${isCompleted?"text-green-600 bg-green-200":"text-teal-600 bg-teal-200"}`}>
            {statusText}
          </span>
        </div>
        <div className="text-right">
          <span className={`text-xs font-semibold inline-block ${isCompleted?"text-green-600":"text-teal-600"}`}>
            {Math.round(percentage)}%
          </span>
        </div>
      </div>
      <div className="flex rounded-full h-2 bg-gray-200">
        <div
          style={{ width: `${percentage}%` }}
          className={`rounded-full  ${isCompleted?"bg-green-600":"bg-teal-600"} transition-all duration-700 ease-out`}
        ></div>
      </div>
    </div>
  );
};

export default HorizontalProgress;
