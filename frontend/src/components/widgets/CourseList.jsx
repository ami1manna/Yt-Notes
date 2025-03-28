import React, { useContext } from "react";
import { PlaylistContext } from "../../context/PlaylistsContext";
import VideoCard from "../ui/VideoCard";
import FallBackScreen from "./FallBackScreen";
import { NavLink } from "react-router-dom";

const CourseList = () => {
  const { userPlaylists } = useContext(PlaylistContext);

  return (
    <>
    {console.log(userPlaylists)}
      {Object.keys(userPlaylists).length === 0 ? (
        <FallBackScreen />
      ) : (
        <div className="h-max grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 w-full auto-rows-auto">
          {Object.entries(userPlaylists).map(([playlistId, playlist]) => (
            <NavLink to={`/courseScreen/${playlistId}`} key={playlistId}>
              <VideoCard
                title={playlist.channelTitle || playlist.title || "Untitled Playlist"}
                thumbnailUrl={playlist.playlistThumbnailUrl || ""}
                progress={playlist.playlistProgress || 0}
                target={playlist.playlistLength || 0}
              />
            </NavLink>
          ))}
        </div>
      )}
    </>
  );
};

export default CourseList;
