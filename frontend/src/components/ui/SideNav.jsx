import React, { useMemo } from 'react';
import { ChevronRight, CheckCircle2, Circle } from 'lucide-react';

const SideNav = ({ 
  playListData, 
  selectedVideoId, 
  setSelectedVideoId, 
  setVideoStatus 
}) => {
  // Organize videos into sections, preserving original order
  const organizedSections = useMemo(() => {
    const { sections, videos, videoOrder } = playListData;

    // If no sections are defined, create a default section with all videos
    if (!sections || Object.keys(sections).length === 0) {
      return [{
        name: 'All Videos',
        videoIds: videoOrder,
        progressPercentage: 0,
        completedLength: 0,
        sectionLength: videoOrder.length
      }];
    }

    // Transform sections, ensuring they maintain order and filter out empty sections
    return Object.values(sections)
      .filter(section => section.videoIds.length > 0)
      .sort((a, b) => 
        Object.keys(sections).indexOf(a._id) - 
        Object.keys(sections).indexOf(b._id)
      )
      .map(section => ({
        ...section,
        // Ensure only videos from videoOrder are included
        videoIds: section.videoIds.filter(videoId => 
          videoOrder.includes(videoId)
        )
      }));
  }, [playListData]);

  return (
    <div className="bg-gray-900 text-white w-72 h-screen overflow-y-auto p-4 shadow-lg">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-200">
          {playListData.channelTitle || 'Playlist'}
        </h2>
        <div className="flex items-center text-sm text-gray-400 mt-1">
          <span>{playListData.playlistLength} Videos</span>
          <span className="mx-2">•</span>
          <span>
            Total Progress: {Math.round(
              (playListData.playlistProgress / playListData.playlistLength) * 100
            )}%
          </span>
        </div>
      </div>

      {organizedSections.map((section, sectionIndex) => (
        <div key={section._id || `section-${sectionIndex}`} className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-gray-200">
              {section.name}
            </h3>
            <div className="text-sm text-gray-400">
              {section.completedLength} / {section.sectionLength}
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg mb-2">
            <div 
              className="h-1 bg-blue-500 rounded-lg" 
              style={{ width: `${section.progressPercentage}%` }}
            />
          </div>

          {section.videoIds.map((videoId) => {
            const video = playListData.videos[videoId];
            const isSelected = selectedVideoId === videoId;

            if (!video) return null;

            return (
              <div 
                key={videoId}
                className={`
                  flex items-center p-2 cursor-pointer rounded-lg transition-colors duration-200
                  ${isSelected 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'hover:bg-gray-700'
                  }
                `}
                onClick={() => {
                  setSelectedVideoId(videoId);
                  setVideoStatus(video.done);
                }}
              >
                {video.done ? (
                  <CheckCircle2 className="w-5 h-5 text-green-400 mr-2" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-500 mr-2" />
                )}
                <div className="flex-1">
                  <div className={`
                    text-sm truncate max-w-[200px]
                    ${isSelected ? 'text-white' : 'text-gray-300'}
                  `}>
                    {video.title}
                  </div>
                  <div className="text-xs text-gray-400">
                    {Math.floor(video.duration / 60)} mins
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default SideNav;