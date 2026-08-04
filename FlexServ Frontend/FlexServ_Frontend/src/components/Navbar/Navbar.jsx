import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Read user state from Redux store
  const { user } = useSelector((state) => state.auth || {});

  const handleLogout = () => {
    localStorage.removeItem("token");
    // dispatch(logout()); // Dispatch redux logout if available
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          <h1>FlexServ</h1>
        </Link>
      </div>

      <ul className="nav-links">
        <li>
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            Home
          </Link>
        </li>
        <li>
          <Link to="/services" style={{ textDecoration: "none", color: "inherit" }}>
            Services
          </Link>
        </li>
        <li>
          <Link to="/providers" style={{ textDecoration: "none", color: "inherit" }}>
            Providers
          </Link>
        </li>
        <li>
          <Link to="/about" style={{ textDecoration: "none", color: "inherit" }}>
            About
          </Link>
        </li>
      </ul>

      <div className="nav-buttons">
        {user ? (
          <>
            <Link to="/profile">
              <button className="nav-login-btn">👤 My Profile</button>
            </Link>

            {user.role === "ADMIN" && (
              <Link to="/admin">
                <button className="nav-login-btn" style={{ marginLeft: "10px" }}>
                  Admin Portal
                </button>
              </Link>
            )}

            <button 
              className="nav-login-btn" 
              onClick={handleLogout} 
              style={{ marginLeft: "10px", backgroundColor: "#f43f5e" }}
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login">
            <button className="nav-login-btn">Login</button>
          </Link>
        )}
      </div>
    </nav>
  );
}