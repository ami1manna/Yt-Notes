import { createBrowserRouter, RouterProvider, Route, createRoutesFromElements } from 'react-router-dom';
import RootLayout from './pages/RootLayout';
import Signup from './pages/Signup';
import Home from './pages/Home';
import AddPlaylist from './components/widgets/AddPlaylist';
import Login from './pages/Login';
import CourseScreen from './pages/CourseScreen';
import DashBoard from './pages/DashBoard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Routes inside RootLayout */}
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="addPlaylist" element={<AddPlaylist />} />
      </Route>

      {/* Separate Routes for Login and Signup (No RootLayout) */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/courseScreen/:playlistId" element={<CourseScreen />} />
      <Route path='/dashboard' element={<DashBoard />} />
    </>
  )
);


/**
 * The main App component. Returns a RouterProvider with the router.
 * The router contains all the routes for the application.
 * @returns {JSX.Element} The main App component.
 * @constructor
 */
function App() {
  return <>
  <RouterProvider router={router} />
  <ToastContainer position="top-right" autoClose={3000} />
  </>

}

export default App;
