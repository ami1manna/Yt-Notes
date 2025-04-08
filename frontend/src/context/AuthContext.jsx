import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { PlaylistContext } from "./PlaylistsContext";
import { toast } from "react-toastify";
import { fetchUserPlaylists } from "../utils/PlaylistUtils";

export const AuthContext = createContext();
 // Custom hook for easy context access
 const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Use the PlaylistContext
  const { setPlaylistData, resetPlaylist , userPlaylists } = useContext(PlaylistContext);

  // Check if the user is logged in and fetch data
  useEffect(() => {
    
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_REACT_APP_BASE_URL}/auth/me`, { 
        withCredentials: true 
      });
      setUser(res.data.user);
   
      await fetchUserPlaylists(res.data.user.email, setPlaylistData);
     

    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  
   

  const login = async (email, password) => {
    try {
      setError(null);
      const res = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BASE_URL}/auth/login`, 
        { email, password }, 
        { withCredentials: true }
      );
      setUser(res.data.user);
      
       

      // ✅ Pass setPlaylistData here
      await fetchUserPlaylists(res.data.user.email, setPlaylistData);
      
      return res.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed";
      setError(errorMessage);
      throw error;
    }
  };
  

  const signup = async (username, email, password) => {
    try {
      setError(null);
      const res = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BASE_URL}/auth/signup`, 
        { username, email, password }, 
        { withCredentials: true }
      );
      await login(email, password);
      return res.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Signup failed";
      setError(errorMessage);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Clear localStorage
      localStorage.clear();
      // Reset playlist
      resetPlaylist();
      
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BASE_URL}/auth/logout`, 
        {}, 
        { withCredentials: true }
      );
      
      setUser(null);
      toast.success(response.data.message, { position: "top-right", icon: "👋" });
       
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Logout failed";
      toast.error(errorMessage, { position: "top-right", icon: "⚠️" });
      console.error(errorMessage);
      setUser(null);
    }
  };

 

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        login, 
        signup, 
        logout, 
        loading,
        error,
        isAuthenticated: !!user,
        useAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};