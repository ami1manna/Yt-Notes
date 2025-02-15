import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Tiles from "./Tiles";
import CheckBox from "./CheckBox";
import CircularProgress from "./CircularProgress";
import { formatDuration, secondsToHHMM } from "../../utils/Coverter";
import { Clock, ListChecks } from 'lucide-react';

const SideNav = ({ playListData, selectedVideoIndex, setSelectedVideoIndex, setVideoStatus }) => {
  const { user } = useContext(AuthContext);

  return (
    <div className="h-full w-80 flex flex-col bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl overflow-hidden">
      {/* Header Section */}
      <div className="sticky top-0 z-20 p-4 backdrop-blur-md bg-white/80 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center ">
          <div className="flex items-center gap-2">
            <ListChecks className="w-5 h-5 text-green-500" />
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              Course Progress
            </h2>
           
          </div>
          <CircularProgress 
            target={playListData.playlistLength} 
            progress={playListData.playlistProgress}
            radius={19}
          />
        </div>
        
        <div className="flex items-center gap-3 bg-green-500/10 p-3 rounded-xl">
          <Clock className="w-5 h-5 text-green-500" />
          <div className="flex flex-col">
            <span className="text-sm text-gray-600 dark:text-gray-300">Total Duration</span>
            <span className="text-lg font-bold text-green-500">
              {formatDuration(playListData.totalDuration)}
            </span>
          </div>
        </div>
      </div>

      {/* Videos List */}
      <div className="flex-1 overflow-hidden overflow-y-auto p-4 space-y-3">

        {playListData.videos.map((video, index) => (
          <div
            key={video.videoId}
            className={`
              relative group
              rounded-xl border 
              transition-all duration-300 ease-in-out
              hover:scale-[1.02] active:scale-[0.98]
              ${
                selectedVideoIndex === index 
                ? "bg-gradient-to-r from-blue-500 to-blue-600 border-transparent shadow-lg shadow-blue-500/20" 
                : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              }
            `}
          >
            {/* Duration Badge */}
            <div className="absolute -top-1 -left-1 z-10
                          transform -rotate-12 transition-transform duration-300
                          group-hover:rotate-0 group-hover:-translate-y-1">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 
                            text-white text-xs font-bold px-3 py-1 
                            rounded-br-xl rounded-tl-lg shadow-md
                            transition-colors duration-300
                            group-hover:from-green-400 group-hover:to-emerald-500">
                {secondsToHHMM(video.duration)}
              </div>
            </div>

            {/* Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent 
                          translate-x-[-200%] group-hover:translate-x-[200%] 
                          transition-transform duration-1000 ease-in-out 
                          rounded-xl overflow-hidden" />

            {/* Content */}
            <div className="relative flex items-center gap-3 p-3">
              <CheckBox
                onChange={() => setVideoStatus(video.videoId, playListData.playlistId, user.email)}
                checked={video.done}
                className={selectedVideoIndex === index ? "text-white" : ""}
              />
              <div className="flex-1">
                <Tiles onClick={() => setSelectedVideoIndex(index)} selected={selectedVideoIndex === index}>
                  {video.title}
                </Tiles>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


export default SideNav;