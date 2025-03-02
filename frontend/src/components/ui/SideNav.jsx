import React, { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import Tiles from "./Tiles";
import CheckBox from "./CheckBox";
import CircularProgress from "./CircularProgress";
import { formatDuration, secondsToHHMM } from "../../utils/Coverter";
import { Clock, ListChecks, ChevronLeft, Menu, X } from 'lucide-react';

const SideNav = ({ playListData, selectedVideoIndex, setSelectedVideoIndex, setVideoStatus }) => {
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
      {/* Move the toggle button outside of the main sidebar component */}
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
            
            <div className={`flex items-center gap-3 bg-green-500/10 p-3 my-2 rounded-xl
                          transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
              <Clock className="w-5 h-5 text-green-500" />
              <div className="flex lg:flex-col justify-center items-center lg:items-start gap-4 lg:gap-0">
                <span className="text-lg text-gray-600 dark:text-gray-300">Total Duration</span>
                <span className="text-lg font-bold text-green-500">
                  {formatDuration(playListData.totalDuration)}
                </span>
              </div>
              <div className="lg:hidden flex-1 flex justify-end">
                <CircularProgress 
                  target={playListData.playlistLength} 
                  progress={playListData.playlistProgress}
                  radius={20}
                />
              </div>
            </div>
          </div>

          <div className={`flex-1 overflow-hidden overflow-y-auto p-4 space-y-3
                        transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
            {playListData.videos.map((video, index) => (
              <div
                key={video.videoId}
                className={`
                  relative group
                  rounded-xl border 
                  transition-all duration-300 ease-in-out
                  hover:scale-[1.02] active:scale-[0.98]
                  ${
                    selectedVideoIndex === index 
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 border-transparent shadow-lg shadow-blue-500/20" 
                    : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  }
                `}
              >
                <div className="absolute -top-1 -left-1 z-10
                              transform -rotate-12 transition-transform duration-300
                              group-hover:rotate-0 group-hover:-translate-y-1">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 
                                text-white text-xs font-bold px-3 py-1 
                                rounded-br-xl rounded-tl-lg shadow-md
                                transition-colors duration-300
                                group-hover:from-green-400 group-hover:to-emerald-500">
                    {secondsToHHMM(video.duration)}
                  </div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent 
                              translate-x-[-200%] group-hover:translate-x-[200%] 
                              transition-transform duration-1000 ease-in-out 
                              rounded-xl overflow-hidden" />

                <div className="relative flex items-center gap-3 p-1 lg:p-3 ">
                  <CheckBox
                    onChange={() => setVideoStatus(video.videoId, playListData.playlistId, user.email)}
                    checked={video.done}
                    className={selectedVideoIndex === index ? "text-white" : ""}
                  />
                  <div className="flex-1">
                    <Tiles onClick={() => {
                      setSelectedVideoIndex(index);
                      // Close sidebar on mobile after selection
                      if (window.innerWidth < 640) {
                        setIsOpen(false);
                      }
                    }} selected={selectedVideoIndex === index}>
                      {video.title}
                    </Tiles>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideNav;