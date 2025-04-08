import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const CircularProgress = ({ progress = 0, target = 100, radius = 17, showText = true }) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => setAnimatedProgress(progress), 200);
    return () => clearTimeout(timeout);
  }, [progress]);

  const percentage = Math.min(100, Math.max(0, (animatedProgress / target) * 100));
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  const strokeWidth = radius * 0.25; // Slimmer stroke looks more modern
  const textSize = `${radius * 0.45}px`;

  // Determine color based on percentage
  const getColor = () => {
    if (percentage < 30) return "stroke-yellow-500";
    if (percentage < 70) return "stroke-blue-500";
    return "stroke-green-500";
  };

  return (
    <div className="relative inline-flex group" style={{ width: radius * 4, height: radius * 4 }}>
      <motion.svg 
        initial={{ rotate: -90 }}
        animate={{ rotate: -90 }}
        className="w-full h-full transition-transform duration-500 ease-out" 
        viewBox="0 0 100 100"
      >
        {/* Background track */}
        <circle
          className="fill-none stroke-gray-200 dark:stroke-gray-700 transition-colors duration-300"
          cx="50"
          cy="50"
          r={radius}
          strokeWidth={strokeWidth}
        />
        
        {/* Progress indicator */}
        <motion.circle
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`fill-none ${getColor()} transition-all duration-700 ease-out`}
          cx="50"
          cy="50"
          r={radius}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
        />
      </motion.svg>

      {showText && (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="font-medium text-gray-700 dark:text-white" 
            style={{ fontSize: textSize }}
          >
            {Math.round(percentage)}%
          </motion.span>
        </div>
      )}
      
      {/* Tooltip on hover */}
      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gray-800 text-white text-xs px-2 py-1 rounded pointer-events-none">
        {progress} of {target} completed
      </div>
    </div>
  );
};

export default CircularProgress;