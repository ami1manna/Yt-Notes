import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import AllConnectedUsers from "../common/AllConnectedUsers";
import {
  groupPlaylistDetailsSelectors,
} from "@/store/groupPlaylist";
import { selectUsersByPlaylist } from "../../store/presence/presenceSelectors";

const TopBar = () => {
  const {  playlistId } = useParams();

  const currentVideo = useSelector(groupPlaylistDetailsSelectors.getCurrentVideo);
   
  return (
    <div className="w-full flex justify-between items-center px-6 py-2 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      {/* Current Video Title */}
      <div className="flex-1 min-w-0 mr-4">
        {currentVideo?.title ? (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
              {currentVideo.title}
            </h1>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full" />
            <span className="text-gray-500 dark:text-gray-400 text-sm">
              No video selected
            </span>
          </div>
        )}
      </div>

      {/* Connected Users */}
      <div className="flex-shrink-0">
        <AllConnectedUsers selector={(state) => selectUsersByPlaylist(state, playlistId)} tooltip={false}/>
      </div>
    </div>
  );
};

export default TopBar;