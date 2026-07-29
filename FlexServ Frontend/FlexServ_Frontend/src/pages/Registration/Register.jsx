import { useState } from "react";
import "./Register.css";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaUserTag,
  FaShieldAlt,
  FaHeadset,
} from "react-icons/fa";

function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    let newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = "Enter a valid email";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = "Enter a valid 10-digit mobile number";
    }

    if (!formData.role) {
      newErrors.role = "Please select a role";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm your password";
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const requestData = {
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      role: formData.role,
    };

    try {
      const response = await axios.post(
        "http://localhost:8081/api/auth/register",
        requestData
      );

      alert(response.data.message || "Registration Successful");

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        role: "",
      });

      setErrors({});
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert(error.message);
      }
    }
  };

  return (
    <div className="register-container">
      <div className="overlay">
        {/* Left Section */}
        <div className="left-section">
          <div className="logo">
            <h1>FlexServ</h1>
           
          </div>

          <div className="hero-content">
            <h2>
              Join FlexServ
              <br />
              Today
            </h2>

            <p>
              Create your account and connect with
              <br />
              trusted professionals instantly.
            </p>
          </div>

          <div className="features">
            <div>
              <FaShieldAlt />
              <span>Verified Professionals</span>
            </div>

            <div>
              <FaShieldAlt />
              <span>Secure Platform</span>
            </div>

            <div>
              <FaHeadset />
              <span>24/7 Support</span>
            </div>
          </div>
        </div>

        {/* Register Card */}

        <div className="register-card">
          <h1>Create Account</h1>
          <p>Register to continue</p>

          <form onSubmit={handleSubmit}>
            {/* Name Row */}

            <div className="row">
              <div className="input-group">
                <label>First Name</label>

                <div className="input-box">
                  <FaUser />

                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>

                {errors.firstName && (
                  <p className="error-text">{errors.firstName}</p>
                )}
              </div>

              <div className="input-group">
                <label>Last Name</label>

                <div className="input-box">
                  <FaUser />

                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>

                {errors.lastName && (
                  <p className="error-text">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email */}

            <div className="input-group">
              <label>Email</label>

              <div className="input-box">
                <FaEnvelope />

                <input
                  type="email"
                  name="email"
                  placeholder="Enter Email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              {errors.email && (
                <p className="error-text">{errors.email}</p>
              )}
            </div>

            {/* Phone */}

            <div className="input-group">
              <label>Phone</label>

              <div className="input-box">
                <FaPhone />

                <input
                  type="tel"
                  name="phone"
                  placeholder="Enter Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              {errors.phone && (
                <p className="error-text">{errors.phone}</p>
              )}
            </div>

            {/* Role */}

            <div className="input-group">
              <label>Role</label>

              <div className="input-box">
                <FaUserTag />

                <select
                  name="role"
                  className="custom-select"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="">Select Role</option>

                  <option value="CUSTOMER">Customer</option>
                  <option value="PROVIDER">Service Provider</option>
                </select>
              </div>

              {errors.role && (
                <p className="error-text">{errors.role}</p>
              )}
            </div>

            {/* Password */}

            <div className="input-group">
              <label>Password</label>

              <div className="input-box">
                <FaLock />

                <input
                  type="password"
                  name="password"
                  placeholder="Enter Password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              {errors.password && (
                <p className="error-text">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}

            <div className="input-group">
              <label>Confirm Password</label>

              <div className="input-box">
                <FaLock />

                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>

              {errors.confirmPassword && (
                <p className="error-text">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="register-btn"
            >
              Create Account
            </button>

            <div className="register">
              Already have an account?

              <Link to="/login"> Login</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;