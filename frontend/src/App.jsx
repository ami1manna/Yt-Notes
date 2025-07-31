import { createBrowserRouter, RouterProvider, Route, createRoutesFromElements } from 'react-router-dom';
import RootLayout from './pages/RootLayout/RootLayout';
import Signup from './pages/Signup/Signup';
import Home from './pages/Home/Home';
 
import Login from './pages/Login/Login';
import CourseScreen from './pages/CourseScreen/CourseScreen';
import DashBoard from './pages/Dashboard/DashBoard';
// import GroupList from './components/group/GroupList';
// import GroupDetails from './pages/Groups/GroupDetails';
// import GroupCreate from './pages/Groups/GroupCreate';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GroupDashboard from './pages/Groups/GroupDashboard';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Routes inside RootLayout */}
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Home />} />
        {/* <Route path='/groups' element={<GroupList />} /> */}
        <Route path='/groups' element={<GroupDashboard />} />
        {/* <Route path='/groups/create' element={<GroupCreate />} /> */}
        {/* <Route path='/groups/:groupId' element={<GroupDetails />} /> */}
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
