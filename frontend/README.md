# YT-Notes Frontend

<div align="center">
  <p align="center">
    <img src="public/logo.svg" alt="Logo" width="120" height="120">
  </p>
  <h1>YT-Notes</h1>
  <p>Enhance your YouTube learning experience with timestamped notes, collaborative features, and AI-powered insights.</p>
  
  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
  [![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Redux](https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white)](https://redux-toolkit.js.org/)
</div>

## Features

- **Interactive Note-Taking**: Take timestamped notes while watching YouTube videos
- **Rich Text Editor**: Format your notes with Markdown and LaTeX support
- **Collaborative Workspaces**: Share and collaborate on notes with others in real-time
- **AI-Powered Insights**: Generate summaries and educational content from video transcripts
- **Playlist Management**: Organize your learning materials into custom playlists
- **Responsive Design**: Seamless experience across desktop and mobile devices
- **Dark/Light Mode**: Choose your preferred theme for comfortable viewing
- **Real-time Updates**: See changes from collaborators instantly

## Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom theming
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM
- **Real-time Communication**: Socket.IO
- **UI Components**: Custom components with Framer Motion animations
- **Rich Text Editing**: SunEditor with React
- **Math Typesetting**: KaTeX
- **Icons**: Lucide React
- **Notifications**: React Toastify

## Prerequisites

- Node.js 18.x or later
- npm or yarn package manager
- Backend server (see [backend README](../backend/README.md) for setup)

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/yt-notes.git
   cd yt-notes/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn
   ```

3. **Set up environment variables**
   Create a `.env` file in the frontend directory with the following variables:
   ```env
   VITE_API_BASE_URL=http://localhost:3000
   VITE_SOCKET_URL=http://localhost:3000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   The application will be available at `http://localhost:5173`

5. **Build for production**
   ```bash
   npm run build
   # or
   yarn build
   ```

## Project Structure

```
src/
├── assets/          # Static assets (images, fonts, etc.)
├── components/      # Reusable UI components
├── context/         # React context providers
├── pages/           # Page components
├── store/           # Redux store configuration and slices
├── utils/           # Utility functions and helpers
├── App.jsx          # Main application component
└── main.jsx         # Application entry point
```

## Deployment

The frontend is configured for deployment on Vercel. To deploy:

1. Push your code to a GitHub repository
2. Connect the repository to Vercel
3. Set up the environment variables in the Vercel dashboard
4. Deploy!

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [React](https://reactjs.org/) - A JavaScript library for building user interfaces
- [Vite](https://vitejs.dev/) - Next Generation Frontend Tooling
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [Redux Toolkit](https://redux-toolkit.js.org/) - The official, opinionated, batteries-included toolset for efficient Redux development
- [Socket.IO](https://socket.io/) - Enables real-time, bidirectional and event-based communication
- And all the other amazing open-source projects that made this possible!
