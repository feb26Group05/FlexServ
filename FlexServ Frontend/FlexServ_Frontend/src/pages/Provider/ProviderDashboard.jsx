import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import businessApi from "../../api/businessApi";
import transactionApi from "../../api/transactionApi";
import api from "../../api/api";
import "./ProviderDashboard.css";
import { logout } from "../../redux/authSlice";
import Cookies from "js-cookie";
import {
  FaBriefcase,
  FaCalendarCheck,
  FaClock,
  FaCheckCircle,
  FaDollarSign,
  FaStar,
  FaSignOutAlt,
  FaSync,
  FaToggleOn,
  FaToggleOff,
  FaConciergeBell,
  FaUserCheck,
  FaPhoneAlt,
  FaEnvelope,
  FaShieldAlt,
  FaTools,
  FaSearch,
  FaSave,
  FaLock,
  FaCheckSquare,
  FaRegSquare,
  FaEdit,
  FaPlus,
  FaTimes,
  FaHourglassHalf,
  FaTag,
  FaLayerGroup,
  FaCheck
} from "react-icons/fa";

import { useToast } from "../../components/Toast/ToastContext";

export default function ProviderDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();

  const { user: reduxUser } = useSelector((state) => state.auth);

  // Get current user from Redux or localStorage
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

  // State Variables
  const [providerProfile, setProviderProfile] = useState(null);
  const [bookingsList, setBookingsList] = useState([]);
  const [servicesList, setServicesList] = useState([]);
  const [reviewsList, setReviewsList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [selectedServiceIds, setSelectedServiceIds] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    userName: "",
    userPhone: "",
    userEmail: "",
    companyName: "",
    experienceYears: 0,
    bio: ""
  });

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("bookings");
  const [updatingAvailability, setUpdatingAvailability] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Custom Service Creation Modal State
  const [isCreateServiceModalOpen, setIsCreateServiceModalOpen] = useState(false);
  const [customServiceForm, setCustomServiceForm] = useState({
    categoryId: "",
    name: "",
    description: "",
    price: "",
    duration: 60
  });
  const [creatingService, setCreatingService] = useState(false);

  // Local state for editing prices and durations per service
  const [editingServices, setEditingServices] = useState({});
  const [updatingServiceId, setUpdatingServiceId] = useState(null);

  // Fetch Provider Info & Populate Database Records
  const fetchProviderData = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch all Providers from DB
      const allProvidersRes = await businessApi.get("/admin/providers");
      const allProviders = Array.isArray(allProvidersRes.data?.data) ? allProvidersRes.data.data : [];

      let pProfile = null;
      if (currentUser && currentUser.id) {
        // Try finding matching provider by userId, email, or name
        pProfile = allProviders.find((p) => p.userId === currentUser.id || p.userEmail === currentUser.email || p.userName === currentUser.name);
      }

      // If no exact match, fallback to first provider from DB so dashboard always populates
      if (!pProfile && allProviders.length > 0) {
        pProfile = allProviders[0];
      }

      setProviderProfile(pProfile);
      if (pProfile) {
        setFormData({
          userName: pProfile.userName || currentUser?.name || "",
          userPhone: pProfile.userPhone || currentUser?.phone || "",
          userEmail: pProfile.userEmail || currentUser?.email || "",
          companyName: pProfile.companyName || "",
          experienceYears: pProfile.experienceYears || 0,
          bio: pProfile.bio || ""
        });
        setSelectedServiceIds(pProfile.serviceIds || []);
      }

      // Fetch Bookings for this Provider via TransactionService (Port 8083)
      if (pProfile && pProfile.id) {
        try {
          const bRes = await transactionApi.get(`/bookings/provider/${pProfile.id}`);
          const bList = Array.isArray(bRes.data?.data) ? bRes.data.data : [];
          setBookingsList(bList);
        } catch (err) {
          const allB = await transactionApi.get("/bookings");
          const list = Array.isArray(allB.data?.data) ? allB.data.data : [];
          setBookingsList(list.filter((b) => Number(b.providerId) === Number(pProfile.id)));
        }

        // Fetch Reviews for this Provider
        try {
          const rRes = await transactionApi.get(`/reviews/provider/${pProfile.id}`);
          const rList = Array.isArray(rRes.data?.data) ? rRes.data.data : [];
          setReviewsList(rList);
        } catch (err) {
          console.warn("Could not fetch provider reviews:", err);
        }
      } else {
        const allB = await transactionApi.get("/bookings");
        const list = Array.isArray(allB.data?.data) ? allB.data.data : [];
        setBookingsList(list);
      }

      // Fetch Platform Services
      try {
        const sRes = await businessApi.get("/admin/services");
        const sList = Array.isArray(sRes.data?.data) ? sRes.data.data : [];
        setServicesList(sList);
      } catch (err) {
        console.error("Failed to fetch services list:", err);
      }

      // Fetch Platform Categories
      try {
        const cRes = await businessApi.get("/admin/categories");
        const cList = Array.isArray(cRes.data?.data) ? cRes.data.data : [];
        setCategoriesList(cList);
      } catch (err) {
        console.error("Failed to fetch categories list:", err);
      }
    } catch (error) {
      console.error("Error loading Provider Dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchProviderData();
  }, [fetchProviderData]);

  // Toggle Provider Availability in DB
  const handleToggleAvailability = async () => {
    if (!providerProfile || !providerProfile.id) return;
    const newStatus = !providerProfile.companyAvailable;
    try {
      setUpdatingAvailability(true);
      await businessApi.put(`/admin/providers/${providerProfile.id}/availability?available=${newStatus}`);
      setProviderProfile((prev) => ({ ...prev, companyAvailable: newStatus }));
      toast.success(`Availability status updated to: ${newStatus ? "AVAILABLE" : "UNAVAILABLE"}`);
    } catch (err) {
      toast.error("Failed to update availability: " + (err.response?.data?.message || err.message));
    } finally {
      setUpdatingAvailability(false);
    }
  };

  // Lifecycle transitions via TransactionService (Port 8083)
  const handleTransitionBookingStatus = async (bookingId, actionType) => {
    try {
      setStatusUpdating(bookingId);
      let endpoint = `/bookings/${bookingId}/status`;
      let payload = null;

      if (actionType === "CONFIRM") {
        endpoint = `/bookings/${bookingId}/confirm`;
      } else if (actionType === "REJECT") {
        endpoint = `/bookings/${bookingId}/reject`;
      } else if (actionType === "START") {
        endpoint = `/bookings/${bookingId}/start`;
      } else if (actionType === "COMPLETE") {
        endpoint = `/bookings/${bookingId}/complete`;
      } else if (actionType === "CANCEL") {
        endpoint = `/bookings/${bookingId}/cancel`;
      }

      const res = await transactionApi.put(endpoint, payload);
      const updatedBooking = res.data?.data;
      const newStatus = updatedBooking?.status || actionType;

      setBookingsList((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
      );
      toast.success(`Booking #${bookingId} status updated to ${newStatus}`);
    } catch (err) {
      toast.error("Failed updating booking status: " + (err.response?.data?.message || err.message));
    } finally {
      setStatusUpdating(null);
    }
  };

  // Form Input Handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Toggle Offered Service Selection
  const handleToggleService = (serviceId) => {
    setSelectedServiceIds((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  // Handle local service price and duration edits
  const handleServicePriceChange = (serviceId, value) => {
    setEditingServices((prev) => ({
      ...prev,
      [serviceId]: {
        ...prev[serviceId],
        price: value
      }
    }));
  };

  const handleServiceDurationChange = (serviceId, value) => {
    setEditingServices((prev) => ({
      ...prev,
      [serviceId]: {
        ...prev[serviceId],
        duration: value
      }
    }));
  };

  // Save specific service pricing & duration: PUT /api/admin/services/{id}
  const handleSaveServicePricingAndDuration = async (service, e) => {
    if (e) e.stopPropagation();
    const edited = editingServices[service.id];
    const newPrice = edited?.price !== undefined && edited.price !== "" ? parseFloat(edited.price) : service.price;
    const newDuration = edited?.duration !== undefined && edited.duration !== "" ? parseInt(edited.duration, 10) : service.duration;

    if (isNaN(newPrice) || newPrice <= 0) {
      toast.error("Please enter a valid price greater than 0");
      return;
    }
    if (isNaN(newDuration) || newDuration < 5) {
      toast.error("Duration must be at least 5 minutes");
      return;
    }

    try {
      setUpdatingServiceId(service.id);
      const payload = {
        categoryId: service.categoryId,
        name: service.name,
        description: service.description,
        price: newPrice,
        duration: newDuration
      };

      const res = await businessApi.put(`/admin/services/${service.id}`, payload);
      const updated = res.data?.data || { ...service, price: newPrice, duration: newDuration };

      setServicesList((prev) => prev.map((s) => (s.id === service.id ? updated : s)));
      toast.success(`Updated pricing (₹${newPrice}) and duration (${newDuration} mins) for "${service.name}"!`);
    } catch (err) {
      console.error("Failed to update service:", err);
      toast.error("Failed to update service: " + (err.response?.data?.message || err.message));
    } finally {
      setUpdatingServiceId(null);
    }
  };

  // Create New Custom Service from Categories: POST /api/admin/services
  const handleCreateCustomService = async (e) => {
    e.preventDefault();
    if (!customServiceForm.categoryId) {
      toast.error("Please select a category");
      return;
    }
    if (!customServiceForm.name.trim()) {
      toast.error("Service name is required");
      return;
    }
    if (!customServiceForm.price || Number(customServiceForm.price) <= 0) {
      toast.error("Please enter a valid price");
      return;
    }
    if (!customServiceForm.duration || Number(customServiceForm.duration) < 5) {
      toast.error("Duration must be at least 5 minutes");
      return;
    }

    try {
      setCreatingService(true);
      const payload = {
        categoryId: Number(customServiceForm.categoryId),
        name: customServiceForm.name.trim(),
        description: customServiceForm.description.trim(),
        price: parseFloat(customServiceForm.price),
        duration: parseInt(customServiceForm.duration, 10)
      };

      const res = await businessApi.post("/admin/services", payload);
      const newService = res.data?.data;
      toast.success("Custom service created successfully!");

      // Update services list in state
      setServicesList((prev) => [...prev, newService]);

      // Automatically add new service to offered services
      const updatedServiceIds = [...selectedServiceIds, newService.id];
      setSelectedServiceIds(updatedServiceIds);

      // Persist to provider profile
      if (providerProfile && providerProfile.id) {
        await businessApi.put(`/admin/providers/${providerProfile.id}`, {
          userName: formData.userName,
          userPhone: formData.userPhone,
          companyName: formData.companyName,
          experienceYears: Number(formData.experienceYears) || 0,
          bio: formData.bio,
          serviceIds: updatedServiceIds
        });
        toast.success(`"${newService.name}" added to your offered catalog!`);
      }

      // Reset form and close modal
      setCustomServiceForm({
        categoryId: "",
        name: "",
        description: "",
        price: "",
        duration: 60
      });
      setIsCreateServiceModalOpen(false);
    } catch (err) {
      console.error("Failed to create custom service:", err);
      toast.error("Failed to create service: " + (err.response?.data?.message || err.message));
    } finally {
      setCreatingService(false);
    }
  };

  // Save Provider Profile and Offered Services
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!providerProfile || !providerProfile.id) {
      toast.error("No provider profile found to update.");
      return;
    }

    try {
      setIsSaving(true);
      const payload = {
        userName: formData.userName,
        userPhone: formData.userPhone,
        companyName: formData.companyName,
        experienceYears: Number(formData.experienceYears) || 0,
        bio: formData.bio,
        serviceIds: selectedServiceIds
      };

      const res = await businessApi.put(`/admin/providers/${providerProfile.id}`, payload);
      const updated = res.data?.data;
      if (updated) {
        setProviderProfile(updated);
        if (updated.serviceIds) {
          setSelectedServiceIds(updated.serviceIds);
        }
      }
      toast.success("Profile & Offered Services updated successfully!");
    } catch (err) {
      toast.error("Failed to update profile: " + (err.response?.data?.message || err.message));
    } finally {
      setIsSaving(false);
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (e) {
      console.warn("Server logout notification:", e);
    }
    Cookies.remove("JWT");
    localStorage.removeItem("user");
    localStorage.removeItem("userRole");
    dispatch(logout());
    toast.success("Logged out successfully");
    navigate("/login");
  };

  // Metrics Calculations
  const totalBookingsCount = bookingsList.length;
  const pendingBookingsCount = bookingsList.filter((b) => b.status === "Pending" || b.status === "PENDING").length;
  const confirmedBookingsCount = bookingsList.filter((b) => b.status === "Confirmed" || b.status === "CONFIRMED").length;
  const totalRevenue = bookingsList
    .filter((b) => b.status === "Confirmed" || b.status === "CONFIRMED" || b.status === "Completed" || b.status === "COMPLETED")
    .reduce((sum, b) => sum + (parseFloat(b.totalPrice) || 0), 0);

  // Filter list by Search Query
  const filterBySearch = (list) => {
    if (!searchQuery) return list;
    const q = searchQuery.toLowerCase();
    return list.filter((item) =>
      Object.values(item).some(
        (val) => val && val.toString().toLowerCase().includes(q)
      )
    );
  };

  // Status Badge Helper for Bookings Table
  const getBookingStatusBadge = (status) => {
    const s = (status || "PENDING").toUpperCase();
    let badgeClass = "badge-status-pending";
    if (s === "CONFIRMED") badgeClass = "badge-status-confirmed";
    else if (s === "IN_PROGRESS" || s === "IN-PROGRESS") badgeClass = "badge-status-progress";
    else if (s === "COMPLETED") badgeClass = "badge-status-completed";
    else if (s === "CANCELLED") badgeClass = "badge-status-cancelled";
    else if (s === "REJECTED") badgeClass = "badge-status-rejected";

    return <span className={`booking-status-pill ${badgeClass}`}>{s}</span>;
  };

  return (
    <div className="provider-dashboard-container">
      <div className="dashboard-wrapper">
        {/* Glass Header */}
        <header className="glass-header">
          <div className="header-left">
            <div className="brand-icon-box">
              <FaBriefcase />
            </div>
            <div className="brand-info">
              <h1>
                {providerProfile?.companyName || "Service Provider"}{" "}
                <span>PARTNER PORTAL</span>
              </h1>
              <p>
                <span className="status-indicator"></span>
                {providerProfile?.userName || currentUser?.name || "Provider"} • Verified FlexServ Partner
              </p>
            </div>
          </div>

          <div className="header-right">
            {/* Availability Toggle */}
            <div
              className={`availability-toggle-box ${
                providerProfile?.companyAvailable ? "available" : "unavailable"
              }`}
              onClick={handleToggleAvailability}
              title="Click to toggle booking availability"
            >
              <div className="toggle-info">
                <span className="toggle-title">
                  {providerProfile?.companyAvailable ? "Accepting Jobs" : "Offline / Busy"}
                </span>
                <span className="toggle-sub">
                  {updatingAvailability ? "Updating..." : "Instant Live Switch"}
                </span>
              </div>
              <div className="toggle-icon">
                {providerProfile?.companyAvailable ? <FaToggleOn /> : <FaToggleOff />}
              </div>
            </div>

            <button className="btn-glass-secondary" onClick={handleLogout}>
              <FaSignOutAlt /> Exit
            </button>
          </div>
        </header>

        {/* Metrics Grid */}
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-icon indigo">
              <FaCalendarCheck />
            </div>
            <div className="metric-data">
              <h3>{totalBookingsCount}</h3>
              <p>Total Bookings</p>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon orange">
              <FaClock />
            </div>
            <div className="metric-data">
              <h3>{pendingBookingsCount}</h3>
              <p>Pending Approval</p>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon emerald">
              <FaCheckCircle />
            </div>
            <div className="metric-data">
              <h3>{confirmedBookingsCount}</h3>
              <p>Confirmed Jobs</p>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon rose">
              <FaDollarSign />
            </div>
            <div className="metric-data">
              <h3>₹{totalRevenue.toFixed(2)}</h3>
              <p>Estimated Revenue</p>
            </div>
          </div>
        </div>

        {/* Main Glass Panel */}
        <main className="main-glass-panel">
          <div className="tabs-bar">
            <button
              className={`tab-button ${activeTab === "bookings" ? "active" : ""}`}
              onClick={() => setActiveTab("bookings")}
            >
              <FaCalendarCheck /> Assigned Bookings ({bookingsList.length})
            </button>

            <button
              className={`tab-button ${activeTab === "services" ? "active" : ""}`}
              onClick={() => setActiveTab("services")}
            >
              <FaConciergeBell /> Platform Services ({servicesList.length})
            </button>

            <button
              className={`tab-button ${activeTab === "reviews" ? "active" : ""}`}
              onClick={() => setActiveTab("reviews")}
            >
              <FaStar /> Customer Reviews ({reviewsList.length})
            </button>

            <button
              className={`tab-button ${activeTab === "profile" ? "active" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              <FaEdit /> Profile & Offered Services
            </button>
          </div>

          {/* Toolbar Search Bar */}
          {activeTab !== "profile" && (
            <div className="toolbar-container">
              <div className="search-field-box">
                <FaSearch />
                <input
                  type="text"
                  placeholder={`Search inside ${activeTab}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Data Table / Content */}
          <div className="table-scroll-container">
            {loading ? (
              <div className="loader-box">Loading Provider Data from Database...</div>
            ) : activeTab === "bookings" ? (
              bookingsList.length === 0 ? (
                <div className="empty-box">No bookings found for your provider company in database.</div>
              ) : (
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Booking ID</th>
                      <th>Customer Details</th>
                      <th>Requested Service</th>
                      <th>Booking Schedule</th>
                      <th>Total Amount</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filterBySearch(bookingsList).map((item) => (
                      <tr key={item.id}>
                        <td className="row-id">#{item.id}</td>
                        <td>
                          <div className="user-identity">
                            <div className="avatar-badge">{item.customerName?.charAt(0) || "C"}</div>
                            <div className="name-email">
                              <h4>{item.customerName || "Customer Account"}</h4>
                              <p>{item.customerEmail || "No email listed"}</p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <strong>{item.serviceName}</strong>
                        </td>
                        <td>
                          {item.bookingDate} {item.bookingTime ? `@ ${item.bookingTime}` : ""}
                        </td>
                        <td className="price-tag">₹{item.totalPrice}</td>
                        <td>
                          {getBookingStatusBadge(item.status)}
                        </td>
                        <td>
                          <div className="action-buttons-group">
                            {/* PENDING -> CONFIRM or REJECT */}
                            {(item.status === "Pending" || item.status === "PENDING") && (
                              <>
                                <button
                                  className="btn-action-confirm"
                                  onClick={() => handleTransitionBookingStatus(item.id, "CONFIRM")}
                                  disabled={statusUpdating === item.id}
                                  title="Confirm & Accept this booking"
                                >
                                  <FaCheckCircle /> Accept
                                </button>
                                <button
                                  className="btn-action-reject"
                                  onClick={() => handleTransitionBookingStatus(item.id, "REJECT")}
                                  disabled={statusUpdating === item.id}
                                  title="Reject this booking"
                                >
                                  <FaTimes /> Reject
                                </button>
                              </>
                            )}

                            {/* CONFIRMED -> START */}
                            {(item.status === "Confirmed" || item.status === "CONFIRMED") && (
                              <button
                                className="btn-action-start"
                                onClick={() => handleTransitionBookingStatus(item.id, "START")}
                                disabled={statusUpdating === item.id}
                                title="Mark Job In-Progress"
                              >
                                <FaTools /> Start Work
                              </button>
                            )}

                            {/* IN_PROGRESS -> COMPLETE */}
                            {(item.status === "In_Progress" || item.status === "IN_PROGRESS") && (
                              <button
                                className="btn-action-complete"
                                onClick={() => handleTransitionBookingStatus(item.id, "COMPLETE")}
                                disabled={statusUpdating === item.id}
                                title="Mark Job Completed"
                              >
                                <FaCheckCircle /> Finish Job
                              </button>
                            )}

                            {/* COMPLETED or CANCELLED / REJECTED -> View Only */}
                            {(item.status === "Completed" || item.status === "COMPLETED" || item.status === "Cancelled" || item.status === "CANCELLED" || item.status === "Rejected" || item.status === "REJECTED") && (
                              <span className="text-muted-tag">Finalized</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            ) : activeTab === "services" ? (
              <div className="services-grid-view">
                {filterBySearch(servicesList).map((srv) => {
                  const isOffered = selectedServiceIds.includes(srv.id);
                  return (
                    <div key={srv.id} className={`service-item-card ${isOffered ? "offered" : ""}`}>
                      <div className="service-card-top">
                        <span className="category-pill">{srv.categoryName}</span>
                        <span className={`status-pill ${isOffered ? "active" : "inactive"}`}>
                          {isOffered ? "Offered by You" : "Available in Catalog"}
                        </span>
                      </div>
                      <h4>{srv.name}</h4>
                      <p className="service-desc">{srv.description || "Comprehensive service offering provided by verified FlexServ technicians."}</p>
                      <div className="service-card-footer">
                        <div className="service-price">₹{srv.price}</div>
                        <div className="service-duration">
                          <FaClock /> {srv.duration} mins
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : activeTab === "reviews" ? (
              reviewsList.length === 0 ? (
                <div className="empty-box">No customer reviews yet.</div>
              ) : (
                <div className="reviews-list-container">
                  {reviewsList.map((rev) => (
                    <div key={rev.id} className="review-card">
                      <div className="review-header">
                        <div className="reviewer-details">
                          <div className="avatar-badge">{rev.customerName?.charAt(0) || "C"}</div>
                          <div>
                            <h4>{rev.customerName || "Customer"}</h4>
                            <p className="review-date">
                              Booking #{rev.bookingId} • {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : "Verified Job"}
                            </p>
                          </div>
                        </div>
                        <div className="review-stars">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              className={i < (rev.rating || 5) ? "star-active" : "star-inactive"}
                            />
                          ))}
                          <span className="rating-number">{rev.rating}.0</span>
                        </div>
                      </div>
                      <p className="review-comment">"{rev.comment || "Service was prompt, professional and thoroughly completed."}"</p>
                    </div>
                  ))}
                </div>
              )) : (
                /* Profile & Offered Services Customization Tab */
                <div className="profile-edit-wrapper">
                  <form onSubmit={handleSaveProfile} className="profile-form">
                    <div className="profile-section-header">
                      <h3><FaUserCheck /> Provider Company Profile</h3>
                      <p>Update your public company profile details and qualifications.</p>
                    </div>

                    <div className="form-grid">
                      <div className="form-group">
                        <label>Owner / Contact Person</label>
                        <input
                          type="text"
                          name="userName"
                          value={formData.userName}
                          onChange={handleInputChange}
                          placeholder="Owner full name"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="locked-label">
                          Account Email (Read-Only) <span className="lock-badge"><FaLock /> Locked</span>
                        </label>
                        <input
                          type="email"
                          name="userEmail"
                          value={formData.userEmail}
                          disabled
                          className="input-disabled"
                          title="Email address cannot be modified"
                        />
                      </div>

                      <div className="form-group">
                        <label>Phone Number</label>
                        <input
                          type="tel"
                          name="userPhone"
                          value={formData.userPhone}
                          onChange={handleInputChange}
                          placeholder="Phone number"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Company Name</label>
                        <input
                          type="text"
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleInputChange}
                          placeholder="Company name"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Years of Experience</label>
                        <input
                          type="number"
                          name="experienceYears"
                          min="0"
                          max="60"
                          value={formData.experienceYears}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="form-group full-width">
                        <label>Company Bio / About Us</label>
                        <textarea
                          name="bio"
                          rows="3"
                          value={formData.bio}
                          onChange={handleInputChange}
                          placeholder="Describe your company services, certifications, and expertise..."
                        ></textarea>
                      </div>
                    </div>

                    {/* Offered Categories & Services with Price/Duration Editor & Custom Service Button */}
                    <div className="offered-services-head-bar">
                      <div className="profile-section-header" style={{ margin: 0 }}>
                        <h3><FaConciergeBell /> Offered Services, Pricing & Duration</h3>
                        <p>Select services to offer, fine-tune individual pricing & duration, or create brand new custom services.</p>
                      </div>

                      <button
                        type="button"
                        className="btn-create-custom-service"
                        onClick={() => setIsCreateServiceModalOpen(true)}
                      >
                        <FaPlus /> Create Custom Service
                      </button>
                    </div>

                    <div className="categories-services-selector">
                      {categoriesList.length === 0 ? (
                        <div className="no-cat-box">No platform categories available.</div>
                      ) : (
                        categoriesList.map((cat) => {
                          const catServices = servicesList.filter(
                            (s) => s.categoryId === cat.id || s.categoryName === cat.name
                          );
                          const selectedCount = catServices.filter((s) =>
                            selectedServiceIds.includes(s.id)
                          ).length;

                          return (
                            <div key={cat.id} className="category-group-card">
                              <div className="category-group-header">
                                <div className="cat-title-cluster">
                                  <FaLayerGroup className="cat-icon-symbol" />
                                  <h4>{cat.name}</h4>
                                </div>
                                <span className="cat-count-pill">
                                  {selectedCount} / {catServices.length} Offered
                                </span>
                              </div>
                              <p className="cat-desc">{cat.description || "Category services available for customization."}</p>

                              <div className="services-chip-grid">
                                {catServices.map((srv) => {
                                  const isSelected = selectedServiceIds.includes(srv.id);
                                  const edited = editingServices[srv.id];
                                  const currentPrice = edited?.price !== undefined ? edited.price : srv.price;
                                  const currentDuration = edited?.duration !== undefined ? edited.duration : srv.duration;

                                  return (
                                    <div
                                      key={srv.id}
                                      className={`service-chip-editor ${isSelected ? "selected" : ""}`}
                                    >
                                      {/* Top Row: Checkbox Selection & Service Title */}
                                      <div
                                        className="chip-main-click"
                                        onClick={() => handleToggleService(srv.id)}
                                        title="Click to toggle offering this service"
                                      >
                                        <span className="chip-icon">
                                          {isSelected ? <FaCheckSquare /> : <FaRegSquare />}
                                        </span>
                                        <div className="chip-info">
                                          <span className="chip-name">{srv.name}</span>
                                          <span className="chip-category-tag">{cat.name}</span>
                                        </div>
                                      </div>

                                      {/* Bottom Row: Editable Price & Duration Controls */}
                                      <div className="service-params-row" onClick={(e) => e.stopPropagation()}>
                                        <div className="param-field">
                                          <label><FaTag /> Price (₹)</label>
                                          <input
                                            type="number"
                                            step="0.01"
                                            min="1"
                                            value={currentPrice}
                                            onChange={(e) => handleServicePriceChange(srv.id, e.target.value)}
                                            placeholder="₹ Price"
                                            className="input-param"
                                          />
                                        </div>

                                        <div className="param-field">
                                          <label><FaHourglassHalf /> Duration (min)</label>
                                          <input
                                            type="number"
                                            step="5"
                                            min="5"
                                            value={currentDuration}
                                            onChange={(e) => handleServiceDurationChange(srv.id, e.target.value)}
                                            placeholder="Minutes"
                                            className="input-param"
                                          />
                                        </div>

                                        <button
                                          type="button"
                                          className="btn-save-single-service"
                                          onClick={(e) => handleSaveServicePricingAndDuration(srv, e)}
                                          disabled={updatingServiceId === srv.id}
                                          title="Save updated Price & Duration for this service"
                                        >
                                          {updatingServiceId === srv.id ? (
                                            "..."
                                          ) : (
                                            <>
                                              <FaCheck /> Save
                                            </>
                                          )}
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    <div className="form-actions-bar">
                      <button type="submit" className="btn-save-profile" disabled={isSaving}>
                        <FaSave /> {isSaving ? "Saving Updates..." : "Save Profile & Offered Services"}
                      </button>
                    </div>
                  </form>
                </div>
              )}
          </div>
        </main>
      </div>

      {/* Create Custom Service Modal */}
      {isCreateServiceModalOpen && (
        <div
          className="modal-overlay"
          onClick={() => setIsCreateServiceModalOpen(false)}
        >
          <div className="modal-content-service" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-bar">
              <div className="modal-header-title">
                <span className="modal-badge-tag orange"><FaPlus /> CUSTOM SERVICE</span>
                <h3>Create New Service</h3>
              </div>
              <button
                className="btn-close"
                onClick={() => setIsCreateServiceModalOpen(false)}
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleCreateCustomService} className="modal-form-body">
              <div className="form-field-group">
                <label>Select Category *</label>
                <select
                  required
                  value={customServiceForm.categoryId}
                  onChange={(e) => setCustomServiceForm({ ...customServiceForm, categoryId: e.target.value })}
                  className="input-styled"
                >
                  <option value="">-- Choose Category --</option>
                  {categoriesList.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field-group">
                <label>Service Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Deep Kitchen Degreasing & Sanitization"
                  value={customServiceForm.name}
                  onChange={(e) => setCustomServiceForm({ ...customServiceForm, name: e.target.value })}
                  className="input-styled"
                />
              </div>

              <div className="form-field-group">
                <label>Service Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe the steps, tools, and materials included in this service..."
                  value={customServiceForm.description}
                  onChange={(e) => setCustomServiceForm({ ...customServiceForm, description: e.target.value })}
                  className="input-styled textarea-styled"
                />
              </div>

              <div className="form-row-dual">
                <div className="form-field-group">
                  <label>Base Price (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    required
                    placeholder="e.g., 999.00"
                    value={customServiceForm.price}
                    onChange={(e) => setCustomServiceForm({ ...customServiceForm, price: e.target.value })}
                    className="input-styled"
                  />
                </div>

                <div className="form-field-group">
                  <label>Estimated Duration (Minutes) *</label>
                  <input
                    type="number"
                    step="5"
                    min="5"
                    required
                    placeholder="e.g., 60"
                    value={customServiceForm.duration}
                    onChange={(e) => setCustomServiceForm({ ...customServiceForm, duration: e.target.value })}
                    className="input-styled"
                  />
                </div>
              </div>

              <div className="modal-form-actions">
                <button
                  type="button"
                  className="btn-glass-secondary"
                  onClick={() => setIsCreateServiceModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary-action"
                  disabled={creatingService}
                >
                  {creatingService ? "Creating Service..." : "Create & Add to My Services"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
