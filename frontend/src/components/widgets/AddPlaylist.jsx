import React, { useContext, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import { extractPlaylistId, validatePlaylistUrl } from '../../utils/playlistUtils'
import CustomInput from '../ui/CustomInput'
import AddIcon from '../../assets/png/plus.png'
import { PlaylistContext } from '../../context/PlaylistsContext'

const AddPlaylist = () => {
    const { userPlaylists, setUserPlaylists } = useContext(PlaylistContext);
    const [playlistUrl, setPlaylistUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const inputRef = useRef(null);

    const handleAddPlaylist = async () => {
        try {
            // Trim and validate URL 
            const trimmedUrl = playlistUrl.trim();
            
            if (!trimmedUrl) {
                toast.error('Please enter a playlist URL');
                inputRef.current?.focus();
                return;
            }

            // Validate YouTube playlist URL
            if (!validatePlaylistUrl(trimmedUrl)) {
                toast.error('Invalid YouTube playlist URL');
                inputRef.current?.focus();
                return;
            }

            setLoading(true);

            const response = await axios.post('http://localhost:5000/playlist/add', {
                userEmail: "test@gmail.com", // TODO: Replace with actual user email
                playlistId: extractPlaylistId(trimmedUrl),
                playlistUrl: trimmedUrl
            });

            // Update context with new playlist if available
            if (response.data.playlist) {
                setUserPlaylists(prevPlaylists => [...prevPlaylists, response.data.playlist]);
            }

            // Success handling
            toast.success(response.data.message || 'Playlist added successfully');
            setPlaylistUrl(''); // Clear input
        } catch (error) {
            // Error handling
            const errorMessage = error.response?.data?.message || 'Failed to add playlist';
            console.error('Playlist Add Error:', error);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center lg:p-8 lg:bg-white lg:dark:bg-gray-800 lg:shadow-2xl lg:rounded-xl w-full"
        >
            <CustomInput
                inputType="search"
                iconPath={AddIcon}
                placeholder="Enter Playlist URL"
                textButton={loading ? "Adding..." : "Add"}
                value={playlistUrl}
                onChange={(e) => setPlaylistUrl(e.target.value)}
                onClick={handleAddPlaylist}
                ref={inputRef}
                disabled={loading}
            />

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-3">
                {/* Future playlist display */}
            </div>
            
            <ToastContainer />
        </motion.div>
    )
}

export default AddPlaylist