import React from "react";
import CheckBox from "./CheckBox";
import Tiles from "./Tiles";
import { secondsToHHMM } from "../../utils/Coverter";

const DisplaySection = ({ sectionData, selectedVideoId, setSelectedVideoId, setVideoStatus, playlistId, userEmail, setIsOpen }) => {
  return (
    <div className="p-4 space-y-3">
      {Object.entries(sectionData).map(([sectionId, section]) => (
        <div key={sectionId} className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              {section.name}
            </h3>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {section.completedLength}/{section.sectionLength} videos
            </div>
          </div>

          {section.videos.map((video) => (
            <div
              key={video.videoId}
              className={`
                relative group
                rounded-xl border 
                transition-all duration-300 ease-in-out
                hover:scale-[1.02] active:scale-[0.98]
                mb-3
                ${selectedVideoId === video.videoId
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 border-transparent shadow-lg shadow-blue-500/20"
                  : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                }
              `}
            >
              {/* Video Duration Tag */}
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

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent 
                            translate-x-[-200%] group-hover:translate-x-[200%] 
                            transition-transform duration-1000 ease-in-out 
                            rounded-xl overflow-hidden" />

              {/* Video Item Content */}
              <div className="relative flex items-center gap-3 p-1 lg:p-3">
                <CheckBox
                  onChange={() => setVideoStatus(video.videoId, playlistId, userEmail)}
                  checked={video.done}
                  className={selectedVideoId === video.videoId ? "text-white" : ""}
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
                  >
                    {video.title}
                  </Tiles>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default DisplaySection;