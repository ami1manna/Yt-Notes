import React, { useContext } from "react";
import { PlaylistContext } from "../../context/PlaylistsContext";
import VideoCard from "../ui/VideoCard";
import FallBackScreen from "./FallBackScreen";
import { NavLink } from "react-router-dom";

const CourseList = () => {
  const { userPlaylists } = useContext(PlaylistContext);
  const hasPlaylists = Object.keys(userPlaylists).length > 0;

  return (
    <div className="w-full">
      {!hasPlaylists ? (
        <FallBackScreen />
      ) : (
        <>
          <h2 className="text-xl font-semibold mb-4">Your Courses</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 gap-y-6">
            {Object.entries(userPlaylists).map(([playlistId, playlist]) => (
              <NavLink 
                to={`/courseScreen/${playlistId}`} 
                key={playlistId}
                className="block h-full transition-transform duration-200 hover:no-underline"
              >
                <VideoCard
                  title={playlist.playlistTitle || "Untitled Playlist"}
                  thumbnailUrl={playlist.playlistThumbnailUrl || "https://via.placeholder.com/320x180?text=No+Thumbnail"}
                  progress={playlist.playlistProgress || 0}
                  target={playlist.playlistLength || 1}
                />
              </NavLink>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CourseList;