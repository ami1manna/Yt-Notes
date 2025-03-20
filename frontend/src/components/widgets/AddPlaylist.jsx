import React, { useContext, useState, useRef } from 'react';
import { motion, AnimatePresence, useAnimationControls } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import { extractPlaylistId, validatePlaylistUrl } from '../../utils/PlaylistUtils';
import CustomInput from '../ui/CustomInput';
import { PlaylistContext } from '../../context/PlaylistsContext';
import { AuthContext } from '../../context/AuthContext';
import CourseList from './CourseList';
import { PlusCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AddPlaylist = () => {
  const { setPlaylistData } = useContext(PlaylistContext);
  const { user } = useContext(AuthContext);
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
 const navigate = useNavigate();
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const handleAddPlaylist = async () => {
    try {
      // redirect to login page if user is not defined
      if(!user){
        navigate("/login");
        return ;
      }
      
      const trimmedUrl = playlistUrl.trim();

      if (!trimmedUrl) {
        toast.error('Please enter a playlist URL', {
          position: 'top-right',
          icon: '🎵'
        });
        inputRef.current?.focus();
        return;
      }

      if (!validatePlaylistUrl(trimmedUrl)) {
        toast.error('Invalid YouTube playlist URL', {
          position: 'top-right',
          icon: '⚠️'
        });
        inputRef.current?.focus();
        return;
      }

      setLoading(true);

      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BASE_URL}/playlists/add`,
        {
          userEmail: user.email,
          playlistId: extractPlaylistId(trimmedUrl),
          playlistUrl: trimmedUrl
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

     
      if (response.data.playlists) {
        setPlaylistData(response.data.playlists);
        toast.success('Playlist added successfully! 🎉', {
          position: 'top-right'
        });
      }

      setPlaylistUrl('');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to add playlist';
      console.error('Playlist Add Error:', error);
      toast.error(errorMessage, {
        position: 'top-right',
        icon: '❌'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleAddPlaylist();
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mt-28 w-full h-full flex flex-col  "
    >
      <div className=" lg:p-7 lg:bg-white lg:dark:bg-gray-800 lg:shadow-2xl lg:rounded-xl mb-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-4 text-left"
        >
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Add New Playlist
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Enter a YouTube playlist URL to add it to your collection
          </p>
        </motion.div>

        <div>
          <CustomInput
            inputType="url"
            iconComponent={
              loading ? (
                <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
              ) : (
                <PlusCircle className="w-5 h-5 text-gray-500" />
              )
            }
            placeholder="https://youtube.com/playlist?list=..."
            textButton={loading ? "Adding..." : "Add Playlist"}
            value={playlistUrl}
            onChange={(e) => setPlaylistUrl(e.target.value)}
            onKeyPress={handleKeyPress}
            onClick={handleAddPlaylist}
            ref={inputRef}
            disabled={loading}
            loading={loading}
            className="transition-all duration-300 focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex-1 overflow-hidden"
        >
          <CourseList />
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default AddPlaylist;