

https://github.com/user-attachments/assets/4609db55-2cb3-43b6-a201-9d9fb4a07ec4

Here's a detailed GitHub README file for your project:  

---

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
| Playlist Dashboard  | Video Player with Notes & Summary |
|---------------------|--------------------------------|
|  ![image](https://github.com/user-attachments/assets/287455df-b8ce-426b-911b-4494157efb13) |![image](https://github.com/user-attachments/assets/c51cfbc4-b368-44d7-ba5b-7189d25a01ac) |


---

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

Here's the updated **API Endpoints** table without the **Protected** column:  

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
