import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import api from "./api/api";
import { restoreSession } from "./redux/authSlice";

import Login from "./pages/Login/Login";
import Register from "./pages/Registration/Register";
import HomePage from "./pages/Home/HomePage";
import AdminDashboard from "./pages/Admin/AdminDashboard";

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

        <Route path="/" element={<HomePage/>} />

        {/* Admin Dashboard */}

        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;