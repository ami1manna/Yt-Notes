// server.js
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const playlistRoutes = require('./routes/playlistRoutes');
const notesRoutes = require('./routes/notesRoutes');
const videoRoutes = require('./routes/videoRouters')
const cookieParser = require('cookie-parser');


const cors = require('cors');

require('dotenv').config();

const app = express();
app.use(cookieParser()); // Add this after express.json()
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173", // Allow frontend origin
  credentials: true, // Allow cookies and authentication headers
}));

    
mongoose.connect(process.env.MONGO_URI).then(() => console.log('MongoDB connected')).catch(err => console.log(err));

app.use('/auth', authRoutes);
app.use('/playlists', playlistRoutes);
app.use('/video', notesRoutes);
app.use('/video',videoRoutes);
 


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
