import { createBrowserRouter, RouterProvider, Route, createRoutesFromElements } from 'react-router-dom';
import RootLayout from './pages/RootLayout';
import Signup from './pages/Signup';
import Home from './pages/Home';
import AddPlaylist from './components/widgets/AddPlaylist';
import Login from './pages/Login';

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
    </>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
