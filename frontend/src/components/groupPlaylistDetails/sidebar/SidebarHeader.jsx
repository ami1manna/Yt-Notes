import { ListVideo, PanelLeft, Clock, Video } from "lucide-react";

const formatTotalDuration = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

const SidebarHeader = ({ details }) => {
  return (
    <div className="flex-shrink-0 p-4 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <ListVideo size={18} className="text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Playlist</h2>
        </div>
        <PanelLeft size={16} className="text-gray-500 dark:text-gray-400" />
      </div>

      {details && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-3 rounded-lg">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-1 line-clamp-2">
            {details.playlistTitle}
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">by {details.channelTitle}</p>
          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <Video size={10} />
              {details.videos?.length || 0} videos
            </span>
            <span className="flex items-center gap-1">
              <Clock size={10} />
              {formatTotalDuration(details.totalDuration || 0)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SidebarHeader;
