import Tiles from "./Tiles";
import CheckBox from "./CheckBox";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
const SideNav = ({ playListData, selectedVideoIndex, setSelectedVideoIndex, setVideoStatus }) => {
  const {user} = useContext(AuthContext);
  return (
    <div className="h-full w-80 p-4 shadow-lg overflow-y-auto bg-white dark:bg-gray-800 dark:text-white rounded-lg">
      <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">Playlist</h2>

      {playListData.videos.map((video, index) => (
        <div
          key={video.videoId}
          className={`w-full p-2 mb-2 border rounded-xl shadow-md transition-all duration-300 cursor-pointer flex items-center
            ${selectedVideoIndex === index ? "bg-blue-500 dark:bg-blue-600 text-white" : "bg-white dark:bg-gray-800 text-gray-800 dark:text-white"}`}
          
        >
          {/* Checkbox with custom style */}
          <CheckBox
            onChange={() => setVideoStatus(video.videoId, playListData.playlistId, user.email)}
            checked={video.done}
          />

          {/* Tiles Component */}
          <Tiles onClick={() => setSelectedVideoIndex(index)}>{video.title}</Tiles>
          
        </div>
      ))}
    </div>
  );
};

export default SideNav;
