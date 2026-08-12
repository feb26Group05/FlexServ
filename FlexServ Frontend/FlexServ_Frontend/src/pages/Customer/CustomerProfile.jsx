import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import businessApi from "../../api/businessApi";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { setUser } from "../../redux/authSlice";
import { useToast } from "../../components/Toast/ToastContext";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaMapMarkerAlt,
  FaEdit,
  FaSave,
  FaPlus,
  FaShieldAlt,
  FaCalendarAlt,
} from "react-icons/fa";
import "./CustomerProfile.css";

export default function CustomerProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();

  const reduxUser = useSelector((state) => state.auth.user);

  const getUser = () => {
    if (reduxUser) return reduxUser;
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  const currentUser = getUser();

  const [profileData, setProfileData] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [emailValue, setEmailValue] = useState("");

  // Address Modal State
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddr, setNewAddr] = useState({
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
  });

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    const loadProfile = async () => {
      setLoading(true);
      try {
        // Fetch User Profile
        const res = await businessApi.get("/users/profile");
        const userObj = res.data?.data || res.data;
        if (userObj) {
          setProfileData(userObj);
          setFormName(userObj.name || "");
          setFormPhone(userObj.phone || "");
          setEmailValue(userObj.email || currentUser.email || "");
        }

        // Fetch User Addresses
        const addrRes = await businessApi.get("/users/addresses");
        const addrList = Array.isArray(addrRes.data?.data) ? addrRes.data.data : [];
        setAddresses(addrList);
      } catch (err) {
        console.error("Error fetching user profile:", err);
        toast.error("Failed to load profile details");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [currentUser, navigate]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    if (!formName.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    if (!/^[6-9]\d{9}$/.test(formPhone)) {
      toast.error("Enter a valid 10-digit mobile number");
      return;
    }

    try {
      setSubmitting(true);
      const res = await businessApi.put("/users/profile", {
        name: formName,
        phone: formPhone,
      });

      const updatedUser = res.data?.data || res.data;
      if (updatedUser) {
        setProfileData(updatedUser);
        const mergedUser = { ...currentUser, name: updatedUser.name, phone: updatedUser.phone };
        localStorage.setItem("user", JSON.stringify(mergedUser));
        dispatch(setUser(mergedUser));
        toast.success("Profile updated successfully!");
        setIsEditing(false);
      }
    } catch (err) {
      toast.error("Profile update failed: " + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!newAddr.streetAddress || !newAddr.city || !newAddr.state || !newAddr.zipCode) {
      toast.error("Please fill out all address fields.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await businessApi.post("/users/addresses", {
        houseNo: "A-1",
        street: newAddr.streetAddress,
        area: newAddr.city,
        city: newAddr.city,
        state: newAddr.state,
        pincode: newAddr.zipCode,
      });

      const added = res.data?.data;
      if (added) {
        setAddresses((prev) => [...prev, added]);
        setShowAddAddress(false);
        setNewAddr({ streetAddress: "", city: "", state: "", zipCode: "" });
        toast.success("New address added successfully!");
      }
    } catch (err) {
      toast.error("Failed to add address: " + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="profile-page-container">
      <Navbar />

      <main className="profile-content-wrapper">
        {loading ? (
          <div className="profile-loader">Loading customer profile...</div>
        ) : (
          <div className="profile-grid">
            {/* Left Card: Summary Badge */}
            <div className="profile-summary-card">
              <div className="avatar-circle">
                {profileData?.name?.charAt(0).toUpperCase() || "C"}
              </div>
              <h2>{profileData?.name || currentUser?.name}</h2>
              <p className="user-email-text">{profileData?.email || currentUser?.email}</p>
              <span className="role-pill">
                <FaShieldAlt /> {profileData?.role || "CUSTOMER"}
              </span>

              <div className="meta-info">
                <p>
                  <FaCalendarAlt /> Member Since: {profileData?.createdAt ? new Date(profileData.createdAt).toLocaleDateString() : "2026"}
                </p>
                <p>
                  <FaPhone /> {profileData?.phone || "Not set"}
                </p>
              </div>
            </div>

            {/* Right Card: Account Details & Editing */}
            <div className="profile-details-card">
              <div className="card-header">
                <div>
                  <h3>Account Details</h3>
                  <p>Manage your profile information and contact details</p>
                </div>
                {!isEditing ? (
                  <button className="edit-profile-btn" onClick={() => setIsEditing(true)}>
                    <FaEdit /> Edit Profile
                  </button>
                ) : (
                  <button className="cancel-edit-btn" onClick={() => setIsEditing(false)}>
                    Cancel
                  </button>
                )}
              </div>

              <form onSubmit={handleUpdateProfile}>
                {/* Email Field - STRICTLY DISABLED / READ ONLY */}
                <div className="profile-form-group">
                  <label>
                    <FaEnvelope /> Email Address (Username)
                  </label>
                  <div className="readonly-input-wrapper">
                    <input
                      type="email"
                      value={emailValue}
                      disabled={true}
                      readOnly={true}
                      className="profile-input disabled-input"
                    />
                    <FaLock className="lock-icon" title="Username/Email cannot be updated" />
                  </div>
                  <span className="field-hint">
                    🔒 Email is your primary username and cannot be updated.
                  </span>
                </div>

                {/* Full Name Field */}
                <div className="profile-form-group">
                  <label>
                    <FaUser /> Full Name
                  </label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    disabled={!isEditing}
                    className={`profile-input ${!isEditing ? "read-only-style" : ""}`}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                {/* Phone Field */}
                <div className="profile-form-group">
                  <label>
                    <FaPhone /> Phone Number
                  </label>
                  <input
                    type="text"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    disabled={!isEditing}
                    className={`profile-input ${!isEditing ? "read-only-style" : ""}`}
                    placeholder="Enter 10-digit mobile number"
                    required
                  />
                </div>

                {isEditing && (
                  <div className="form-actions">
                    <button type="submit" className="save-btn" disabled={submitting}>
                      <FaSave /> {submitting ? "Saving..." : "Save Profile Changes"}
                    </button>
                  </div>
                )}
              </form>

              {/* Saved Service Addresses */}
              <div className="addresses-section">
                <div className="section-header">
                  <h4>
                    <FaMapMarkerAlt /> Saved Service Addresses ({addresses.length})
                  </h4>
                  <button
                    className="add-address-btn"
                    onClick={() => setShowAddAddress(!showAddAddress)}
                  >
                    <FaPlus /> Add New Address
                  </button>
                </div>

                {showAddAddress && (
                  <form onSubmit={handleAddAddress} className="add-address-form">
                    <input
                      type="text"
                      placeholder="Street Address / House No"
                      value={newAddr.streetAddress}
                      onChange={(e) => setNewAddr({ ...newAddr, streetAddress: e.target.value })}
                      required
                    />
                    <div className="input-grid">
                      <input
                        type="text"
                        placeholder="City"
                        value={newAddr.city}
                        onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                        required
                      />
                      <input
                        type="text"
                        placeholder="State"
                        value={newAddr.state}
                        onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                        required
                      />
                      <input
                        type="text"
                        placeholder="Zip Code"
                        value={newAddr.zipCode}
                        onChange={(e) => setNewAddr({ ...newAddr, zipCode: e.target.value })}
                        required
                      />
                    </div>
                    <button type="submit" className="save-address-btn" disabled={submitting}>
                      Save Address
                    </button>
                  </form>
                )}

                {addresses.length === 0 ? (
                  <p className="no-address-text">No saved addresses found. Add one above.</p>
                ) : (
                  <div className="addresses-grid">
                    {addresses.map((addr) => (
                      <div key={addr.id} className="address-card">
                        <p className="street-line">{addr.streetAddress || addr.street}</p>
                        <p className="city-line">
                          {addr.city}, {addr.state} - {addr.zipCode || addr.pincode}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
