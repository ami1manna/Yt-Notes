import { ChevronDown, ChevronRight, Video } from "lucide-react";
import VideoItem from "./VideoItem";
import { setSelectedVideo } from "@/store/groupPlaylist/groupPlaylistSlice";
import { useDispatch } from "react-redux";

const SectionPanel = ({
  section,
  index,
  videosById,
  currentVideo,
  isExpanded,
  toggleSection,
}) => {

  console.log(currentVideo);
  // console.log(section);
    const dispatch = useDispatch();

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <button
        onClick={() => toggleSection(section.sectionId)}
        className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
              {index + 1}
            </span>
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-left line-clamp-2">
            {section.name}
          </h3>
        </div>
        <div className="flex items-center gap-2">
           <span className=" text-gray-500 dark:text-gray-400 ">
            <Video size={20} className="text-gray-400"/>
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-600 px-2 py-1 rounded-full">
            {section.videoIds.length}  
          </span>
         
          {isExpanded ? (
            <ChevronDown size={16} className="text-gray-500 dark:text-gray-400" />
          ) : (
            <ChevronRight size={16} className="text-gray-500 dark:text-gray-400" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="p-2 space-y-1 bg-white dark:bg-gray-900">
          {section.videoIds.map((videoId, i) => {
            const video = videosById[videoId];
            return (
              <VideoItem
                key={videoId}
                video={video}
                index={i}
                isActive={currentVideo?.videoId === videoId}
                onClick={() => {
                  dispatch(setSelectedVideo(video))
                  
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SectionPanel;
