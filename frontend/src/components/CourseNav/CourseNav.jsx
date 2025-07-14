import React, { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../../context/auth/AuthContextBase";
import { Menu, X, Bookmark, ArrowLeft } from 'lucide-react';
import CourseNavTitle from "./CourseNavTitle";
import DisplayVideo from "./DisplayVideo";
import DisplaySection from "./DisplaySection";

const CourseNav = ({ playListData, setVideoStatus, isSectioned, videoData, sectionData }) => {
    const { user } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);
    const navRef = useRef(null);

    // Handle hover interactions
    const handleMouseEnter = () => {
        if (window.innerWidth > 768) { // Changed from 640 to 768 for better tablet support
            setIsOpen(true);
        }
    };

    const handleMouseLeave = () => {
        if (window.innerWidth > 768) {
            setIsOpen(false);
        }
    };

    // Toggle sidebar for mobile
    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    // Handle clicks outside the nav to close it on mobile
    useEffect(() => {
        function handleClickOutside(event) {
            if (navRef.current && !navRef.current.contains(event.target) && isOpen && window.innerWidth <= 768) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    // Handle escape key to close sidebar
    useEffect(() => {
        function handleEscKey(event) {
            if (event.key === 'Escape' && isOpen) {
                setIsOpen(false);
            }
        }

        document.addEventListener('keydown', handleEscKey);
        return () => {
            document.removeEventListener('keydown', handleEscKey);
        };
    }, [isOpen]);

    // Calculate progress and total
    const progress = isSectioned
        ? Object.values(sectionData).reduce((acc, section) => {
            // Use completedLength if present, else count done videos
            if (typeof section.completedLength === 'number') {
                return acc + section.completedLength;
            } else if (Array.isArray(section.videos)) {
                return acc + section.videos.filter(v => v.done).length;
            } else {
                return acc;
            }
        }, 0)
        : videoData.filter(video => video && typeof video.done !== 'undefined' && video.done).length;
    const total = isSectioned
        ? Object.values(sectionData).reduce((acc, section) => {
            // Use sectionLength if present, else videos.length
            if (typeof section.sectionLength === 'number') {
                return acc + section.sectionLength;
            } else if (Array.isArray(section.videos)) {
                return acc + section.videos.length;
            } else {
                return acc;
            }
        }, 0)
        : videoData.length;
    const percentComplete = total > 0 ? Math.round((progress / total) * 100) : 0;

    return (
        <>
            {/* Fixed toggle button that's always visible */}
            <button
                className={`fixed left-4 top-4 p-3 rounded-full bg-white dark:bg-gray-800 
                  shadow-lg hover:shadow-xl flex items-center justify-center z-50
                  transition-all duration-300 ease-in-out
                  ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}
                  hover:bg-gray-100 dark:hover:bg-gray-700`}
                onClick={toggleSidebar}
                aria-label="Open course navigation"
            >
                <Menu className="w-5 h-5 text-black dark:text-white" />
            </button>

            {/* Mobile overlay */}
            <div 
                className={`fixed inset-0 bg-black transition-opacity duration-300 z-30 md:hidden
                    ${isOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsOpen(false)}
            ></div>

            {/* Main navigation */}
            <div
                ref={navRef}
                className={`fixed left-0 top-0 h-full z-40 transition-all duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                    w-full sm:w-80 md:w-72 lg:w-[30%]`}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <div className="h-full flex flex-col bg-white dark:bg-gray-900 
                      shadow-2xl overflow-hidden rounded-r-2xl">

                    {/* Fixed header with controls */}
                    <div className="sticky top-0 z-20 px-4 py-2 backdrop-blur-lg bg-white/90 dark:bg-gray-900/90 
                        border-b border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center py-2">
                            <button
                                onClick={toggleSidebar}
                                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors duration-200"
                                aria-label="Close navigation"
                            >
                                <ArrowLeft className="w-5 h-5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" />
                            </button>

                            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                {progress} of {total} completed
                            </div>
                            
                            <button 
                                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors duration-200"
                                aria-label="Bookmark course"
                            >
                                <Bookmark className="w-5 h-5 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400" />
                            </button>
                        </div>
                        
                        {/* CourseNavTitle component with progress */}
                        <CourseNavTitle 
                            playListData={playListData} 
                            isOpen={isOpen} 
                            progress={progress}
                            total={total}
                            percentComplete={percentComplete}
                        />
                    </div>

                    {/* Scrollable container for content */}
                    <div className="flex-1 overflow-y-auto">
                        {!isSectioned ? (
                            <DisplayVideo 
                                videoData={videoData}
                                setVideoStatus={setVideoStatus}
                                playlistId={playListData.playlistId}
                              
                                setIsOpen={setIsOpen}
                            />
                        ) : (
                            <DisplaySection
                                sectionData={sectionData}
                                setVideoStatus={setVideoStatus}
                                playlistId={playListData.playlistId}
                                setIsOpen={setIsOpen}
                            />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default CourseNav;