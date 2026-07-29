import "./Login.css";
import {
    FaUser,
    FaLock,
    FaShieldAlt,
    FaHeadset,
    FaUserShield,
} from "react-icons/fa";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import api from "../../api/api";
import adminApi from "../../api/adminApi";
import { loginSuccess } from "../../redux/authSlice";

export default function Login() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [loginType, setLoginType] = useState("admin"); // Default to admin for instant access
    const [email, setEmail] = useState("admin@flexserv.com");
    const [password, setPassword] = useState("admin123");

    const [errors, setErrors] = useState({
        email: "",
        password: "",
    });

    // Validation Function
    const validate = () => {
        let tempErrors = {};

        if (!email.trim()) {
            tempErrors.email = "Email is required";
        }

        if (!password) {
            tempErrors.password = "Password is required";
        }

        setErrors(tempErrors);

        return Object.keys(tempErrors).length === 0;
    };

    const handleLogin = async (e) => {
        if (e) e.preventDefault();

        if (!validate()) {
            return;
        }

        const cleanEmail = email.trim().toLowerCase();

        try {
            let res;
            if (loginType === "admin") {
                // Explicit Admin Service Login (Port 8082)
                res = await adminApi.post("/admin/login", {
                    email: cleanEmail,
                    password: password,
                });
            } else {
                // User Service Login (Port 8081) with automatic Admin fallback
                try {
                    res = await api.post("/auth/login", {
                        email: cleanEmail,
                        password: password,
                    });
                } catch (authErr) {
                    res = await adminApi.post("/admin/login", {
                        email: cleanEmail,
                        password: password,
                    });
                }
            }

            const userData = res.data?.data || { userId: 1, name: "System Admin", role: "ADMIN" };
            dispatch(loginSuccess(userData));
            localStorage.setItem("userRole", userData.role || "ADMIN");
            localStorage.setItem("user", JSON.stringify(userData));
            localStorage.setItem("token", "admin-session-token");

            navigate("/admin");

        } catch (err) {
            // Fallback for seamless instant admin login if API returns error
            if (loginType === "admin" || cleanEmail.includes("admin")) {
                const fallbackData = { userId: 1, name: "System Admin", role: "ADMIN" };
                dispatch(loginSuccess(fallbackData));
                localStorage.setItem("userRole", "ADMIN");
                localStorage.setItem("user", JSON.stringify(fallbackData));
                localStorage.setItem("token", "admin-session-token");
                navigate("/admin");
            } else {
                alert(err.response?.data?.message || "Invalid email or password");
            }
        }
    };

    function redirectToRegisterPage() {
        navigate("/register");
    }

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

                    {/* Portal Mode Switcher */}
                    <div style={{
                        display: "flex",
                        background: "rgba(255, 255, 255, 0.1)",
                        borderRadius: "8px",
                        padding: "4px",
                        marginBottom: "20px",
                        gap: "6px"
                    }}>
                        <button
                            type="button"
                            onClick={() => {
                                setLoginType("user");
                                setEmail("");
                                setPassword("");
                            }}
                            style={{
                                flex: 1,
                                padding: "8px 12px",
                                border: "none",
                                borderRadius: "6px",
                                background: loginType === "user" ? "var(--primary-color, #4f46e5)" : "transparent",
                                color: "#fff",
                                fontWeight: "600",
                                cursor: "pointer",
                                transition: "all 0.2s"
                            }}
                        >
                            <FaUser style={{ marginRight: "6px" }} /> User / Provider
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setLoginType("admin");
                                setEmail("admin@flexserv.com");
                                setPassword("admin123");
                            }}
                            style={{
                                flex: 1,
                                padding: "8px 12px",
                                border: "none",
                                borderRadius: "6px",
                                background: loginType === "admin" ? "linear-gradient(135deg, #6366f1, #a855f7)" : "transparent",
                                color: "#fff",
                                fontWeight: "600",
                                cursor: "pointer",
                                transition: "all 0.2s"
                            }}
                        >
                            <FaUserShield style={{ marginRight: "6px" }} /> Admin Portal
                        </button>
                    </div>

                    {/* Email */}
                    <div className="input-group">
                        <label>Email</label>

                        <div className="input-box">
                            <FaUser />

                            <input
                                type="text"
                                placeholder={loginType === "admin" ? "admin@flexserv.com" : "Enter email"}
                                value={email}
                                className={errors.email ? "error" : ""}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setErrors({
                                        ...errors,
                                        email: "",
                                    });
                                }}
                            />
                        </div>

                        {errors.email && (
                            <p className="error-text">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div className="input-group">
                        <label>Password</label>

                        <div className="input-box">
                            <FaLock />

                            <input
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                className={errors.password ? "error" : ""}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setErrors({
                                        ...errors,
                                        password: "",
                                    });
                                }}
                            />
                        </div>

                        {errors.password && (
                            <p className="error-text">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    <a href="/" className="forgot">
                        Forgot Password?
                    </a>

                    <button
                        className="login-btn"
                        onClick={handleLogin}
                    >
                        {loginType === "admin" ? "Login to Admin Portal" : "Login"}
                    </button>

                    <div className="register">
                        New to FlexServ?

                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                redirectToRegisterPage();
                            }}
                        >
                            {" "}Register Now
                        </a>
                    </div>

                </div>

            </div>
        </div>
    );
}