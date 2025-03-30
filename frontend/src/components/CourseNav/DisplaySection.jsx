import React, { useState } from "react";
import CheckBox from "./CheckBox";
import Tiles from "./Tiles";
import { secondsToHHMM } from "../../utils/Coverter";
import { ChevronDown, ChevronUp, Lock } from 'lucide-react';

const DisplaySection = ({ sectionData, selectedVideoId, setSelectedVideoId, setVideoStatus, playlistId, userEmail, setIsOpen }) => {
  const [collapsedSections, setCollapsedSections] = useState({});

  const toggleSection = (sectionId) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  return (
    <div className="p-4">
      {Object.entries(sectionData).map(([sectionId, section], sectionIndex) => {
        const isCollapsed = collapsedSections[sectionId];
        const allCompleted = section.completedLength === section.sectionLength;
        
        return (
          <div key={sectionId} className="mb-6 last:mb-0">
            {/* Section header */}
            <div 
              onClick={() => toggleSection(sectionId)}
              className={`
                flex items-center justify-between 
                p-3 mb-2 
                bg-gray-50 dark:bg-gray-800/50
                rounded-xl cursor-pointer
                transition-colors duration-200
                hover:bg-gray-100 dark:hover:bg-gray-800
                ${allCompleted ? 'bg-green-50 dark:bg-green-900/20' : ''}
              `}
            >
              <div className="flex items-center space-x-2">
                <div className={`
                  w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium
                  ${allCompleted 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}
                `}>
                  {sectionIndex + 1}
                </div>
                <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200">
                  {section.name}
                </h3>
                
                {section.locked && (
                  <Lock className="w-4 h-4 text-gray-500" />
                )}
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {section.completedLength}/{section.sectionLength}
                </div>
                
                {isCollapsed ? (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                )}
              </div>
            </div>

            {/* Section content - collapsible */}
            {!isCollapsed && (
              <div className="pl-4 space-y-1 border-l-2 border-gray-200 dark:border-gray-700 ml-3">
                {section.videos.map((video, videoIndex) => (
                  <div
                    key={video.videoId}
                    className="mb-2 group"
                  >
                    <div className="flex items-start gap-2 p-2">
                      <CheckBox
                        onChange={() => setVideoStatus(video.videoId, playlistId, userEmail, sectionId)}
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
                          index={videoIndex + 1}
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
            )}
          </div>
        );
      })}
    </div>
  );
};

export default DisplaySection;