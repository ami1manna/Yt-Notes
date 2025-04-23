import React, { useContext } from "react";
import CheckBox from "./CheckBox";
import Tiles from "./Tiles";
import { secondsToHHMM } from "../../utils/Coverter";
import { PlaylistContext } from "../../context/PlaylistsContext";
import { AuthContext } from "../../context/AuthContext";

const DisplayVideo = ({ videoData,  setVideoStatus, playlistId,  setIsOpen }) => {
  const {user} = useContext(AuthContext);
   
  const {setSelectedVideoId , userPlaylists} = useContext(PlaylistContext);
  return (
    <div className="p-3 space-y-1">
      {videoData.map((video, index) => (
        <div
          key={index}
          className={`
            mb-2 
            rounded-md 
            ${userPlaylists[playlistId].selectedVideoId === video.videoId ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
          `}
        >
          <div className="flex items-center gap-2 p-2">
            <CheckBox
              onChange={() => setVideoStatus(video.videoId, playlistId , user.email )}
              checked={video.done}
              size="sm"
            />
            
            <div className="flex-1 min-w-0">
              <Tiles 
                onClick={() => {
                  setSelectedVideoId(user.email , playlistId,video.videoId);
             
                  if (window.innerWidth < 640) {
                    setIsOpen(false);
                  }
                }} 
                selected={userPlaylists[playlistId].selectedVideoId === video.videoId}
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