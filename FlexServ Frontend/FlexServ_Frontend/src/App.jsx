import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import api from "./api/api";
import { restoreSession } from "./redux/authSlice";

import Login from "./pages/Login/Login";
import Register from "./pages/Registration/Register";
import HomePage from "./pages/Home/HomePage";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminAccountManagement from "./pages/Admin/AdminAccountManagement";
import ProviderDashboard from "./pages/Provider/ProviderDashboard";
import CustomerProfile from "./pages/Customer/CustomerProfile";
import ProtectedRoute from "./components/ProtectedRoute";
import ChatWidget from './components/ChatWidget/ChatWidget';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          dispatch(restoreSession(JSON.parse(storedUser)));
        } catch (error) {
          localStorage.removeItem("user");
          localStorage.removeItem("userRole");
        }
      }
    };

    loadUser();
  }, [dispatch]);

  return (
    <BrowserRouter>
    <ChatWidget></ChatWidget>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<HomePage />} />

        {/* Fallback Route */}
        <Route path="*" element={<HomePage />} />

        {/* Customer Profile */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRole="CUSTOMER">
              <CustomerProfile />
            </ProtectedRoute>
          }
        />

        {/* Protected Admin Dashboard */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Protected Admin Account & Soft-Delete Hub */}
        <Route
          path="/admin/accounts"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <AdminAccountManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users-control"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <AdminAccountManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/soft-delete"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <AdminAccountManagement />
            </ProtectedRoute>
          }
        />

        {/* Protected Service Provider Dashboard */}
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
