import "./Login.css";
import {
    FaUser,
    FaLock,
    FaShieldAlt,
    FaHeadset,
} from "react-icons/fa";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import api from "../../api/api";
import { loginSuccess } from "../../redux/authSlice";

import { useToast } from "../../components/Toast/ToastContext";

export default function Login() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const toast = useToast();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [errors, setErrors] = useState({
        email: "",
        password: "",
    });

    // Validation Function
    const validate = () => {
        let tempErrors = {};

        // Email Validation
        if (!email.trim()) {
            tempErrors.email = "Email is required";
        } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)
        ) {
            tempErrors.email = "Enter a valid email";
        }

        // Password Validation
        if (!password) {
            tempErrors.password = "Password is required";
        } else if (password.length < 6) {
            tempErrors.password =
                "Password must be at least 6 characters";
        }

        setErrors(tempErrors);

        return Object.keys(tempErrors).length === 0;
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        try {
            const res = await api.post("/auth/login", {
                email,
                password,
            });
            
            const userData = res.data.data;
            dispatch(loginSuccess(userData));
            
            if (userData) {
                localStorage.setItem("user", JSON.stringify(userData));
                localStorage.setItem("userRole", userData.role);
                if (userData.token) {
                    localStorage.setItem("token", userData.token);
                }
            }

            
            const role = userData?.role?.toUpperCase();

            toast.success("Welcome back! Login Successful.");

            if (role === "CUSTOMER") {
                navigate("/");
            } else if (role === "PROVIDER") {
                navigate("/provider");
            } else if (role === "ADMIN") {
                navigate("/admin");
            } else {
                navigate("/");
            }

        } catch (err) {
            const errorMessage = err.response?.data?.message 
                || (err.code === "ERR_NETWORK" || !err.response 
                    ? "Unable to connect to server. Please check if the backend service is running on port 8080." 
                    : "Login Failed");
            toast.error(errorMessage);
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

                    {/* Email */}
                    <div className="input-group">
                        <label>Email</label>

                        <div className="input-box">
                            <FaUser />

                            <input
                                type="text"
                                placeholder="Enter email"
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

                  

                    <button
                        className="login-btn"
                        onClick={handleLogin}
                    >
                        Login
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