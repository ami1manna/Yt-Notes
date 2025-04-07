import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { PlaylistProvider } from './context/PlaylistsContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_REACT_APP_BASE_URL;
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PlaylistProvider>
      <AuthProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </AuthProvider>
    </PlaylistProvider>
  </StrictMode>,
)
