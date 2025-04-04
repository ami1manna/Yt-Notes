import React, { useContext, useState } from "react";
import CheckBox from "./CheckBox";
import Tiles from "./Tiles";
import { secondsToHHMM } from "../../utils/Coverter";
import { ChevronDown, ChevronUp, Lock } from 'lucide-react';
import { PlaylistContext } from "../../context/PlaylistsContext";
import { AuthContext } from "../../context/AuthContext";

const DisplaySection = ({ sectionData, setVideoStatus, playlistId,  setIsOpen }) => {
  const [collapsedSections, setCollapsedSections] = useState({});
  const {setSelectedVideoId , userPlaylists} = useContext(PlaylistContext);
  const {user} = useContext(AuthContext);

  const toggleSection = (sectionId) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  return (
    <div className="p-3">
      {Object.entries(sectionData).map(([sectionId, section], sectionIndex) => {
        const isCollapsed = collapsedSections[sectionId];
        const allCompleted = section.completedLength === section.sectionLength;
        
        return (
          <div key={sectionId} className="mb-4 last:mb-0">
            {/* Section header */}
            <div 
              onClick={() => toggleSection(sectionId)}
              className={`
                flex items-center justify-between 
                p-3 mb-2 
                bg-white dark:bg-gray-800
                rounded-lg cursor-pointer
                border border-gray-200 dark:border-gray-700
                transition-colors duration-200
                hover:bg-gray-50 dark:hover:bg-gray-750
                ${allCompleted ? 'border-green-500' : ''}
              `}
            >
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200">
                  {section.name}
                </h3>
                
                {section.locked && (
                  <Lock className="w-4 h-4 text-gray-500" />
                )}
              </div>
              
              <div className="flex items-center gap-3">
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
              <div className="pl-4 space-y-1 border-l-2 border-gray-200 dark:border-gray-700 ml-2">
                {section.videos.map((video, videoIndex) => (
                  <div
                    key={video.videoId}
                    className={`
                      mb-2 group rounded-md
                      ${userPlaylists[playlistId].selectedVideoId === video.videoId ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
                    `}
                  >
                    <div className="flex items-center gap-2 p-2">
                      <CheckBox
                        onChange={() => setVideoStatus(video.videoId, playlistId, user.email, sectionId)}
                        checked={video.done}
                        size="sm"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <Tiles 
                          onClick={() => {
                             
                            setSelectedVideoId(user.email , playlistId,video.videoId);
                            // Close sidebar on mobile after selection
                            if (window.innerWidth < 640) {
                              setIsOpen(false);
                            }
                          }} 
                          selected={userPlaylists[playlistId].selectedVideoId === video.videoId}
                          duration={secondsToHHMM(video.duration)}
                          index={videoIndex + 1}
                        >
                          {video.title}
                        </Tiles>
                      </div>
                    </div>
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