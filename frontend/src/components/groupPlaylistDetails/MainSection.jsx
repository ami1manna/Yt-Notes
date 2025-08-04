import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { groupPlaylistDetailsSelectors } from "@/store/groupPlaylist";
import { usePresence } from "../../store/presence/usePresence";
 import { useAuth } from "@/context/auth/AuthContextBase";
 
const MainSection = () => {
  const { groupId, playlistId } = useParams();
  const user = useAuth();
  const selectedVideo = useSelector(
    groupPlaylistDetailsSelectors.getCurrentVideo
  );

  usePresence(groupId, playlistId , selectedVideo?.videoId, user);

  if (!selectedVideo) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Select a video to start watching.
      </div>
    );
  }

  return (
    <div className="flex-1 relative p-4">
      <div className="relative w-full h-full rounded-xl overflow-hidden">
        <iframe
          key={selectedVideo.videoId}
          className="absolute top-0 left-0 w-full h-full rounded-xl shadow-xl"
          src={`https://www.youtube.com/embed/${selectedVideo.videoId}?modestbranding=1&rel=0`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Embedded YouTube video"
        />
      </div>
    </div>
  );
};

export default MainSection;
