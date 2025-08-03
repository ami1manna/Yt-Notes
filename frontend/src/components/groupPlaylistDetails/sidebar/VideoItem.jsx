import { Clock, Video } from "lucide-react";

const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const getVideoThumbnail = (videoId) =>
  `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;

const VideoItem = ({ video, index, isActive, onClick, showIndex = false }) => (
  <div
    className={`group flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 ${
      isActive
        ? "bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500"
        : ""
    }`}
    onClick={onClick}
  >
    <div className="flex-shrink-0 relative">
      <img
        src={getVideoThumbnail(video?.videoId)}
        alt={video?.title}
        className="w-16 h-12 rounded-lg object-cover"
        onError={(e) => {
          e.target.style.display = "none";
          e.target.nextSibling.style.display = "flex";
        }}
      />
      <div className="w-16 h-12 rounded-lg bg-gray-200 dark:bg-gray-700 hidden items-center justify-center">
        <Video size={20} className="text-gray-400" />
      </div>
      <div className="absolute bottom-1 right-1 bg-black bg-opacity-75 text-white text-xs px-1 rounded">
        {formatDuration(video?.duration || 0)}
      </div>
      {showIndex && (
        <div
          className={`absolute -top-1 -left-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
            isActive
              ? "bg-blue-500 text-white"
              : "bg-gray-600 dark:bg-gray-400 text-white dark:text-gray-900"
          }`}
        >
          {index + 1}
        </div>
      )}
    </div>
    <div className="flex-1 min-w-0">
      <h4
        className={`text-sm font-medium line-clamp-2 ${
          isActive
            ? "text-blue-700 dark:text-blue-300"
            : "text-gray-900 dark:text-gray-100"
        }`}
      >
        {video?.title || "Unknown Video"}
      </h4>
      <div className="flex items-center gap-1 mt-1">
        <Clock size={10} className="text-gray-400" />
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {formatDuration(video?.duration || 0)}
        </span>
      </div>
    </div>
  </div>
);

export default VideoItem;
