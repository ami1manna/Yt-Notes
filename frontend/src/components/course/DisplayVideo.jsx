import React, { useContext } from "react";
import CheckBox from "../course/CheckBox";
import Tiles from "../course/Tiles";
import { secondsToHHMM } from "../../utils/Coverter";
import { setPlaylistVideoId } from "../../utils/VideoUtils";
import { PlaylistsContext } from "../../context/PlaylistsContext";
import { useAuth } from "@/context/auth/AuthContextBase";

const DisplayVideo = ({ videoData, setVideoStatus, playlistId, setIsOpen }) => {
  const { user } = useAuth();
  const { playlistData, setFullPlaylistData } = useContext(PlaylistsContext);
  return (
    <div className="p-3 space-y-1">
      {videoData.map((video, index) => (
        <div
          key={video.videoId || index}
          className={`mb-2 rounded-md ${playlistData && playlistData.selectedVideoId === video.videoId ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
        >
          <div className="flex items-center gap-2 p-2">
            <CheckBox
              onChange={() => setVideoStatus(video.videoId, playlistId, user.userId, undefined, !video.done)}
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