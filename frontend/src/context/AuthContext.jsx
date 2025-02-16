
// AuthProvider.js
import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useContext } from "react";
import { PlaylistContext } from "./PlaylistsContext"; // Assuming PlaylistProvider is in the same folder

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const{ setPlaylistData , resetPlaylist} = useContext(PlaylistContext); // Access the PlaylistContext

  // Check if the user is logged in and fetch data
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/auth/me`, { 
        withCredentials: true 
      });
      setUser(res.data.user);
      fetchUserPlaylists(res.data.user.email); // Fetch playlists after auth
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  const fetchUserPlaylists = async (email) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/playlists/${email}`);
    
      // Access the playlists array from the response
      const playlists = response.data[0].playlists;
  
      if (!Array.isArray(playlists)) {
        console.warn("No playlists found or playlists is not an array:", playlists);
        return [];
      }
  
      // Update all playlists at once instead of one by one
      setPlaylistData(playlists);
  
      return playlists;
    } catch (error) {
      console.error("Error fetching playlists:", error);
      return [];
    }
  };

  const login = async (email, password) => {
   
    try {
      setError(null);
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/auth/login`, 
        { email, password }, 
        { withCredentials: true }
      );
      setUser(res.data.user);
      fetchUserPlaylists(res.data.user.email); // Fetch playlists after login
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
        `${process.env.REACT_APP_BASE_URL}/auth/signup`, 
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
      // clear localstorage
      localStorage.clear();
      // clear provider
      resetPlaylist();
      await axios.post(
        `${process.env.REACT_APP_BASE_URL}/auth/logout`, 
        {}, 
        { withCredentials: true }
      );
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
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
        isAuthenticated: !!user 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
