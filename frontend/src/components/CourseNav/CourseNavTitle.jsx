import React from "react";
import { Clock } from 'lucide-react';
import CircularProgress from "./CircularProgress";
import { formatDuration } from "../../utils/Coverter";

const CourseNavTitle = ({ playListData, isOpen }) => {
  return (
    <div className="sticky top-0 z-20 px-4 backdrop-blur-md bg-white/80 dark:bg-gray-800/80 
                 border-b border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center py-3">
        {/* This space is reserved for the close button in the parent component */}
      </div>

      <div className={`flex items-center gap-3 bg-green-500/10 p-3 my-2 rounded-xl
                transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
        <Clock className="w-5 h-5 text-green-500" />
        <div className="flex lg:flex-col justify-center items-center lg:items-start gap-4 lg:gap-0">
          <span className="text-lg text-gray-600 dark:text-gray-300">Total Duration</span>
          <span className="text-lg font-bold text-green-500">
            {formatDuration(playListData.totalDuration)}
          </span>
        </div>
        <div className="lg:hidden flex-1 flex justify-end">
          <CircularProgress
            target={playListData.playlistLength}
            progress={playListData.playlistProgress}
            radius={20}
          />
        </div>
      </div>
    </div>
  );
};

export default CourseNavTitle;