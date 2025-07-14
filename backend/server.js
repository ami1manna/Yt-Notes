// server.js
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const playlistRoutes = require('./routes/playlistRoutes');
const notesRoutes = require('./routes/notesRoutes');
const videoRoutes = require('./routes/videoRouters');
const customTranscriptRoutes = require('./routes/transcriptRoutes');
const sectionRoutes = require('./routes/sectionRoutes');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./config/database');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());

app.use(cookieParser());

app.use(cors({
  origin: ['https://yt-notes-frontend.netlify.app', 'http://localhost:5173'], // Allow both production and local frontend
  methods: 'GET,POST,PUT,DELETE',
  credentials: true 
}));


// Database connection
connectDB();

// Routes
app.use('/auth', authRoutes);
app.use('/playlists', playlistRoutes);
app.use('/video', notesRoutes);
app.use('/video', videoRoutes);
app.use('/transcript',customTranscriptRoutes);
app.use('/section',sectionRoutes)
// Health check route
app.get('/', (req, res) => {
  res.json({ status: 'healthy', message: "API is working on Vercel!" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// Default Route

// // Export for Vercel
module.exports = app;