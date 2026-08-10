import { createBrowserRouter } from "react-router";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import FindCenter from "./pages/FindCenter";
import CenterDetail from "./pages/CenterDetail";
import Events from "./pages/Events";
import NewSeekerJourney from "./pages/NewSeekerJourney";
import VolunteerSystem from "./pages/VolunteerSystem";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoutes";

export const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/find-center", element: <FindCenter /> },
  { path: "/center/:id", element: <CenterDetail /> },
  { path: "/events", element: <Events /> },
  { path: "/journey", element: <NewSeekerJourney /> },
  { path: "/volunteer", element: <VolunteerSystem /> },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
]);
