import React, { useContext, useState } from "react";
import { PlaylistContext } from "../context/PlaylistsContext";
import { useParams } from "react-router-dom";

// components
import SideNav from "../components/ui/SideNav";
import IconButton from "../components/ui/IconButton";
 
// Importing assets
import Next from "../assets/svg/next.svg";
import Prev from "../assets/svg/prev.svg";
// import WindowTab from "../components/ui/WindowTab";
import { ArrowBigLeftDash, ArrowBigRightDash } from "lucide-react";

const CourseScreen = () => {
  const { userPlaylists, setVideoStatus } = useContext(PlaylistContext);
  const { playlistIndex } = useParams();
  const playListData = userPlaylists[playlistIndex];

  // Get the initial selected video
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);
  const selectedVideo = playListData?.videos[selectedVideoIndex] || null;

  // Function to go to the next video
  const handleNextVideo = () => {
    if (selectedVideoIndex < playListData.videos.length - 1) {
      setSelectedVideoIndex((prevIndex) => prevIndex + 1);
    }
  };

  // Function to go to the previous video
  const handlePrevVideo = () => {
    if (selectedVideoIndex > 0) {
      setSelectedVideoIndex((prevIndex) => prevIndex - 1);
    }
  };

  return (
    <div className="flex w-screen h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      {/* Using SideNav Component */}
      <SideNav
        playListData={playListData}
        selectedVideoIndex={selectedVideoIndex}
        setSelectedVideoIndex={setSelectedVideoIndex}
        setVideoStatus={setVideoStatus}
      />

      {/* Video Player */}
      <div className="h-screen flex-1 bg-gray-50 dark:bg-gray-950 overflow-y-auto p-4">
        {selectedVideo ? (
          <>
            <div className="flex justify-between items-center mb-4">
              <IconButton
                className={`bg-blue-500 hover:bg-blue-600 w-28 ${
                  selectedVideoIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                icon={ArrowBigLeftDash}
                iconPosition="left"
                onClick={handlePrevVideo}
                disabled={selectedVideoIndex === 0}
              >
                Prev
              </IconButton>

              <span className="text-lg font-semibold">{selectedVideo.title}</span>

              <IconButton
                className={`bg-blue-500 hover:bg-blue-600 w-28 ${
                  selectedVideoIndex === playListData.videos.length - 1 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                icon={ArrowBigRightDash}
                iconPosition="right"
                onClick={handleNextVideo}
                disabled={selectedVideoIndex === playListData.videos.length - 1}
              >
                Next
              </IconButton>
            </div>

            <iframe
              key={selectedVideo.videoId}
              className="w-[100%] h-[80%] rounded-xl shadow-xl mb-4"
              src={`https://www.youtube.com/embed/${selectedVideo.videoId}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </>
        ) : (
          <p className="text-gray-800 dark:text-white text-lg">Select a video to play</p>
        )}
      </div>

        {/* <WindowTab>
          <p className="text-gray-700 dark:text-gray-300">This is a floating panel with options.</p>
          <p>You can add any content here.</p>
        </WindowTab> */}

    </div>
  );
};

export default CourseScreen;
