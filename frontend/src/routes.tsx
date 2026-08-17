import { createBrowserRouter } from "react-router-dom";

import Home from "./pages/Home";
import AdminLogin from "./pages/AdminLogin";import FindCenter from "./pages/FindCenter";
import CenterDetail from "./pages/CenterDetail";
import Events from "./pages/Events";
import NewSeekerJourney from "./pages/NewSeekerJourney";
import VolunteerSystem from "./pages/VolunteerSystem";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoutes";

export const router = createBrowserRouter([
  { path: "/", element: <Home /> },

  // Public pages
  { path: "/find-center", element: <FindCenter /> },
  { path: "/center/:id", element: <CenterDetail /> },
  { path: "/events", element: <Events /> },
  { path: "/journey", element: <NewSeekerJourney /> },
  { path: "/volunteer", element: <VolunteerSystem /> },

  // Admin authentication
  { path: "/admin/login", element: <AdminLogin /> },

  // Protected admin dashboard
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
]);