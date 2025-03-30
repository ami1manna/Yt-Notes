import React from "react";
import CheckBox from "./CheckBox";
import Tiles from "./Tiles";
import { secondsToHHMM } from "../../utils/Coverter";

const DisplayVideo = ({ videoData, selectedVideoId, setSelectedVideoId, setVideoStatus, playlistId, userEmail, setIsOpen }) => {
  return (
    <div className="p-4 space-y-1">
      {videoData.map((video, index) => (
        <div
          key={video.videoId}
          className="mb-2 group"
        >
          <div className="flex items-start gap-2 p-2">
            <CheckBox
              onChange={() => setVideoStatus(video.videoId, playlistId, userEmail)}
              checked={video.done}
              size="sm"
            />
            
            <div className="flex-1">
              <Tiles 
                onClick={() => {
                  setSelectedVideoId(video.videoId);
                  // Close sidebar on mobile after selection
                  if (window.innerWidth < 640) {
                    setIsOpen(false);
                  }
                }} 
                selected={selectedVideoId === video.videoId}
                duration={secondsToHHMM(video.duration)}
                index={index + 1}
              >
                {video.title}
              </Tiles>
            </div>
          </div>
          
          {/* Progress indicator for videos in progress */}
          {video.progress && video.progress < 100 && !video.done && (
            <div className="ml-10 mt-1 mb-2">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                <div 
                  className="bg-green-500 h-1 rounded-full"
                  style={{ width: `${video.progress}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {Math.round(video.progress)}% watched
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default DisplayVideo;