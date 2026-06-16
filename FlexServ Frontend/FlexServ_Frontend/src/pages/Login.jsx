import "./Login.css";
import {
  FaUser,
  FaLock,
  FaShieldAlt,
  FaHeadset,
} from "react-icons/fa";

export default function Login() {
  return (
    <div className="login-container">
      <div className="overlay">

        {/* Left Content */}
        <div className="left-section">
          <div className="logo">
            <h1>FlexServ</h1>
            <span>BOOKING SYSTEM</span>
          </div>

          <div className="hero-content">
            <h2>
              Quality Services
              <br />
              You Can Trust
            </h2>

            <p>
              Book trusted professionals
              <br />
              quickly and easily.
            </p>
          </div>

          <div className="features">
            <div>
              <FaShieldAlt />
              <span>Verified Professionals</span>
            </div>

            <div>
              <FaShieldAlt />
              <span>Secure Payments</span>
            </div>

            <div>
              <FaHeadset />
              <span>24/7 Support</span>
            </div>
          </div>
        </div>

        {/* Login Card */}
        <div className="login-card">
          <h1>Welcome Back!</h1>
          <p>Login to your account</p>

          <div className="input-group">
            <label>Email or Mobile Number</label>

            <div className="input-box">
              <FaUser />
              <input
                type="text"
                placeholder="Enter email or mobile number"
              />
            </div>
          </div>

          <div className="input-group">
            <label>Password</label>

            <div className="input-box">
              <FaLock />
              <input
                type="password"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <a href="/" className="forgot">
            Forgot Password?
          </a>

          <button className="login-btn">
            Login
          </button>

          <div className="register">
            New to Urban Services?
            <a href="/"> Register Now</a>
          </div>
        </div>

      </div>
    </div>
  );
}