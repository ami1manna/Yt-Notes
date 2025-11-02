# 🎥 YT-Notes

<div align="center">
   
  <h1>Enhance Your YouTube Learning Experience</h1>
  <p>Take timestamped notes, collaborate with others, and get AI-powered insights from YouTube videos.</p>
  
  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
  [![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?style=for-the-badge&logo=socket.io&logoColor=white)](https://socket.io/)

  🌐 **Live Demo:** [YT Notes Manager](https://yt-notes-frontend.netlify.app/)

  🎥 **Video Demo:** [Watch on YouTube](https://www.youtube.com/watch?v=uH7wczpbs90)
</div>

## 🖼️ Database
<img width="4290" height="2307" alt="Mermaid Chart - Create complex, visual diagrams with text -2025-11-02-113023" src="https://github.com/user-attachments/assets/b10f9764-695e-4420-814d-6e128f706ed2" />


## 🖼️ Project Screenshots

| Playlist Dashboard | Video Player with Notes & Summary |
|--------------------|-----------------------------------|
|  ![Video Player with Notes & Summary](https://github.com/user-attachments/assets/34dea50e-bc75-41ac-b23b-1c09edc65fb4) | ![Playlist Dashboard](https://github.com/user-attachments/assets/2bec436d-cafa-468d-a186-3245c7cb8ba7) |

## 🌟 Features

### 📝 Note-Taking
- 📌 **Add YouTube Playlists**: Enter a YouTube playlist URL to save it for structured learning
- 🎥 **Track Video Progress**: Mark videos as completed and visualize progress for effective learning
- 📝 **Take & Store Notes**: Write, edit, and save notes for each video while watching
- 📜 **Full Video Transcripts**: Fetch entire YouTube video transcripts for in-depth study
- Timestamped notes synced with YouTube videos
- Rich text editing with Markdown and LaTeX support

### 🤖 AI-Powered Features
- **AI-Powered Summarization**: Generate concise and structured summaries from transcripts
- AI-powered summaries and educational insights
- Get AI-generated educational notes

### 👥 Collaboration
- Real-time collaborative note-taking
- Shared workspaces and group projects
- Activity tracking and version history

### 🎯 Learning Management
- Create and organize video playlists
- **Structured Course Organization**: Playlists are grouped into well-defined sections, enhancing the learning experience
- Categorize content with custom tags
- Track learning progress

### 🎨 Modern UI/UX
- Clean, responsive design
- **Dark Mode Support**: Enjoy a visually comfortable UI with dark/light theme toggling
- Keyboard shortcuts for power users

## 🛠️ Tech Stack

### Frontend 🌐
- **React.js** – Component-based UI with hooks and context API / React 18
- **State Management**: Redux Toolkit
- **Tailwind CSS** – Fast and responsive styling
- **Build Tool**: Vite
- **Real-time**: Socket.IO Client

### Backend ⚙️
- **Runtime**: Node.js
- **Node.js & Express.js** – Handles API calls and data processing / Express.js
- **Database**: MongoDB with Mongoose – Stores user playlists, notes, and progress
- **Authentication**: JWT
- **Caching**: Redis

### AI & APIs 🤖
- **Google Gemini AI** – Used for YouTube transcript summarization / Google Generative AI
- **YouTube API** – Fetches playlist details and transcripts / YouTube Data API
- Real-time collaboration engine

### Hosting & Deployment 🚀
- **Frontend** – Deployed on **Netlify**
- **Backend** – Hosted on **Vercel**
- **MongoDB** – Managed via **MongoDB Atlas**

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or later
- MongoDB Atlas or local MongoDB instance
- Redis server (for caching)
- Google Cloud account (for AI features)

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/yt-notes-manager.git
   cd yt-notes-manager
   ```

2. **Set up the backend**
   ```bash
   cd backend  # or cd server
   cp .env.example .env  # Update with your credentials
   npm install
   npm start  # or node index.js
   ```

3. **Set up the frontend**
   ```bash
   cd ../frontend  # or cd client
   cp .env.example .env  # Update with your backend URL
   npm install
   npm run dev  # or npm start
   ```

4. **Set Up Environment Variables**
   Create a `.env` file in the `server` directory with:
   ```env
   MONGO_URI=your_mongodb_uri
   YOUTUBE_API_KEY=your_youtube_api_key
   GEMINI_AI_KEY=your_gemini_api_key
   ```

5. **Open your browser**
   Visit `http://localhost:5173` to access the application

## 📂 Project Structure

```
yt-notes/
├── backend/         # Backend server (Node.js + Express)
│   ├── config/      # Configuration files
│   ├── controllers/ # Request handlers
│   ├── models/      # Database models
│   ├── routes/      # API routes
│   └── services/    # Business logic
│
├── frontend/        # Frontend application (React)
│   ├── public/      # Static assets
│   ├── src/         # Source code
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   └── store/       # Redux store
│   └── ...
│
└── socket-backend/  # Real-time collaboration server
```

## 📌 API Endpoints

| **Method** | **Endpoint**                | **Description**                                 |
|-----------|-----------------------------|-----------------------------------------------|
| **🔐 Auth Routes** |
| `POST`    | `/api/auth/signup`          | User registration                            |
| `POST`    | `/api/auth/login`           | User login                                   |
| `POST`    | `/api/auth/logout`          | User logout                                  |
| `GET`     | `/api/auth/me`              | Get logged-in user details                   |
| **📺 Video Routes** |
| `PUT`     | `/api/video/toggle`         | Toggle video state                           |
| **📜 Transcript Routes** |
| `POST`    | `/api/transcript/addTranscript`  | Add a transcript for a video                 |
| `GET`     | `/api/transcript/getTranscript`  | Get transcript for a video                   |
| `GET`     | `/api/transcript/summarize`      | Get AI-generated summary                     |
| `GET`     | `/api/transcript/educational-notes` | Get AI-generated educational notes           |
| `GET`     | `/api/transcript/regenerate-summary` | Regenerate AI summary                        |
| `GET`     | `/api/transcript/regenerate-notes` | Regenerate educational notes                 |
| **📌 Section Management** |
| `POST`    | `/api/section/arrange`      | Arrange videos in a section                  |
| `DELETE`  | `/api/section/deleteSectionVideo` | Delete a video from a section                |
| `PATCH`   | `/api/section/addSectionVideo`  | Add a video to a section                     |

For detailed API documentation, please refer to the [Backend README](backend/README.md).

## 🛠 Development

### Running in Development Mode
```bash
# Start backend server
cd backend
npm run dev

# In a new terminal, start frontend
cd ../frontend
npm run dev
```

### Building for Production
```bash
# Build frontend
cd frontend
npm run build

# Start production server (backend)
cd ../backend
npm start
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature` or `feature/new-feature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'` or `"Added new feature"`)
4. Push to the branch (`git push origin feature/AmazingFeature` or `feature/new-feature`)
5. Create a Pull Request

## 🎯 Future Enhancements
- **AI-powered Note Suggestions** – Auto-generate key points from video transcripts
- **Collaborative Playlists** – Share and discuss notes with friends
- **Mobile App Support** – Extend functionality to mobile devices

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - A JavaScript library for building user interfaces
- [Express](https://expressjs.com/) - Fast, unopinionated web framework for Node.js
- [MongoDB](https://www.mongodb.com/) - The database for modern applications
- [Socket.IO](https://socket.io/) - Enables real-time, bidirectional and event-based communication
- And all the amazing open-source projects that made this possible!

## 💬 Feedback & Support
Got questions or suggestions? Feel free to open an issue or contribute to the project! 😊
