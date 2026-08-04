import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import api from "./api/api";
import { restoreSession } from "./redux/authSlice";

import Login from "./pages/Login/Login";
import Register from "./pages/Registration/Register";
import HomePage from "./pages/Home/HomePage";
import ServicesPage from "./pages/Services/ServicesPage";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import UserProfile from "./pages/User/UserProfile"; // Profile component
import ProtectedRoute from "./components/ProtectedRoute";
import ProviderDashboard from "./pages/Provider/ProviderDashboard";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await api.get("/auth/me");
        dispatch(restoreSession(response.data.user));
      } catch (error) {
        localStorage.removeItem("token");
      }
    };

    loadUser();
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Landing/Home Page */}
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<ServicesPage />} />

        {/* Protected User Routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        {/* Alias /user route to avoid 404s */}
        <Route path="/user" element={<Navigate to="/profile" replace />} />

        {/* Protected Admin Dashboard */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Catch-all redirect to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route
          path="/provider"
          element={
              <ProtectedRoute allowedRole="PROVIDER">
                  <ProviderDashboard />
              </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;