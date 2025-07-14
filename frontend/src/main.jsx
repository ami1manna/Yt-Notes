import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { PlaylistsProvider } from './context/PlaylistsContext.jsx'
import { AuthProvider } from './context/auth/AuthContext.jsx'
import axios from 'axios';
import { TranscriptProvider } from './context/TranscriptContext.jsx'
import { EducationalNotesProvider } from './context/EducationalNotesContext.jsx'
import { PlaylistSummariesProvider } from './context/PlaylistSummariesContext.jsx';

axios.defaults.baseURL = import.meta.env.VITE_REACT_APP_BASE_URL;
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';


createRoot(document.getElementById('root')).render(
  <StrictMode>

    <TranscriptProvider>
      <EducationalNotesProvider>
        <PlaylistSummariesProvider>
          <PlaylistsProvider>
            <AuthProvider>
              <ThemeProvider>
                <App />
              </ThemeProvider>
            </AuthProvider>
          </PlaylistsProvider>
        </PlaylistSummariesProvider>
      </EducationalNotesProvider>
    </TranscriptProvider>
  </StrictMode>,
)
