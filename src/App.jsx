
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css'
import YouTubePlaylistFetcher from './components/YouTubePlaylistFetcher'
import Profile from './pages/Profile';
import RootLayout from './pages/RootLayout';

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <RootLayout />,
      children: [
        {
          path: "/",
          element: <YouTubePlaylistFetcher />
        },
        { path: "/profile", 
        element: <Profile /> },
  
        
      ]
    }
  ]);
  return (
    < >
     <RouterProvider router={router}></RouterProvider>
    </>
  )
}

export default App
