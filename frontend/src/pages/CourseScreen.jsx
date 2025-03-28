import React, { useContext, useState, useEffect, useRef } from "react";
import { PlaylistContext } from "../context/PlaylistsContext";
import { useParams } from "react-router-dom";
import SideNav from "../components/ui/SideNav";
import IconButton from "../components/ui/IconButton";
import { ArrowBigLeftDash, ArrowBigRightDash } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import TranscriptList from "../components/widgets/TranscriptList";
import Editor from "../components/Editor/Editor";
import SummaryList from "../components/widgets/SummaryList";

const CourseScreen = () => {
  const { userPlaylists, setVideoStatus, setSelectedVideo } = useContext(PlaylistContext);
  const { playlistId } = useParams();
  
  // Find the specific playlist by its ID
  const playListData = Object.values(userPlaylists).find(
    playlist => playlist.playlistId === playlistId
  );

  const { user } = useContext(AuthContext);
  
  // Use selectedVideoId instead of index
  const [selectedVideoId, setSelectedVideoId] = useState(
    playListData?.selectedVideoId || playListData?.videoOrder?.[0]
  );

  // Find the selected video using the videoId
  const selectedVideo = playListData?.videos?.[selectedVideoId] || null;

  // State for resizable panels
  const [isMobile, setIsMobile] = useState(false);
  const [videoPanelWidth, setVideoPanelWidth] = useState(50);
  const [isResizing, setIsResizing] = useState(false);
  const resizeRef = useRef(null);
  const containerRef = useRef(null);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (playListData && selectedVideoId !== playListData.selectedVideoId) {
      setSelectedVideo(user.email, playListData.playlistId, selectedVideoId);
    }
  }, [selectedVideoId, playListData, setSelectedVideo, user?.email]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) {
        setVideoPanelWidth(30);
      } else {
        setVideoPanelWidth(50);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleResizeStart = (e) => {
    // ... (previous resize logic remains the same)
  };

  const handleNextVideo = () => {
    if (playListData && playListData.videoOrder) {
      const currentIndex = playListData.videoOrder.indexOf(selectedVideoId);
      if (currentIndex < playListData.videoOrder.length - 1) {
        setSelectedVideoId(playListData.videoOrder[currentIndex + 1]);
      }
    }
  };

  const handlePrevVideo = () => {
    if (playListData && playListData.videoOrder) {
      const currentIndex = playListData.videoOrder.indexOf(selectedVideoId);
      if (currentIndex > 0) {
        setSelectedVideoId(playListData.videoOrder[currentIndex - 1]);
      }
    }
  };

  if (!playListData) {
    return <p className="text-gray-800 dark:text-white text-lg">Playlist not found.</p>;
  }

  return (
    <div className="flex flex-col w-full h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      {/* SideNav */}
      <SideNav
        playListData={playListData}
        selectedVideoId={selectedVideoId}
        setSelectedVideoId={setSelectedVideoId}
        setVideoStatus={setVideoStatus}
      />

      {/* Main content area with resizable panels */}
      <div
        ref={containerRef}
        className={`flex ${isMobile ? 'flex-col' : 'flex-row'} h-full w-full overflow-hidden`}
      >
        {/* Video Panel */}
        <div
          className={`bg-gray-50 dark:bg-gray-950 overflow-y-auto p-4 flex flex-col relative`}
          style={{
            width: isMobile ? '100%' : `${videoPanelWidth}%`,
            height: isMobile ? '50%' : '100%',
            minHeight: isMobile ? '200px' : 'auto'
          }}
        >
          {selectedVideo ? (
            <div className="relative w-full flex-grow">
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
          ) : (
            <p className="text-gray-800 dark:text-white text-lg">Select a video to play</p>
          )}

          {/* Resize handle */}
          <div
            ref={resizeRef}
            className={`absolute ${isMobile ? 'bottom-0 left-0 right-0 h-2 cursor-ns-resize' : 'right-0 top-0 bottom-0 w-2 cursor-ew-resize'} 
              bg-transparent hover:bg-blue-500 z-10 opacity-50 hover:opacity-100 transition-colors`}
            onMouseDown={handleResizeStart}
            onTouchStart={handleResizeStart}
          />
        </div>

        {/* Notes Panel */}
        <div
          className={`bg-white dark:bg-gray-900 border-l dark:border-gray-800 flex flex-col`}
          style={{
            width: isMobile ? '100%' : `${100 - videoPanelWidth}%`,
            height: isMobile ? '60%' : '100%'
          }}
        >
          {/* Tab Navigation with Previous and Next buttons */}
          <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-3">
            <IconButton
              className={`bg-blue-500 hover:bg-blue-600 w-20 lg:w-28 ${playListData.videoOrder.indexOf(selectedVideoId) === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
              icon={ArrowBigLeftDash}
              iconPosition="left"
              onClick={handlePrevVideo}
              disabled={playListData.videoOrder.indexOf(selectedVideoId) === 0}
            >
              Prev
            </IconButton>
            
            <div className="flex gap-1 items-center">
              {["Notes", "Transcript","Summary"].map((title, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTab(index)}
                  className={`
                    px-3 py-1.5 rounded-lg text-sm font-medium
                    transition-all duration-200
                    ${activeTab === index
                      ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}
                  `}
                >
                  {title}
                </button>
              ))}
            </div>
            
            <IconButton
              className={`bg-blue-500 hover:bg-blue-600 w-20 lg:w-28 ${playListData.videoOrder.indexOf(selectedVideoId) === playListData.videoOrder.length - 1 ? "opacity-50 cursor-not-allowed" : ""}`}
              icon={ArrowBigRightDash}
              iconPosition="right"
              onClick={handleNextVideo}
              disabled={playListData.videoOrder.indexOf(selectedVideoId) === playListData.videoOrder.length - 1}
            >
              Next
            </IconButton>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-hidden h-full">
            {activeTab === 0 ? (
              <Editor videoId={selectedVideo?.videoId} playlistId={playListData.playlistId} />
            ) : activeTab === 1 ? (
              <TranscriptList videoId={selectedVideo?.videoId} />
            ) : (
              <SummaryList videoId={selectedVideo?.videoId} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseScreen;