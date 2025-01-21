
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css'
import YouTubePlaylistFetcher from './components/YouTubePlaylistFetcher'
import Profile from './pages/Profile';
import RootLayout from './pages/RootLayout';
import Signup from './pages/Signup';
import Home from './pages/Home';

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <RootLayout />,
      children: [
        {
          path: "/",
          element: <Home/>
        },
        { path: "/profile", 
        element: <Profile /> },
        { path: "/signup", 
        element: <Signup /> },
        
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
