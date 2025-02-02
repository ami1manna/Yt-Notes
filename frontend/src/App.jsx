
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
 
import RootLayout from './pages/RootLayout';
import Signup from './pages/Signup';
import Home from './pages/Home';
import AddPlaylist from './components/widgets/AddPlaylist';
import Login from './pages/Login';

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <RootLayout />,
      children: [
        {
          path: "/",
          element: <Home />
        },
        {
          path: "/addPlaylist",
          element: <AddPlaylist />
        },
        
        {
          path: "/signup",
          element: <Signup />
        },
        {
          path: "/login",
          element: <Login />
        }

      ]
    }
  ]);
  return (
    
      <RouterProvider router={router}></RouterProvider>
     
  )
}

export default App
