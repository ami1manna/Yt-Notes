import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { PlaylistSummariesContext } from "../PlaylistSummariesContext";
import { toast } from "react-toastify";
import { fetchUserPlaylists } from "../../utils/PlaylistUtils";
import PropTypes from 'prop-types';
import { AuthContext, useAuth } from "./AuthContextBase";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Use the PlaylistSummariesContext
  const { setPlaylistSummaries, resetPlaylistSummaries } = useContext(PlaylistSummariesContext);

  // We do NOT use localStorage for user info, since session is restored via /auth/me and JWT cookies
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_REACT_APP_BASE_URL}/auth/me`, { 
        withCredentials: true 
      });
      // Store userId as user.userId
      const userObj = {
        userId: res.data.user.id,
        username: res.data.user.username,
        email: res.data.user.email
      };

      console.log(userObj.username);
      setUser(userObj);
      // Fetch playlist summaries using userId
      await fetchUserPlaylists(userObj.userId, setPlaylistSummaries);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BASE_URL}/auth/login`, 
        { email, password }, 
        { withCredentials: true }
      );
      // Store userId as user.userId
      const userObj = {
        userId: res.data.user.id,
        username: res.data.user.username,
        email: res.data.user.email
      };
      setUser(userObj);
      // Fetch playlist summaries using userId
      await fetchUserPlaylists(userObj.userId, setPlaylistSummaries);
      return res.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed";
      toast.error(errorMessage, { position: "top-right", icon: "⚠️" });
      throw error;
    }
  };

  const signup = async (username, email, password) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BASE_URL}/auth/signup`, 
        { username, email, password }, 
        { withCredentials: true }
      );
      await login(email, password);
      return res.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Signup failed";
      toast.error(errorMessage, { position: "top-right", icon: "⚠️" });
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Reset playlist summaries
      resetPlaylistSummaries();
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
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};