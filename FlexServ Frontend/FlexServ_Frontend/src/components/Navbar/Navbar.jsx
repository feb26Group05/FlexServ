// import "./Navbar.css";


// export default function Navbar(){

//     return(

//         <nav className="navbar">


//             <div className="navbar-logo">

//                 <h1>
//                     FlexServ
//                 </h1>

//             </div>



//             <ul className="nav-links">

//                 <li>
//                     Home
//                 </li>

//                 <li>
//                     Services
//                 </li>

//                 <li>
//                     Providers
//                 </li>

//                 <li>
//                     About
//                 </li>

//             </ul>



//             <div className="nav-buttons">


//                 {/* <button className="partner-btn">

//                     Become Partner

//                 </button> */}


//               <a href="/login"> <button className="nav-login-btn">

//                     Login

//                 </button></a> 


//             </div>


//         </nav>

//     );

// }
// import React from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// // Import logout action if available from your authSlice
// // import { logout } from "../redux/authSlice"; 
// import "../../pages/Admin/AdminDashboard.css"; // Uses your dark glass design variables

// const Navbar = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
  
//   // Read user state from Redux (fallback to localStorage check if needed)
//   const { user } = useSelector((state) => state.auth || {});

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     // dispatch(logout());
//     navigate("/login");
//   };

//   return (
//     <nav className="glass-header" style={{ marginBottom: "20px" }}>
//       <div className="header-left">
//         <Link to="/" style={{ textDecoration: "none" }}>
//           <div className="brand-info">
//             <h1>Flex<span>Serv</span></h1>
//             <p><span className="status-indicator"></span> Home Services</p>
//           </div>
//         </Link>
//       </div>

//       <div className="header-right">
//         <Link to="/" className="tab-button" style={{ textDecoration: "none" }}>
//           Home
//         </Link>

//         {user ? (
//           <>
//             <Link to="/profile" className="btn-primary-action" style={{ textDecoration: "none" }}>
//               👤 My Profile
//             </Link>
//             {user.role === "ADMIN" && (
//               <Link to="/admin" className="tab-button" style={{ textDecoration: "none" }}>
//                 Admin Portal
//               </Link>
//             )}
//             <button className="btn-glass-secondary" onClick={handleLogout}>
//               Logout
//             </button>
//           </>
//         ) : (
//           <>
//             <Link to="/login" className="btn-glass-secondary" style={{ textDecoration: "none" }}>
//               Login
//             </Link>
//             <Link to="/register" className="btn-primary-action" style={{ textDecoration: "none" }}>
//               Register
//             </Link>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
// Import your logout action if present in your authSlice:
// import { logout } from "../redux/authSlice"; 
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