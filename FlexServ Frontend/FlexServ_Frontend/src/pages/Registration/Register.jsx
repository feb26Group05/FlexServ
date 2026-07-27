import { useState } from "react";
import "./Register.css";
import axios from "axios";
import { Link } from "react-router-dom";

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
      newErrors.email = "Invalid email";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = "Enter a valid 10-digit Indian mobile number";
    }

    if (!formData.role) {
      newErrors.role = "Please select a role";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    console.log("Validation Errors:", newErrors);

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

  if (!validate()) {
    return;
  }

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
  console.log("Full Error:", error);
  console.log("Response:", error.response);
  console.log("Request:", error.request);
  console.log("Message:", error.message);

  if (error.response) {
    alert(error.response.data.message);
  } else {
    alert(error.message);
  }
  }
};

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">FlexServ Registration</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">First Name</label>

            <div className="input-box">
              <input
                type="text"
                name="firstName"
                className="custom-input"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Last Name</label>

            <div className="input-box">
              <input
                type="text"
                name="lastName"
                className="custom-input"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <div className="input-box">
              <input
                type="email"
                name="email"
                className="custom-input"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Phone</label>
            <div className="input-box">
              <input
                type="tel"
                name="phone"
                className="custom-input"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Role</label>
            <div className="input-box">
              <select
                name="role"
                className="custom-input custom-select"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Select Role
                </option>

                <option value="USER">User</option>
                <option value="PROVIDER">Service Provider</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>

            <div className="input-box">
              <input
                type="password"
                name="password"
                className="custom-input"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            {errors.password && (
              <p className="error-message">{errors.password}</p>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <div className="input-box">
              <input
                type="password"
                name="confirmPassword"
                className="custom-input"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="button-section">
            <button type="submit" className="register-btn">
              Register
            </button>
          </div>

          <div className="register">
            Not a new user?
            <Link to="/"> Log In</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
