 
import { formatDuration } from '@/utils/Coverter';
import ModalContainer from '@/components/dialogs/ModalContainer';
 
 
import { X, Play, Clock, ExternalLink } from 'lucide-react';

const VideoModal = ({ isOpen, onClose, video }) => {
  if (!video) return null;

  const handleWatchOnYoutube = () => {
    window.open(`https://www.youtube.com/watch?v=${video.videoId}`, '_blank');
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <ModalContainer isOpen={isOpen}>
      <div 
        className="fixed inset-0 z-[999] flex items-center justify-center p-4"
        onClick={handleOverlayClick}
      >
        {/* Modal Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Video Details
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X size={20} className="text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto">
            {/* Video Thumbnail */}
            <div className="relative mb-6 group">
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="w-full h-64 object-cover rounded-lg"
              />
              {/* Play Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={handleWatchOnYoutube}
                  className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-full transition-colors"
                >
                  <Play size={32} fill="currentColor" />
                </button>
              </div>
              {/* Duration Badge */}
              <div className="absolute bottom-3 right-3 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm font-mono flex items-center gap-1">
                <Clock size={14} />
                {formatDuration(video.duration)}
              </div>
            </div>

            {/* Video Info */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                {video.title}
              </h3>

              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Clock size={16} />
                  <span>Duration: {formatDuration(video.duration)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <ExternalLink size={16} />
                  <span>ID: {video.videoId}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleWatchOnYoutube}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Play size={18} />
                  Watch on YouTube
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModalContainer>
  );
};

export default VideoModal;