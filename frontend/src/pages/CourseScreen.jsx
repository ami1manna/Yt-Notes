import React, { useContext, useState, useEffect, useRef , useMemo} from "react";
import { PlaylistContext } from "../context/PlaylistsContext";
import { useParams } from "react-router-dom";
import IconButton from "../components/ui/IconButton";
import { ArrowBigLeftDash, ArrowBigRightDash } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import TranscriptList from "../components/widgets/TranscriptList";
import Editor from "../components/Editor/Editor";
import SummaryList from "../components/widgets/SummaryList";
import CourseNav from "../components/CourseNav/CourseNav";
import { setPlaylistVideoId } from "../utils/VideoUtils";
import { use } from "react";

const CourseScreen = () => {
    const { userPlaylists, setVideoStatus } = useContext(PlaylistContext);
 
    const { playlistId } = useParams();
    const playListData = useMemo(() => userPlaylists?.[playlistId] || null, [userPlaylists, playlistId]);
   
    const [selectedVideo, setSelectedVideoData] = useState({});

    const [sectionData, setSectionData] = useState({});
    const [videoData, setVideoData] = useState([]);
    const [displaySection, setDisplaySection] = useState(false);
    // State for resizable panels
    const [isMobile, setIsMobile] = useState(false);
    const [videoPanelWidth, setVideoPanelWidth] = useState(50); // Percentage width for video panel
    const [isResizing, setIsResizing] = useState(false);
    const resizeRef = useRef(null);
    const containerRef = useRef(null);
    const [activeTab, setActiveTab] = useState(0);
    
     
    useEffect(() => {
        
        if(playListData){
           
            setSelectedVideoData(playListData.videos[playListData.selectedVideoId]);
            setDisplaySection(playListData.displaySection);
        }
    } , )

    useEffect(() => {
        if (!playListData || !playListData.videos) return;

        if (!displaySection) {
              
            const videoData = playListData.videoOrder.map(videoId => playListData.videos[videoId]);
            
            setVideoData(videoData);
        } else {
            const sec = playListData.sections;
            if (!sec) return;

            // Set section data efficiently
            const newSectionData = Object.entries(sec).reduce((acc, [key, section]) => {
                acc[key] = {
                    ...section,
                    videos: section.videoIds?.map(videoId => playListData.videos?.[videoId]) || [],
                };
                return acc;
            }, {});

            setSectionData(newSectionData);
          
        }
    }, [displaySection, playListData]); // ✅ Runs only when necessary




    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobile(mobile);
            if (mobile) {
                setVideoPanelWidth(30); // Set to 30% on mobile as requested
            } else {
                setVideoPanelWidth(50); // Default to 50% on desktop
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Initial check
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    
    
    const handleResizeStart = (e) => {
        e.preventDefault();
        setIsResizing(true);

        const handleMouseMove = (moveEvent) => {
            if (!containerRef.current) return;

            if (isMobile) {
                // Vertical resizing for mobile
                const containerHeight = containerRef.current.clientHeight;
                const newHeight = (moveEvent.clientY / containerHeight) * 100;
                // Limit to between 20% and 40% on mobile
                setVideoPanelWidth(Math.min(Math.max(newHeight, 20), 40));
            } else {
                // Horizontal resizing for desktop
                const containerWidth = containerRef.current.clientWidth;
                const newWidth = (moveEvent.clientX / containerWidth) * 100;
                setVideoPanelWidth(Math.min(Math.max(newWidth, 20), 80)); // Keep between 20% and 80%
            }
        };

        const handleMouseUp = () => {
            setIsResizing(false);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('touchmove', handleMouseMove);
            document.removeEventListener('touchend', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('touchmove', handleMouseMove);
        document.addEventListener('touchend', handleMouseUp);
    };

    const handleNextVideo = () => {

    };

    const handlePrevVideo = () => {

    };

  

    const setVidStatus = async (videoId, playlistId, userEmail , sectionId = null) => {
        playListData.videos[videoId].status = !playListData.videos[videoId].status;
        setVideoStatus(videoId, playlistId, userEmail , sectionId);
    }
    if (!playListData) {
        return <p className="text-gray-800 dark:text-white text-lg">Playlist not found.</p>;
    }

    return (
        <div className="flex flex-col w-full h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
            {/* SideNav */}
            <CourseNav
                playListData={playListData}
                setVideoStatus={setVidStatus}
                isSectioned={playListData.displaySection}
                videoData={videoData}
                sectionData={sectionData}
            />
 
            {/* Main content area with resizable panels */}
            <div
                ref={containerRef}
                className={`flex ${isMobile ? 'flex-col' : 'flex-row'} h-full w-full overflow-hidden`}
            >
                {/* Video Panel - Fixed height on mobile */}
                <div
                    className={`bg-gray-50 dark:bg-gray-950 overflow-y-auto p-4 flex flex-col relative`}
                    style={{
                        width: isMobile ? '100%' : `${videoPanelWidth}%`,
                        height: isMobile ? '50%' : '100%', // Fixed 30% height on mobile
                        minHeight: isMobile ? '200px' : 'auto' // Ensure minimum height
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
                        height: isMobile ? '60%' : '100%' // Fixed 70% height on mobile
                    }}
                >
                    {/* Tab Navigation with Previous and Next buttons */}
                    <div className="flex items-center justify-around bg-gray-100 dark:bg-gray-800 p-3">
                        {/* <IconButton
                            className={`bg-blue-500 hover:bg-blue-600 w-20 lg:w-28  `}
                            icon={ArrowBigLeftDash}
                            iconPosition="left"
                            onClick={handlePrevVideo}

                        >
                            <span className="hidden sm:inline">Prev</span>
                        </IconButton> */}

                        <div className="flex gap-1 items-center">
                            {["Transcript", "Summary", "Notes"].map((title, index) => (
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

                        {/* <IconButton
                            className={`bg-blue-500 hover:bg-blue-600 w-20 lg:w-28  `}
                            icon={ArrowBigRightDash}
                            iconPosition="right"
                            onClick={handleNextVideo}

                        >
                            <span className="hidden sm:inline">Next</span>
                        </IconButton> */}
                    </div>

                    {/* Tab Content */}
                    <div className="flex-1 overflow-hidden h-full">
                        {activeTab === 0 ? (
                            <TranscriptList videoId={selectedVideo?.videoId} />
                        ) : activeTab === 1 ? (
                            <SummaryList videoId={selectedVideo?.videoId} />
                        ) : (
                            <Editor videoId={selectedVideo?.videoId} playlistId={playListData.playlistId} />
                        )}


                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseScreen;