import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { PlaylistProvider } from './context/PlaylistsContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <ThemeProvider>
    <PlaylistProvider>
    <App />
    </PlaylistProvider>
  </ThemeProvider>
  </StrictMode>,
)
