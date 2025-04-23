import React, { useContext, useEffect, useState } from "react";
import { PlaylistContext } from "../../context/PlaylistsContext";
import VideoCard from "../ui/VideoCard";
import FallBackScreen from "./FallBackScreen";
import { NavLink } from "react-router-dom";
import { deletePlaylist, fetchUserPlaylists } from "../../utils/PlaylistUtils"; 
import { TrashIcon } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const CourseList = () => {
  const { userPlaylists, setPlaylistData } = useContext(PlaylistContext);
  const { user } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const hasPlaylists = Object.keys(userPlaylists).length > 0;

  // Refresh playlists when component mounts or after deletion
  useEffect(() => {
    if (user && user.email) {
      fetchUserPlaylists(user.email, setPlaylistData);
    }
  }, [user, setPlaylistData]);

  const handleDelete = async (e, playlistId) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (window.confirm("Are you sure you want to delete this course?")) {
      setIsDeleting(true);
      
      try {
        await deletePlaylist(user.email, playlistId, setPlaylistData);
        // Force refresh after deletion - as a backup
        await fetchUserPlaylists(user.email, setPlaylistData);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="w-full">
      {!hasPlaylists ? (
        <FallBackScreen />
      ) : (
        <>
          <h2 className="text-xl font-semibold mb-4">Your Courses</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 gap-y-6">
            {Object.entries(userPlaylists).map(([playlistId, playlist]) => (
              <div key={playlistId} className="relative group">
                <NavLink 
                  to={`/courseScreen/${playlistId}`}
                  className="block h-full transition-transform duration-200 hover:no-underline"
                >
                  <VideoCard
                    title={playlist.playlistTitle || "Untitled Playlist"}
                    thumbnailUrl={playlist.playlistThumbnailUrl || "https://via.placeholder.com/320x180?text=No+Thumbnail"}
                    progress={playlist.playlistProgress || 0}
                    target={playlist.playlistLength || 1}
                  />
                </NavLink>
                <button
                  onClick={(e) => handleDelete(e, playlistId)}
                  disabled={isDeleting}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 disabled:bg-gray-400"
                  title="Delete course"
                >
                  <TrashIcon size={16} />
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CourseList;