import React, { useContext, useState } from "react";
import CheckBox from "./CheckBox";
import Tiles from "./Tiles";
import { secondsToHHMM } from "../../utils/Coverter";
import { ChevronDown, ChevronUp, Lock } from 'lucide-react';
import { PlaylistsContext } from "../../context/PlaylistsContext";
import { AuthContext } from "../../context/auth/AuthContextBase";
import { setPlaylistVideoId } from "../../utils/VideoUtils";

const DisplaySection = ({ sectionData, setVideoStatus, playlistId, setIsOpen }) => {
  const [collapsedSections, setCollapsedSections] = useState({});
  const { playlistData, setFullPlaylistData } = useContext(PlaylistsContext);
  const { user } = useContext(AuthContext);

  const toggleSection = (sectionId) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  return (
    <div className="p-3">
      {Object.entries(sectionData).map(([sectionId, section]) => {
        const isCollapsed = collapsedSections[sectionId];
        // Calculate section progress safely
        const completed = typeof section.completedLength === 'number'
          ? section.completedLength
          : Array.isArray(section.videos)
            ? section.videos.filter(v => v.done).length
            : 0;
        const total = typeof section.sectionLength === 'number'
          ? section.sectionLength
          : Array.isArray(section.videos)
            ? section.videos.length
            : 0;
        const allCompleted = total > 0 && completed === total;
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
                  {completed}/{total}
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
                    key={video.videoId || videoIndex}
                    className={`mb-2 group rounded-md ${playlistData && playlistData.selectedVideoId === video.videoId ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                  >
                    <div className="flex items-center gap-2 p-2">
                      <CheckBox
                        onChange={() => setVideoStatus(video.videoId, playlistId, user.userId, sectionId, !video.done)}
                        checked={!!video.done}
                        size="sm"
                      />
                      <div className="flex-1 min-w-0">
                        <Tiles 
                          onClick={async () => {
                            try {
                              const updatedPlaylist = await setPlaylistVideoId(user.userId, playlistId, video.videoId);
                              setFullPlaylistData(updatedPlaylist);
                            } catch (e) {
                              // Optionally handle error
                            }
                            if (window.innerWidth < 640) {
                              setIsOpen(false);
                            }
                          }} 
                          selected={playlistData && playlistData.selectedVideoId === video.videoId}
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