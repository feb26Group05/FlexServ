import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { logout } from "../../redux/authSlice";
import api from "../../api/api";
import Cookies from "js-cookie";
import MyBookingsModal from "../Booking/MyBookingsModal";
import { FaCalendarCheck, FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const [showMyBookings, setShowMyBookings] = useState(false);

  const handleNavClick = (sectionId) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        if (sectionId) {
          const el = document.getElementById(sectionId);
          if (el) el.scrollIntoView({ behavior: "smooth" });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }, 100);
    } else {
      if (sectionId) {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (e) {
      console.warn("Logout error:", e);
    }
    Cookies.remove("JWT");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userRole");
    dispatch(logout());
    navigate("/login");
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-logo" onClick={() => handleNavClick(null)}>
          <h1>FlexServ</h1>
        </div>

        <ul className="nav-links">
          <li className="nav-item" onClick={() => handleNavClick(null)}>
            Home
          </li>
          <li className="nav-item" onClick={() => handleNavClick("services-section")}>
            Services
          </li>
          <li className="nav-item" onClick={() => handleNavClick("categories-section")}>
            Categories
          </li>
        </ul>

        <div className="nav-buttons">
          {isAuthenticated && currentUser ? (
            <div className="user-nav-actions">
              <button
                className="my-bookings-btn"
                onClick={() => setShowMyBookings(true)}
              >
                <FaCalendarCheck /> My Bookings
              </button>

              <button
                className="view-profile-btn"
                onClick={() => navigate("/profile")}
              >
                <FaUserCircle /> View Profile
              </button>

              <button className="nav-logout-btn" onClick={handleLogout}>
                <FaSignOutAlt /> Logout
              </button>
            </div>
          ) : (
            <button className="nav-login-btn" onClick={() => navigate("/login")}>
              Login
            </button>
          )}
        </div>
      </nav>

      {showMyBookings && (
        <MyBookingsModal onClose={() => setShowMyBookings(false)} />
      )}
    </>
  );
}