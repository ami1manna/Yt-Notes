import { useContext, useEffect, useState } from "react";
import { PlaylistSummariesContext } from "../../context/PlaylistSummariesContext";
import VideoCard from "../ui/VideoCard";
import FallBackScreen from "./FallBackScreen";
import { NavLink } from "react-router-dom";
import { deletePlaylist, fetchUserPlaylistSummaries } from "../../utils/PlaylistUtils";
import { TrashIcon } from "lucide-react";
import { useAuth } from "../../context/auth/AuthContextBase";

const CourseList = () => {
  const { userPlaylistSummaries, setPlaylistSummaries } = useContext(PlaylistSummariesContext);
  const { user } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const hasPlaylists = Array.isArray(userPlaylistSummaries) && userPlaylistSummaries.length > 0;

  // Refresh playlist summaries when component mounts or after deletion
  useEffect(() => {
    if (user && user.userId) {
      fetchUserPlaylistSummaries(user.userId, setPlaylistSummaries);
    }
    // Only run on user change
    // eslint-disable-next-line
  }, [user,userPlaylistSummaries]);

  const handleDelete = async (e, playlistId) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this course?")) {
      setIsDeleting(true);
      try {
        await deletePlaylist(user.userId, playlistId, setPlaylistSummaries);
        // Force refresh after deletion - as a backup
        await fetchUserPlaylistSummaries(user.userId, setPlaylistSummaries);
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
            {userPlaylistSummaries.map((playlist) => (
              <div key={playlist.playlistId} className="relative group">
                <NavLink
                  to={`/courseScreen/${playlist.playlistId}`}
                  className="block h-full transition-transform duration-200 hover:no-underline"
                >
                  <VideoCard
                    title={playlist.playlistTitle || "Untitled Playlist"}
                    thumbnailUrl={playlist.playlistThumbnailUrl || "https://via.placeholder.com/320x180?text=No+Thumbnail"}
                    progress={playlist.playlistProgress || 0}
                    target={playlist.totalVideos || 1}
                  />
                </NavLink>
                <button
                  onClick={(e) => handleDelete(e, playlist.playlistId)}
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