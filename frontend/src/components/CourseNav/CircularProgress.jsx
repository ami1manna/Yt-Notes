import React, { useEffect, useState } from "react";

const CircularProgress = ({ progress = 0, target = 100, radius = 17}) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => setAnimatedProgress(progress), 200); // Delay for smooth transition
    return () => clearTimeout(timeout);
  }, [progress]);

  const percentage = Math.min(100, Math.max(0, (animatedProgress / target) * 100));
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  const strokeWidth = radius * 0.35;
  const textSize = `${radius * 0.40}px`;

  return (
    <div className="relative group" style={{width:"70px",height:"70px"}}> 
    {/* { width: radius * 4.5, height: radius * 4.5 } */}
      <svg className="w-full h-full transform -rotate-90 transition-transform duration-500 ease-out" viewBox="0 0 100 100">
        <circle
          className="fill-none"
          cx="50"
          cy="50"
          r={radius}
          strokeWidth={strokeWidth}
          stroke="gray"
        />
        <circle
          className={`fill-none transition-all duration-700 ease-out stroke-green-500`}
          cx="50"
          cy="50"
          r={radius}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>

      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold text-gray-700 dark:text-white" style={{ fontSize: textSize }}>
          {Math.round(percentage)}%
        </span>
      </div>
    </div>
  );
};

export default CircularProgress;
