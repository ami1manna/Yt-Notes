# 🎥 YT-Notes

<div align="center">
  <p align="center">
    <img src="frontend/public/logo.svg" alt="YT-Notes Logo" width="150" height="150">
  </p>
  <h1>Enhance Your YouTube Learning Experience</h1>
  <p>Take timestamped notes, collaborate with others, and get AI-powered insights from YouTube videos.</p>
  
  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
  [![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?style=for-for-the-badge&logo=socket.io&logoColor=white)](https://socket.io/)
</div>

## 🌟 Features

### 📝 Note-Taking
- Timestamped notes synced with YouTube videos
- Rich text editing with Markdown and LaTeX support
- AI-powered summaries and educational insights

### 👥 Collaboration
- Real-time collaborative note-taking
- Shared workspaces and group projects
- Activity tracking and version history

### 🎯 Learning Management
- Create and organize video playlists
- Categorize content with custom tags
- Track learning progress

### 🎨 Modern UI/UX
- Clean, responsive design
- Dark/Light mode
- Keyboard shortcuts for power users

## 🏗 Tech Stack

### Frontend
- **Framework**: React 18
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Real-time**: Socket.IO Client

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT
- **Caching**: Redis

### AI & Integrations
- Google Generative AI
- YouTube Data API
- Real-time collaboration engine

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or later
- MongoDB Atlas or local MongoDB instance
- Redis server (for caching)
- Google Cloud account (for AI features)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/yt-notes.git
   cd yt-notes
   ```

2. **Set up the backend**
   ```bash
   cd backend
   cp .env.example .env  # Update with your credentials
   npm install
   npm start
   ```

3. **Set up the frontend**
   ```bash
   cd ../frontend
   cp .env.example .env  # Update with your backend URL
   npm install
   npm run dev
   ```

4. **Open your browser**
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

## 🌐 API Documentation

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
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - A JavaScript library for building user interfaces
- [Express](https://expressjs.com/) - Fast, unopinionated web framework for Node.js
- [MongoDB](https://www.mongodb.com/) - The database for modern applications
- [Socket.IO](https://socket.io/) - Enables real-time, bidirectional and event-based communication
- And all the amazing open-source projects that made this possible!

### **YT Notes Manager** 🎥✍️  
A powerful web application that streamlines note-taking and progress tracking for YouTube playlists. Users can organize educational content, generate AI-powered summaries, and take notes—all in one place.

---

## 🚀 **Features**  

### 🎯 **Core Functionalities**
- 📌 **Add YouTube Playlists**: Enter a YouTube playlist URL to save it for structured learning.  
- 🎥 **Track Video Progress**: Mark videos as completed and visualize progress for effective learning.  
- 📝 **Take & Store Notes**: Write, edit, and save notes for each video while watching.  
- 📜 **Full Video Transcripts**: Fetch entire YouTube video transcripts for in-depth study.  
- 🤖 **AI-Powered Summarization**: Generate concise and structured summaries from transcripts.  
- 📚 **Structured Course Organization**: Playlists are grouped into well-defined sections, enhancing the learning experience.  
- 🌗 **Dark Mode Support**: Enjoy a visually comfortable UI with dark/light theme toggling.  

---

## 🖼️ **Project Screenshots**

| Playlist Dashboard | Video Player with Notes & Summary |
|--------------------|-----------------------------------|
|  ![Video Player with Notes & Summary](https://github.com/user-attachments/assets/34dea50e-bc75-41ac-b23b-1c09edc65fb4) | ![Playlist Dashboard](https://github.com/user-attachments/assets/2bec436d-cafa-468d-a186-3245c7cb8ba7) |


## 🛠️ **Tech Stack**  
### **Frontend** 🌐  
- **React.js** – Component-based UI with hooks and context API.  
- **Tailwind CSS** – Fast and responsive styling.  

### **Backend** ⚙️  
- **Node.js & Express.js** – Handles API calls and data processing.  
- **MongoDB** – Stores user playlists, notes, and progress.  

### **AI & APIs** 🤖  
- **Google Gemini AI** – Used for YouTube transcript summarization.  
- **YouTube API** – Fetches playlist details and transcripts.  

### **Hosting & Deployment** 🚀  
- **Frontend** – Deployed on **Netlify**.  
- **Backend** – Hosted on **Vercel**.  
- **MongoDB** – Managed via **MongoDB Atlas**.  

---

## 🛠️ **Installation & Setup**  

### **1️⃣ Clone the Repository**  
```sh
git clone https://github.com/your-username/yt-notes-manager.git
cd yt-notes-manager
```

### **2️⃣ Install Dependencies**  
#### **Frontend**  
```sh
cd client
npm install
npm start
```

#### **Backend**  
```sh
cd server
npm install
node index.js
```

### **3️⃣ Set Up Environment Variables**  
Create a `.env` file in the `server` directory with:  
```env
MONGO_URI=your_mongodb_uri
YOUTUBE_API_KEY=your_youtube_api_key
GEMINI_AI_KEY=your_gemini_api_key
```

---

## 📌 **API Endpoints**  

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

---

Let me know if you need any more edits! 🚀
## 🤝 **Contributing**  
1. **Fork the repository**  
2. **Create a new branch** (`feature/new-feature`)  
3. **Commit your changes** (`git commit -m "Added new feature"`)  
4. **Push to the branch** (`git push origin feature/new-feature`)  
5. **Create a Pull Request**  

---

## 🎯 **Future Enhancements**  
🔹 **AI-powered Note Suggestions** – Auto-generate key points from video transcripts.  
🔹 **Collaborative Playlists** – Share and discuss notes with friends.  
🔹 **Mobile App Support** – Extend functionality to mobile devices.  

---

## 📜 **License**  
This project is licensed under the **MIT License**.  

---

## 💬 **Feedback & Support**  
Got questions or suggestions? Feel free to open an issue or contribute to the project! 😊  

🌐 **Live Demo:** [YT Notes Manager](https://yt-notes-frontend.netlify.app/)  

---

Let me know if you need any modifications! 🚀
