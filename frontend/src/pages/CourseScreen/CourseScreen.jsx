import React, { useContext, useState, useEffect, useRef } from "react";
import { PlaylistsContext } from "../../context/PlaylistsContext";
import { useParams } from "react-router-dom";
import { ArrowBigLeftDash, ArrowBigRightDash } from "lucide-react";
import { useAuth } from "@/context/auth/AuthContextBase";
import TranscriptList from "../../components/notes/TranscriptList";
import Editor from "../../components/editor/Editor";
import SummaryList from "../../components/notes/SummaryList";
import CourseNav from "../../components/course/CourseNav";
import axios from "axios";
import { setVideoStatus as setVideoStatusUtil } from "../../utils/VideoUtils";

const CourseScreen = () => {
    const { playlistData, setFullPlaylistData } = useContext(PlaylistsContext);
    const { user } = useAuth();
    const { playlistId } = useParams();
    const [selectedVideo, setSelectedVideoData] = useState({});
    const [sectionData, setSectionData] = useState({});
    const [videoData, setVideoData] = useState([]);
    const [displaySection, setDisplaySection] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [videoPanelWidth, setVideoPanelWidth] = useState(50);
    const [isResizing, setIsResizing] = useState(false);
    const resizeRef = useRef(null);
    const containerRef = useRef(null);
    const [activeTab, setActiveTab] = useState(0);

    // Replace setVideoStatus with the utility function
    const setVideoStatus = async (videoId, playlistId, userId, sectionId, done) => {
        try {
            const updatedPlaylist = await setVideoStatusUtil(videoId, playlistId, userId, sectionId, done);
            setFullPlaylistData(updatedPlaylist);
        } catch (error) {
            console.error("Failed to update video status", error);
        }
    };

    // Fetch full playlist data on mount or when playlistId/user changes
    useEffect(() => {
        const fetchPlaylist = async () => {
            if (!user || !playlistId) return;
            try {
                const response = await axios.post("/playlists/fetchById", {
                    userId: user.userId,
                    playlistId
                });
                // Use the new well-structured playlist object
                setFullPlaylistData(response.data.playlist);
            } catch (error) {
                setFullPlaylistData(null);
            }
        };
        fetchPlaylist();
        // eslint-disable-next-line
    }, [user, playlistId]);

    useEffect(() => {
        console.log(playlistData);
        if (playlistData) {
            setSelectedVideoData(playlistData.videos?.find(v => v.videoId === playlistData.selectedVideoId));
            setDisplaySection(playlistData.displaySection);
        }
    }, [playlistData]);

    useEffect(() => {
        if (!playlistData || !playlistData.videos) return;
        if (!displaySection) {
            // Use the playlistData.videoOrder to order videos
            const videoData = playlistData.videoOrder.map(videoId => playlistData.videos.find(v => v.videoId === videoId)).filter(Boolean);
            setVideoData(videoData);
        } else {
            const sec = playlistData.sections;
            if (!sec) return;
            setSectionData(sec);
        }
    }, [displaySection, playlistData]);

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
        e.preventDefault();
        setIsResizing(true);
        const handleMouseMove = (moveEvent) => {
            if (!containerRef.current) return;
            if (isMobile) {
                const containerHeight = containerRef.current.clientHeight;
                const newHeight = (moveEvent.clientY / containerHeight) * 100;
                setVideoPanelWidth(Math.min(Math.max(newHeight, 20), 40));
            } else {
                const containerWidth = containerRef.current.clientWidth;
                const newWidth = (moveEvent.clientX / containerWidth) * 100;
                setVideoPanelWidth(Math.min(Math.max(newWidth, 20), 80));
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

    if (!playlistData) {
        return <p className="text-gray-800 dark:text-white text-lg">Playlist not found.</p>;
    }

    return (
        <div className="flex flex-col w-full h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
            <CourseNav
                playListData={playlistData}
                setVideoStatus={setVideoStatus}
                isSectioned={playlistData.displaySection}
                videoData={videoData}
                sectionData={sectionData}
            />
            <div
                ref={containerRef}
                className={`flex ${isMobile ? 'flex-col' : 'flex-row'} h-full w-full overflow-hidden`}
            >
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
                    <div
                        ref={resizeRef}
                        className={`absolute ${isMobile ? 'bottom-0 left-0 right-0 h-2 cursor-ns-resize' : 'right-0 top-0 bottom-0 w-2 cursor-ew-resize'} \
              bg-transparent hover:bg-blue-500 z-10 opacity-50 hover:opacity-100 transition-colors`}
                        onMouseDown={handleResizeStart}
                        onTouchStart={handleResizeStart}
                    />
                </div>
                <div
                    className={`bg-white dark:bg-gray-900 border-l dark:border-gray-800 flex flex-col`}
                    style={{
                        width: isMobile ? '100%' : `${100 - videoPanelWidth}%`,
                        height: isMobile ? '60%' : '100%'
                    }}
                >
                    <div className="flex items-center justify-around bg-gray-100 dark:bg-gray-800 p-3">
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
                    </div>
                    <div className="flex-1 overflow-hidden h-full">
                        {activeTab === 0 ? (
                            <TranscriptList videoId={selectedVideo?.videoId} />
                        ) : activeTab === 1 ? (
                            <SummaryList videoId={selectedVideo?.videoId} />
                        ) : (
                            <Editor videoId={selectedVideo?.videoId} playlistId={playlistData.playlistId} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseScreen;