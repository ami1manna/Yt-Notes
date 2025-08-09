import { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { groupPlaylistDetailsSelectors } from "@/store/groupPlaylist";

import SidebarHeader from "./SidebarHeader";
import SidebarTabs from "./SidebarTabs";
import SectionPanel from "./SectionPanel";
import VideoItem from "./VideoItem";
import SidebarFooter from "./SidebarFooter";
import IconButton from "@/components/common/IconButton";

import { setSelectedVideo } from "@/store/groupPlaylist/groupPlaylistSlice";
import { usePresence } from "../../../store/presence/usePresence";
import { useAuth } from "@/context/auth/AuthContextBase";
import { useParams } from "react-router-dom";
import { PlusIcon, Video } from "lucide-react";

const SidebarNav = () => {
  const user = useAuth();
  const { groupId, playlistId } = useParams();
  const [activeTab, setActiveTab] = useState("order");
  const [expandedSections, setExpandedSections] = useState(new Set());
  const [isHovered, setIsHovered] = useState(false);

  const dispatch = useDispatch();
  const currentVideo = useSelector(
    groupPlaylistDetailsSelectors.getCurrentVideo
  );
  const details = useSelector(
    groupPlaylistDetailsSelectors.getGroupPlaylistDetails
  );

  const sections = details?.sections || [];
  const videoOrder = details?.videoOrder || [];

  const videosById = useMemo(() => {
    const map = {};
    details?.videos?.forEach((video) => {
      map[video.videoId] = video;
    });
    return map;
  }, [details?.videos]);

  useMemo(() => {
    if (!currentVideo && videoOrder.length > 0) {
      dispatch(setSelectedVideo(videosById[videoOrder[0]]));
    }
  }, [videoOrder, currentVideo, dispatch, videosById]);

  // presence
  usePresence({
    groupId,
    playlistId,
    videoId: currentVideo?.videoId,
    user,
  });

  const toggleSection = (sectionId) => {
    const newExpanded = new Set(expandedSections);
    newExpanded.has(sectionId)
      ? newExpanded.delete(sectionId)
      : newExpanded.add(sectionId);
    setExpandedSections(newExpanded);
  };

  return (
    <>
      <div
        className="fixed top-0 left-0 w-5 h-screen z-20"
        onMouseEnter={() => setIsHovered(true)}
      />
      <aside
        className={`fixed top-0 left-0 h-screen bg-white dark:bg-gray-900 shadow-xl z-30 flex flex-col transition-all duration-300 ease-in-out ${
          isHovered ? "w-96 translate-x-0" : "w-96 -translate-x-full"
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <SidebarHeader details={details} />
        <SidebarTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="flex-1 overflow-y-auto p-4 ">
          {activeTab === "sections" ? (
            <div className="space-y-4 h-full"  >
              {sections.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-4  h-full ">
                <h2 className="text-center text-gray-500 dark:text-gray-400">
                  No sections
                </h2>
                
                </div>
              ) : (
                sections.map((section, i) => (
                  <SectionPanel
                    key={section.sectionId}
                    section={section}
                    index={i}
                    videosById={videosById}
                    currentVideo={currentVideo}
                    
                    isExpanded={expandedSections.has(section.sectionId)}
                    toggleSection={toggleSection}
                  />
                ))
              )}
            </div>
          ) : (
            <div className="space-y-1">
              {videoOrder.map((videoId, index) => {
                const video = videosById[videoId];
                return (
                  <VideoItem
                    key={videoId}
                    video={video}
                    index={index}
                    isActive={currentVideo?.videoId === videoId}
                    onClick={() => dispatch(setSelectedVideo(video))}
                    showIndex
                  />
                );
              })}
            </div>
          )}
        </div>

        {currentVideo && (
          <SidebarFooter
            currentIndex={videoOrder.findIndex(
              (id) => id === currentVideo.videoId
            )}
            total={videoOrder.length}
          />
        )}
      </aside>
    </>
  );
};

export default SidebarNav;
