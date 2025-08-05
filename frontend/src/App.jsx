// library
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
  Navigate,
} from "react-router-dom";

// pages
import RootLayout from "./pages/RootLayout/RootLayout";
import Signup from "./pages/Signup/Signup";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import CourseScreen from "./pages/CourseScreen/CourseScreen";
import DashBoard from "./pages/Dashboard/DashBoard";
import GroupDashboard from "./pages/Groups/GroupDashboard";

// components
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// group details Screen
import GroupDetails from "./pages/GroupDetails/GroupDetails";
import GroupMember from "./pages/GroupMember/GroupMember";
import SharedNotes from "./pages/SharedNotes/SharedNotes";
import GroupPlaylists from "./pages/GroupDetails/GroupPlaylists";
import GroupPlaylistDetails from "@/pages/GroupPlaylistDetails/GroupPlayListDetails";
 
 
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="/groups" element={<GroupDashboard />} />

        {/* GROUP DETAILS nested under groupId */}
        <Route path="/groups/:groupId" element={<GroupDetails />}>
          <Route index element={<Navigate to="playlists" replace />} />
          <Route path="notes" element={<SharedNotes />} />
          <Route path="playlists" element={<GroupPlaylists />} />
          <Route path="members" element={<GroupMember />} />
        </Route>

       
      </Route>

      {/* Standalone Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/courseScreen/:playlistId" element={<CourseScreen />} />
      <Route path="/dashboard" element={<DashBoard />} />
       <Route
          path="/groups/:groupId/playlists/:playlistId"
          element={<GroupPlaylistDetails />}
        />
    </>
  )
);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
