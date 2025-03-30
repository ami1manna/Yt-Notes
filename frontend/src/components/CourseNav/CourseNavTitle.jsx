import React from "react";
import { Clock, BookOpen, Video } from 'lucide-react';
import CircularProgress from "./CircularProgress";
import { formatDuration } from "../../utils/Coverter";

const CourseNavTitle = ({ playListData, isOpen, progress, total, percentComplete }) => {
  return (
    <div className="px-1 py-3">
      <div className="flex items-center gap-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-3 my-2 rounded-xl shadow-sm">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Clock className="w-4 h-4 text-green-500 mr-2" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {formatDuration(playListData.totalDuration)}
              </span>
            </div>
            
            <div className="flex items-center">
              <Video className="w-4 h-4 text-blue-500 mr-2" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {progress}/{total} videos
              </span>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
            <div 
              className="bg-gradient-to-r from-green-500 to-blue-500 h-1.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${percentComplete}%` }}
            />
          </div>
          
          <div className="flex justify-end mt-1">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {percentComplete}% complete
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};


export default CourseNavTitle;