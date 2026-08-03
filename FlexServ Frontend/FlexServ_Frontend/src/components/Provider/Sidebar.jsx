import "./Sidebar.css";
import {
  FaHome,
  FaUser,
  FaTools,
  FaCalendarAlt,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

export default function Sidebar() {
  return (
    <div className="provider-sidebar">

      <div className="sidebar-logo">
        <h2>FlexServ</h2>
      </div>

      <ul className="sidebar-menu">

        <li className="active">
          <FaHome />
          <span>Dashboard</span>
        </li>

        <li>
          <FaUser />
          <span>My Profile</span>
        </li>

        <li>
          <FaTools />
          <span>My Services</span>
        </li>

        <li>
          <FaCalendarAlt />
          <span>Bookings</span>
        </li>

        <li>
          <FaCog />
          <span>Settings</span>
        </li>

      </ul>

      <div className="sidebar-footer">
        <button className="logout-btn">
          <FaSignOutAlt />
          Logout
        </button>
      </div>

    </div>
  );
}