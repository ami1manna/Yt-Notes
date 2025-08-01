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
import GroupDetails from "./pages/GroupDetails/GroupDetails";
import GroupDetailActivity from "./components/groupdetails/GroupDetailActivity";
import GroupDetailsPlaylists from "@/components/groupdetails/GroupsDetailPlaylists";
import GroupMember from "./pages/GroupMember/GroupMember";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Routes inside RootLayout */}
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Home />} />

        <Route path="/groups" element={<GroupDashboard />} />

        {/* Parent layout route for group details */}
        <Route path="/groups/:groupId" element={<GroupDetails />}>
          <Route index element={<Navigate to="playlists" replace />} />
          {/* <Route path="overview" element={<GroupDetailOverview />} /> */}
          <Route path="activity" element={<GroupDetailActivity />} />
          <Route path="playlists" element={<GroupDetailsPlaylists />} />
         <Route path="members" element={<GroupMember />} />
          {/*  // <Route path="notes" element={<NotesPage />} /> */}
        </Route>
      </Route>

      {/* Separate Routes for Login and Signup (No RootLayout) */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/courseScreen/:playlistId" element={<CourseScreen />} />
      <Route path="/dashboard" element={<DashBoard />} />
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
