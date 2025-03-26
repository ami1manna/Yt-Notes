import React, { useContext, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { PlaylistContext } from "@/context/PlaylistsContext";
import { AuthContext } from "@/context/AuthContext";
import { PlusCircle, Loader2 } from "lucide-react";
import StaticModal from "@/components/Dialogs/StaticModal";
import CustomInput from "@/components/ui/CustomInput";
import CourseList from "./CourseList";
import { handleAddPlaylist, handlePlaylistSection } from "../../utils/PlaylistUtils";

const AddPlaylist = () => {
  const { setPlaylistData } = useContext(PlaylistContext);
  const { user } = useContext(AuthContext);
  const [playlistUrl, setPlaylistUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false); 
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) {
      addPlaylistHandler();
    }
  };

  const addPlaylistHandler = async () => {
    const success = await handleAddPlaylist(
      playlistUrl,
      user,
      setLoading,
      setPlaylistData,
      inputRef,
      navigate
    );

    if (success) {
      setIsOpen(true);  
    }else{
      setPlaylistUrl("");  
    }
  };

  const handleSection =  async (doesAgree) => {
    if (doesAgree) {
      await handlePlaylistSection(playlistUrl, user, setLoading, setPlaylistData);
      setPlaylistUrl(""); 
    }
    setIsOpen(false);  
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mt-28 w-full h-full flex flex-col"
    >
      <div className="lg:p-7 lg:bg-white lg:dark:bg-gray-800 lg:shadow-2xl lg:rounded-xl mb-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Add New Playlist</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Enter a YouTube playlist URL to add it to your collection</p>
        </motion.div>

        <CustomInput
          inputType="url"
          iconComponent={loading ? <Loader2 className="w-5 h-5 animate-spin text-gray-500" /> : <PlusCircle className="w-5 h-5 text-gray-500" />}
          placeholder="https://youtube.com/playlist?list=..."
          textButton={loading ? "Adding..." : "Add Playlist"}
          value={playlistUrl}
          onChange={(e) => setPlaylistUrl(e.target.value)}
          onKeyPress={handleKeyPress}
          onClick={addPlaylistHandler}
          ref={inputRef}
          disabled={loading}
          className="transition-all duration-300 focus:ring-2 focus:ring-teal-500"
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 overflow-hidden">
          {/* Show modal after adding playlist */}
          <StaticModal 
            isOpen={isOpen} 
            onAction={handleSection} 
            header="Organize Your Playlist" 
            subHeader="Would you like to automatically group your videos into sections for better navigation?" 
          />
          <CourseList />
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default AddPlaylist;

