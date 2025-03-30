import React from "react";
import CheckBox from "./CheckBox";
import Tiles from "./Tiles";
import { secondsToHHMM } from "../../utils/Coverter";

const DisplayVideo = ({ videoData, selectedVideoId, setSelectedVideoId, setVideoStatus, playlistId, userEmail, setIsOpen }) => {
  return (
    <div className="p-3 space-y-1">
      {videoData.map((video, index) => (
        <div
          key={video.videoId}
          className={`
            mb-2 
            rounded-md 
            ${selectedVideoId === video.videoId ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
          `}
        >
          <div className="flex items-center gap-2 p-2">
            <CheckBox
              onChange={() => setVideoStatus(video.videoId, playlistId, userEmail)}
              checked={video.done}
              size="sm"
            />
            
            <div className="flex-1 min-w-0">
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
        </div>
      ))}
    </div>
  );
};

export default DisplayVideo;