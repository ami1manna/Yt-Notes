import React, { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Menu, X } from 'lucide-react';
import CourseNavTitle from "./CourseNavTitle";
import DisplayVideo from "./DisplayVideo";
import DisplaySection from "./DisplaySection";

const CourseNav = ({ playListData, selectedVideoId, setSelectedVideoId, setVideoStatus, isSectioned, videoData, sectionData }) => {
    const { user } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);
    const navRef = useRef(null);

    // Handle hover interactions
    const handleMouseEnter = () => {
        if (window.innerWidth > 640) {
            setIsOpen(true);
        }
    };

    const handleMouseLeave = () => {
        if (window.innerWidth > 640) {
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
            if (navRef.current && !navRef.current.contains(event.target) && isOpen) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div
            ref={navRef}
            className={`fixed left-0 top-0 h-full z-40 transition-all duration-300 ease-in-out
                ${isOpen ? 'w-full sm:w-80' : 'w-0'}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Toggle button outside of the main sidebar component */}
            <div
                className={`absolute left-4 top-4 p-2 rounded-full bg-white dark:bg-gray-800 
                   shadow-lg flex items-center justify-center
                   cursor-pointer transition-opacity duration-300 z-50
                   ${isOpen ? 'opacity-0' : 'opacity-100'}`}
                onClick={toggleSidebar}
            >
                <Menu className="w-5 h-5 text-black dark:text-white" />
            </div>

            <div className={`absolute inset-y-0 left-0 transition-all duration-300 ease-in-out
                ${isOpen ? 'w-full sm:w-80' : 'w-0'}`}>

                <div className="text-sm h-full flex flex-col bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 
                      shadow-xl overflow-hidden rounded-r-xl">

                    {/* Title Component with close button */}
                    <div className="sticky top-0 z-20 px-4 backdrop-blur-md bg-white/80 dark:bg-gray-800/80 
                       border-b border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center py-3">
                            {/* Close button for mobile */}
                            <button
                                onClick={toggleSidebar}
                                className="sm:hidden transition-opacity duration-300"
                            >
                                <X className="w-5 h-5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" />
                            </button>
                        </div>
                        
                        {/* CourseNavTitle component */}
                        <CourseNavTitle playListData={playListData} isOpen={isOpen} />
                    </div>

                    {/* Scrollable container for content */}
                    <div className={`flex-1 overflow-y-auto ${isOpen ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
                        {!isSectioned ? (
                            <DisplayVideo 
                                videoData={videoData}
                                selectedVideoId={selectedVideoId}
                                setSelectedVideoId={setSelectedVideoId}
                                setVideoStatus={setVideoStatus}
                                playlistId={playListData.playlistId}
                                userEmail={user.email}
                                setIsOpen={setIsOpen}
                            />
                        ) : (
                            <DisplaySection
                                sectionData={sectionData}
                                selectedVideoId={selectedVideoId}
                                setSelectedVideoId={setSelectedVideoId}
                                setVideoStatus={setVideoStatus}
                                playlistId={playListData.playlistId}
                                userEmail={user.email}
                                setIsOpen={setIsOpen}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseNav;