import { useSelector } from "react-redux";
import { useState, useMemo } from "react";
import { groupPlaylistDetailsSelectors } from "@/store/groupPlaylist";
import SidebarHeader from "./SidebarHeader";
import SidebarTabs from "./SidebarTabs";
import SectionPanel from "./SectionPanel";
import VideoItem from "./VideoItem";
import SidebarFooter from "./SidebarFooter";

const SidebarNav = () => {
  const [activeTab, setActiveTab] = useState("sections");
  const [currentVideo, setCurrentVideo] = useState(null);
  const [expandedSections, setExpandedSections] = useState(new Set());
  const [isHovered, setIsHovered] = useState(false);

  const details = useSelector(groupPlaylistDetailsSelectors.getGroupPlaylistDetails);
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
      setCurrentVideo(videoOrder[0]);
    }
  }, [videoOrder, currentVideo]);

  const toggleSection = (sectionId) => {
    const newExpanded = new Set(expandedSections);
    newExpanded.has(sectionId) ? newExpanded.delete(sectionId) : newExpanded.add(sectionId);
    setExpandedSections(newExpanded);
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-5 h-screen z-20 " onMouseEnter={() => setIsHovered(true)} />
      <aside
        className={`fixed top-0 left-0 h-screen bg-white dark:bg-gray-900 shadow-xl z-30 flex flex-col transition-all duration-300 ease-in-out ${
          isHovered ? "w-96 translate-x-0" : "w-96 -translate-x-full"
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <SidebarHeader details={details} />

        <SidebarTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === "sections" ? (
            <div className="space-y-4">
              {sections.map((section, i) => (
                <SectionPanel
                  key={section.sectionId}
                  section={section}
                  index={i}
                  videosById={videosById}
                  currentVideo={currentVideo}
                  setCurrentVideo={setCurrentVideo}
                  isExpanded={expandedSections.has(section.sectionId)}
                  toggleSection={toggleSection}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-1">
              {videoOrder.map((videoId, index) => (
                <VideoItem
                  key={videoId}
                  video={videosById[videoId]}
                  index={index}
                  isActive={currentVideo === videoId}
                  onClick={() => setCurrentVideo(videoId)}
                  showIndex
                />
              ))}
            </div>
          )}
        </div>

        {currentVideo && (
          <SidebarFooter currentIndex={videoOrder.indexOf(currentVideo)} total={videoOrder.length} />
        )}
      </aside>
    </>
  );
};

export default SidebarNav;
