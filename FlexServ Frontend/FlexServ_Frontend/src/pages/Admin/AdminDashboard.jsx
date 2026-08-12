import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import businessApi from "../../api/businessApi";
import api from "../../api/api";
import "./AdminDashboard.css";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/authSlice";
import Cookies from "js-cookie";
import {
  FaShieldAlt,
  FaSearch,
  FaUserPlus,
  FaSignOutAlt,
  FaUsers,
  FaBriefcase,
  FaConciergeBell,
  FaThList,
  FaCalendarCheck,
  FaTimes,
  FaSync,
  FaEye,
  FaFilter,
  FaPlus,
  FaTrash,
  FaUserCog,
  FaCheckCircle,
  FaExclamationTriangle,
  FaStar,
  FaCommentDots,
  FaQuoteLeft,
  FaUser
} from "react-icons/fa";

import { useToast } from "../../components/Toast/ToastContext";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();

  // Active Tab: "admins" | "users" | "providers" | "services" | "categories" | "bookings"
  const [activeTab, setActiveTab] = useState("admins");

  // Data State Lists
  const [adminsList, setAdminsList] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [providersList, setProvidersList] = useState([]);
  const [servicesList, setServicesList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [bookingsList, setBookingsList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Metrics Count State
  const [counts, setCounts] = useState({
    admins: 0,
    users: 0,
    providers: 0,
    services: 0,
    categories: 0,
    bookings: 0
  });

  // Filter & Search Controls
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("ALL");
  const [lookupId, setLookupId] = useState("");

  // Modal View States
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [recordType, setRecordType] = useState("ADMIN");
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Register Admin Modal
  const [isAddAdminModalOpen, setIsAddAdminModalOpen] = useState(false);
  const [adminForm, setAdminForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "ADMIN",
  });
  const [adminRegistering, setAdminRegistering] = useState(false);

  // Add Category Modal
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
  });
  const [categorySubmitting, setCategorySubmitting] = useState(false);

  // Delete Category Modal
  const [deleteCategoryModal, setDeleteCategoryModal] = useState({
    isOpen: false,
    category: null,
  });
  const [categoryDeleting, setCategoryDeleting] = useState(false);

  // Booking Status Updating State
  const [updatingBookingId, setUpdatingBookingId] = useState(null);

  // Provider Customer Reviews Modal State
  const [providerReviewsModal, setProviderReviewsModal] = useState({
    isOpen: false,
    provider: null,
    reviews: [],
    loading: false,
  });

  // Delete Review Confirmation Modal State
  const [deleteReviewModal, setDeleteReviewModal] = useState({
    isOpen: false,
    review: null,
    deleting: false,
  });

  // 1. GET ALL ADMINS: GET /api/admin
  const fetchAllAdmins = async () => {
    try {
      setLoading(true);
      const res = await businessApi.get("/admin");
      const list = Array.isArray(res.data?.data) ? res.data.data : [];
      setAdminsList(list);
      setCounts(prev => ({ ...prev, admins: list.length }));
    } catch (err) {
      console.error("Failed to fetch admins:", err);
    } finally {
      setLoading(false);
    }
  };

  // 2. GET ADMIN BY ID: GET /api/admin/{id}
  const fetchAdminById = async (id) => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await businessApi.get(`/admin/${id}`);
      const item = res.data?.data || res.data;
      if (item) {
        setSelectedRecord(item);
        setRecordType("ADMIN");
        setIsDetailModalOpen(true);
      }
    } catch (err) {
      toast.error("Admin not found with ID: " + id);
    } finally {
      setLoading(false);
    }
  };

  // 3. GET ALL USERS: GET /api/admin/users
  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      const res = await businessApi.get("/admin/users");
      const list = Array.isArray(res.data?.data) ? res.data.data : [];
      setUsersList(list);
      setCounts(prev => ({ ...prev, users: list.length }));
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  // 4. GET USER BY ID: GET /api/admin/users/{id}
  const fetchUserById = async (id) => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await businessApi.get(`/admin/users/${id}`);
      const item = res.data?.data || res.data;
      if (item) {
        setSelectedRecord(item);
        setRecordType("USER");
        setIsDetailModalOpen(true);
      }
    } catch (err) {
      toast.error("User not found with ID: " + id);
    } finally {
      setLoading(false);
    }
  };

  // 5. GET USERS BY ROLE: GET /api/admin/users/role/{role}
  const fetchUsersByRole = async (role) => {
    setSelectedRole(role);
    if (role === "ALL") {
      fetchAllUsers();
      return;
    }
    try {
      setLoading(true);
      const res = await businessApi.get(`/admin/users/role/${role}`);
      const list = Array.isArray(res.data?.data) ? res.data.data : [];
      setUsersList(list);
    } catch (err) {
      console.error(`Failed to fetch users for role ${role}:`, err);
    } finally {
      setLoading(false);
    }
  };

  // 6. GET ALL PROVIDERS: GET /api/admin/providers
  const fetchAllProviders = async () => {
    try {
      setLoading(true);
      const res = await businessApi.get("/admin/providers");
      const list = Array.isArray(res.data?.data) ? res.data.data : [];
      setProvidersList(list);
      setCounts(prev => ({ ...prev, providers: list.length }));
    } catch (err) {
      console.error("Failed to fetch providers:", err);
    } finally {
      setLoading(false);
    }
  };

  // 7. GET PROVIDER BY ID: GET /api/admin/providers/{id}
  const fetchProviderById = async (id) => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await businessApi.get(`/admin/providers/${id}`);
      const item = res.data?.data || res.data;
      if (item) {
        setSelectedRecord(item);
        setRecordType("PROVIDER");
        setIsDetailModalOpen(true);
      }
    } catch (err) {
      toast.error("Provider not found with ID: " + id);
    } finally {
      setLoading(false);
    }
  };

  // 8. GET ALL SERVICES: GET /api/admin/services
  const fetchAllServices = async () => {
    try {
      setLoading(true);
      const res = await businessApi.get("/admin/services");
      const list = Array.isArray(res.data?.data) ? res.data.data : [];
      setServicesList(list);
      setCounts(prev => ({ ...prev, services: list.length }));
    } catch (err) {
      console.error("Failed to fetch services:", err);
    } finally {
      setLoading(false);
    }
  };

  // 9. GET SERVICE BY ID: GET /api/admin/services/{id}
  const fetchServiceById = async (id) => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await businessApi.get(`/admin/services/${id}`);
      const item = res.data?.data || res.data;
      if (item) {
        setSelectedRecord(item);
        setRecordType("SERVICE");
        setIsDetailModalOpen(true);
      }
    } catch (err) {
      toast.error("Service not found with ID: " + id);
    } finally {
      setLoading(false);
    }
  };

  // 10. GET ALL CATEGORIES: GET /api/admin/categories
  const fetchAllCategories = async () => {
    try {
      setLoading(true);
      const res = await businessApi.get("/admin/categories");
      const list = Array.isArray(res.data?.data) ? res.data.data : [];
      setCategoriesList(list);
      setCounts(prev => ({ ...prev, categories: list.length }));
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    } finally {
      setLoading(false);
    }
  };

  // 11. GET CATEGORY BY ID: GET /api/admin/categories/{id}
  const fetchCategoryById = async (id) => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await businessApi.get(`/admin/categories/${id}`);
      const item = res.data?.data || res.data;
      if (item) {
        setSelectedRecord(item);
        setRecordType("CATEGORY");
        setIsDetailModalOpen(true);
      }
    } catch (err) {
      toast.error("Category not found with ID: " + id);
    } finally {
      setLoading(false);
    }
  };

  // CREATE CATEGORY: POST /api/admin/categories
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) {
      toast.error("Category name is required.");
      return;
    }
    try {
      setCategorySubmitting(true);
      const res = await businessApi.post("/admin/categories", categoryForm);
      toast.success(res.data?.message || "Category Created Successfully!");
      setIsAddCategoryModalOpen(false);
      setCategoryForm({ name: "", description: "" });
      fetchAllCategories();
    } catch (err) {
      console.error("Failed to create category:", err);
      toast.error(
        "Failed to create category: " + (err.response?.data?.message || err.message)
      );
    } finally {
      setCategorySubmitting(false);
    }
  };

  // DELETE CATEGORY: DELETE /api/admin/categories/{id}
  const handleDeleteCategory = async () => {
    if (!deleteCategoryModal.category) return;
    try {
      setCategoryDeleting(true);
      const id = deleteCategoryModal.category.id;
      const res = await businessApi.delete(`/admin/categories/${id}`);
      toast.success(res.data?.message || "Category Deleted Successfully!");
      setDeleteCategoryModal({ isOpen: false, category: null });
      fetchAllCategories();
    } catch (err) {
      console.error("Failed to delete category:", err);
      toast.error(
        "Failed to delete category: " + (err.response?.data?.message || err.message)
      );
    } finally {
      setCategoryDeleting(false);
    }
  };

  // 12. GET ALL BOOKINGS: GET /api/admin/bookings
  const fetchAllBookings = async () => {
    try {
      setLoading(true);
      const res = await businessApi.get("/admin/bookings");
      const list = Array.isArray(res.data?.data) ? res.data.data : [];
      setBookingsList(list);
      setCounts(prev => ({ ...prev, bookings: list.length }));
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  // 13. GET BOOKING BY ID: GET /api/admin/bookings/{id}
  const fetchBookingById = async (id) => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await businessApi.get(`/admin/bookings/${id}`);
      const item = res.data?.data || res.data;
      if (item) {
        setSelectedRecord(item);
        setRecordType("BOOKING");
        setIsDetailModalOpen(true);
      }
    } catch (err) {
      toast.error("Booking not found with ID: " + id);
    } finally {
      setLoading(false);
    }
  };

  // 14. ADMIN UPDATE BOOKING STATUS: PUT /api/admin/bookings/{id}/status?status=...
  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    if (!bookingId || !newStatus) return;
    try {
      setUpdatingBookingId(bookingId);
      await businessApi.put(`/admin/bookings/${bookingId}/status`, null, {
        params: { status: newStatus },
      });

      toast.success(`Booking #${bookingId} status updated to ${newStatus}!`);

      // Optimistically update list
      setBookingsList(prev =>
        prev.map(b => (b.id === bookingId ? { ...b, status: newStatus } : b))
      );

      // If modal is open for this booking, update selectedRecord
      if (selectedRecord && selectedRecord.id === bookingId) {
        setSelectedRecord(prev => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      console.error("Failed to update booking status:", err);
      toast.error(
        "Failed to update booking status: " + (err.response?.data?.message || err.message)
      );
    } finally {
      setUpdatingBookingId(null);
    }
  };

  // 15. FETCH REVIEWS FOR PROVIDER: GET /api/reviews/provider/{providerId}
  const handleOpenProviderReviews = async (provider) => {
    if (!provider) return;
    try {
      setProviderReviewsModal({
        isOpen: true,
        provider,
        reviews: [],
        loading: true,
      });

      const res = await api.get(`/reviews/provider/${provider.id}`);
      const list = Array.isArray(res.data?.data) ? res.data.data : [];
      setProviderReviewsModal({
        isOpen: true,
        provider,
        reviews: list,
        loading: false,
      });
    } catch (err) {
      console.error("Failed to fetch provider reviews:", err);
      toast.error(
        "Failed to load reviews for " + (provider.companyName || provider.userName)
      );
      setProviderReviewsModal(prev => ({ ...prev, loading: false }));
    }
  };

  // 16. DELETE REVIEW: DELETE /api/reviews/{id}
  const handleDeleteReview = async () => {
    if (!deleteReviewModal.review) return;
    try {
      setDeleteReviewModal(prev => ({ ...prev, deleting: true }));
      const reviewId = deleteReviewModal.review.id;
      const res = await api.delete(`/reviews/${reviewId}`);
      toast.success(res.data?.message || "Customer Review Deleted Successfully!");

      // Remove review from modal list
      setProviderReviewsModal(prev => ({
        ...prev,
        reviews: prev.reviews.filter(r => r.id !== reviewId),
      }));

      setDeleteReviewModal({ isOpen: false, review: null, deleting: false });
      // Refresh providers list to show recalculated rating
      fetchAllProviders();
    } catch (err) {
      console.error("Failed to delete review:", err);
      toast.error(
        "Failed to delete review: " + (err.response?.data?.message || err.message)
      );
      setDeleteReviewModal(prev => ({ ...prev, deleting: false }));
    }
  };

  // Load all initial metrics counts
  useEffect(() => {
    fetchAllAdmins();
    fetchAllUsers();
    fetchAllProviders();
    fetchAllServices();
    fetchAllCategories();
    fetchAllBookings();
  }, []);

  // Sync tab switching
  useEffect(() => {
    setLookupId("");
    if (activeTab === "admins") fetchAllAdmins();
    else if (activeTab === "users") fetchAllUsers();
    else if (activeTab === "providers") fetchAllProviders();
    else if (activeTab === "services") fetchAllServices();
    else if (activeTab === "categories") fetchAllCategories();
    else if (activeTab === "bookings") fetchAllBookings();
  }, [activeTab]);

  // Handle direct ID Lookup submit
  const handleLookupSubmit = (e) => {
    e.preventDefault();
    if (!lookupId) return;

    setSearchQuery(lookupId);

    if (activeTab === "admins") fetchAdminById(lookupId);
    else if (activeTab === "users") fetchUserById(lookupId);
    else if (activeTab === "providers") fetchProviderById(lookupId);
    else if (activeTab === "services") fetchServiceById(lookupId);
    else if (activeTab === "categories") fetchCategoryById(lookupId);
    else if (activeTab === "bookings") fetchBookingById(lookupId);
  };

  // POST /api/admin/register
  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    try {
      setAdminRegistering(true);
      await businessApi.post("/admin/register", adminForm);
      toast.success("Admin Account Created Successfully!");
      setIsAddAdminModalOpen(false);
      setAdminForm({
        name: "",
        email: "",
        phone: "",
        password: "",
        role: "ADMIN",
      });
      fetchAllAdmins();
    } catch (err) {
      toast.error("Registration failed: " + (err.response?.data?.message || err.message));
    } finally {
      setAdminRegistering(false);
    }
  };

  const openViewModal = (item, type) => {
    setSelectedRecord(item);
    setRecordType(type);
    setIsDetailModalOpen(true);
  };

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

  // Quick Client Search filtering
  const filterList = (list) => {
    if (!searchQuery) return list;
    const q = searchQuery.toLowerCase();
    return list.filter((item) =>
      Object.values(item).some(
        (val) => val && val.toString().toLowerCase().includes(q)
      )
    );
  };

  // Status Badge Helper
  const getBookingStatusBadge = (status) => {
    const s = (status || "PENDING").toUpperCase();
    let badgeClass = "badge-status-pending";
    if (s === "CONFIRMED") badgeClass = "badge-status-confirmed";
    else if (s === "IN_PROGRESS") badgeClass = "badge-status-progress";
    else if (s === "COMPLETED") badgeClass = "badge-status-completed";
    else if (s === "CANCELLED") badgeClass = "badge-status-cancelled";
    else if (s === "REJECTED") badgeClass = "badge-status-rejected";

    return <span className={`booking-status-pill ${badgeClass}`}>{s}</span>;
  };

  return (
    <div className="admin-dashboard-container">
      <div className="dashboard-wrapper">
        {/* Glass Header */}
        <header className="glass-header">
          <div className="header-left">
            <div className="brand-icon-box">
              <FaShieldAlt />
            </div>
            <div className="brand-info">
              <h1>FlexServ <span>ADMIN PORTAL</span></h1>
              <p>
                <span className="status-indicator"></span>
                System Master Control & Analytics
              </p>
            </div>
          </div>

          <div className="header-right">
            <button
              className="btn-soft-delete-hub"
              onClick={() => navigate("/admin/accounts")}
              title="Dedicated Soft Delete & User Account Control Center"
            >
              <FaUserCog /> Account & Soft-Delete Hub
            </button>
            <button className="btn-primary-action" onClick={() => setIsAddAdminModalOpen(true)}>
              <FaUserPlus /> Register Admin
            </button>
            <button className="btn-glass-secondary" onClick={handleLogout}>
              <FaSignOutAlt /> Exit
            </button>
          </div>
        </header>

        {/* Metrics Grid Cards */}
        <div className="metrics-grid">
          <div className={`metric-card ${activeTab === "admins" ? "active" : ""}`} onClick={() => setActiveTab("admins")}>
            <div className="metric-icon indigo"><FaShieldAlt /></div>
            <div className="metric-data">
              <h3>{counts.admins}</h3>
              <p>Total Admins</p>
            </div>
          </div>

          <div className={`metric-card ${activeTab === "users" ? "active" : ""}`} onClick={() => setActiveTab("users")}>
            <div className="metric-icon cyan"><FaUsers /></div>
            <div className="metric-data">
              <h3>{counts.users}</h3>
              <p>Registered Users</p>
            </div>
          </div>

          <div className={`metric-card ${activeTab === "providers" ? "active" : ""}`} onClick={() => setActiveTab("providers")}>
            <div className="metric-icon purple"><FaBriefcase /></div>
            <div className="metric-data">
              <h3>{counts.providers}</h3>
              <p>Service Providers</p>
            </div>
          </div>

          <div className={`metric-card ${activeTab === "services" ? "active" : ""}`} onClick={() => setActiveTab("services")}>
            <div className="metric-icon emerald"><FaConciergeBell /></div>
            <div className="metric-data">
              <h3>{counts.services}</h3>
              <p>Active Services</p>
            </div>
          </div>

          <div className={`metric-card ${activeTab === "categories" ? "active" : ""}`} onClick={() => setActiveTab("categories")}>
            <div className="metric-icon orange"><FaThList /></div>
            <div className="metric-data">
              <h3>{counts.categories}</h3>
              <p>Categories</p>
            </div>
          </div>

          <div className={`metric-card ${activeTab === "bookings" ? "active" : ""}`} onClick={() => setActiveTab("bookings")}>
            <div className="metric-icon rose"><FaCalendarCheck /></div>
            <div className="metric-data">
              <h3>{counts.bookings}</h3>
              <p>Total Bookings</p>
            </div>
          </div>
        </div>

        {/* Main Glass Panel */}
        <main className="main-glass-panel">
          <div className="tabs-bar">
            <button className={`tab-button ${activeTab === "admins" ? "active" : ""}`} onClick={() => setActiveTab("admins")}>
              <FaShieldAlt /> Admins
            </button>
            <button className={`tab-button ${activeTab === "users" ? "active" : ""}`} onClick={() => setActiveTab("users")}>
              <FaUsers /> Users
            </button>
            <button className={`tab-button ${activeTab === "providers" ? "active" : ""}`} onClick={() => setActiveTab("providers")}>
              <FaBriefcase /> Service Providers
            </button>
            <button className={`tab-button ${activeTab === "services" ? "active" : ""}`} onClick={() => setActiveTab("services")}>
              <FaConciergeBell /> Services
            </button>
            <button className={`tab-button ${activeTab === "categories" ? "active" : ""}`} onClick={() => setActiveTab("categories")}>
              <FaThList /> Categories
            </button>
            <button className={`tab-button ${activeTab === "bookings" ? "active" : ""}`} onClick={() => setActiveTab("bookings")}>
              <FaCalendarCheck /> Bookings & Status Control
            </button>
          </div>

          {/* Search, Filter & Toolbar Bar */}
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

            <div className="filters-group">
              {/* Category creation button when in categories tab */}
              {activeTab === "categories" && (
                <button
                  className="btn-add-category"
                  onClick={() => setIsAddCategoryModalOpen(true)}
                >
                  <FaPlus /> Add New Category
                </button>
              )}

              {/* Role filter dropdown for users tab */}
              {activeTab === "users" && (
                <select
                  value={selectedRole}
                  onChange={(e) => fetchUsersByRole(e.target.value)}
                  className="select-styled"
                >
                  <option value="ALL">Filter Role: ALL</option>
                  <option value="CUSTOMER">CUSTOMERS</option>
                  <option value="PROVIDER">SERVICE_PROVIDER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              )}

              {/* Direct ID Lookup Form for GET /{id} */}
              <form onSubmit={handleLookupSubmit} className="lookup-box">
                <input
                  type="number"
                  placeholder={`Lookup ID...`}
                  value={lookupId}
                  onChange={(e) => setLookupId(e.target.value)}
                  className="input-styled"
                  style={{ width: "130px" }}
                />
                <button type="submit" className="btn-lookup">
                  <FaFilter /> Data From Id
                </button>
              </form>

              <button className="btn-action-icon" onClick={() => {
                if (activeTab === "admins") fetchAllAdmins();
                else if (activeTab === "users") fetchAllUsers();
                else if (activeTab === "providers") fetchAllProviders();
                else if (activeTab === "services") fetchAllServices();
                else if (activeTab === "categories") fetchAllCategories();
                else if (activeTab === "bookings") fetchAllBookings();
              }}>
                <FaSync /> Refresh
              </button>
            </div>
          </div>

          {/* Data Table */}
          <div className="table-scroll-container">
            {loading ? (
              <div className="loader-box">Retrieving dataset from BusinessService...</div>
            ) : (
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Entity Details</th>
                    <th>Sub Information</th>
                    <th>Role / Status</th>
                    <th>Actions & Status Management</th>
                  </tr>
                </thead>
                <tbody>
                  {activeTab === "admins" && filterList(adminsList).map((item) => (
                    <tr key={item.id}>
                      <td className="row-id">#{item.id}</td>
                      <td>
                        <div className="user-identity">
                          <div className="avatar-badge">{item.name?.charAt(0)}</div>
                          <div className="name-email">
                            <h4>{item.name}</h4>
                            <p>{item.email}</p>
                          </div>
                        </div>
                      </td>
                      <td>{item.phone} ({item.department || "System Admin"})</td>
                      <td>
                        <span className="badge-role-tag admin">{item.role}</span>
                      </td>
                      <td>
                        <button className="btn-action-icon" onClick={() => openViewModal(item, "ADMIN")}>
                          <FaEye /> View Details
                        </button>
                      </td>
                    </tr>
                  ))}

                  {activeTab === "users" && filterList(usersList).map((item) => (
                    <tr key={item.id}>
                      <td className="row-id">#{item.id}</td>
                      <td>
                        <div className="user-identity">
                          <div className="avatar-badge">{item.name?.charAt(0)}</div>
                          <div className="name-email">
                            <h4>{item.name}</h4>
                            <p>{item.email}</p>
                          </div>
                        </div>
                      </td>
                      <td>{item.phone}</td>
                      <td>
                        <span className={`badge-role-tag ${item.role?.toLowerCase()}`}>{item.role}</span>
                      </td>
                      <td>
                        <div className="actions-cluster">
                          <button className="btn-action-icon" onClick={() => openViewModal(item, "USER")}>
                            <FaEye /> View Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {activeTab === "providers" && filterList(providersList).map((item) => (
                    <tr key={item.id}>
                      <td className="row-id">#{item.id}</td>
                      <td>
                        <div className="user-identity">
                          <div className="avatar-badge">{item.companyName?.charAt(0)}</div>
                          <div className="name-email">
                            <h4>{item.companyName}</h4>
                            <p>Provider: {item.userName}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="provider-sub-info">
                          <span>{item.userEmail}</span>
                          <span>{item.experienceYears} Yrs Exp • Rating: <strong style={{ color: "#f59e0b" }}>⭐ {item.rating || "5.0"}</strong></span>
                        </div>
                      </td>
                      <td>
                        <span className="badge-role-tag provider">PROVIDER</span>
                      </td>
                      <td>
                        <div className="actions-cluster">
                          <button
                            className="btn-action-icon"
                            onClick={() => openViewModal(item, "PROVIDER")}
                            title="View Provider Details"
                          >
                            <FaEye /> View Details
                          </button>

                          {/* New Reviews button to view and delete customer reviews */}
                          <button
                            className="btn-action-reviews"
                            onClick={() => handleOpenProviderReviews(item)}
                            title="View and delete customer reviews given to this provider"
                          >
                            <FaStar /> Reviews
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {activeTab === "services" && filterList(servicesList).map((item) => (
                    <tr key={item.id}>
                      <td className="row-id">#{item.id}</td>
                      <td>
                        <div className="name-email">
                          <h4>{item.name}</h4>
                          <p>{item.description || "Service item"}</p>
                        </div>
                      </td>
                      <td>Category: {item.categoryName}</td>
                      <td>
                        <span style={{ color: "var(--brand-emerald, #10b981)", fontWeight: "700" }}>₹{item.price}</span>
                      </td>
                      <td>
                        <button className="btn-action-icon" onClick={() => openViewModal(item, "SERVICE")}>
                          <FaEye /> View Details
                        </button>
                      </td>
                    </tr>
                  ))}

                  {/* Categories Tab with Create & Delete Support */}
                  {activeTab === "categories" && filterList(categoriesList).map((item) => (
                    <tr key={item.id}>
                      <td className="row-id">#{item.id}</td>
                      <td>
                        <div className="name-email">
                          <h4 style={{ color: "white", display: "flex", alignItems: "center", gap: "8px" }}>
                            <FaThList style={{ color: "#ff7a00" }} /> {item.name}
                          </h4>
                        </div>
                      </td>
                      <td>{item.description || "System Service Category"}</td>
                      <td><span className="badge-role-tag admin">CATEGORY</span></td>
                      <td>
                        <div className="actions-cluster">
                          <button className="btn-action-icon" onClick={() => openViewModal(item, "CATEGORY")}>
                            <FaEye /> View
                          </button>
                          <button
                            className="btn-delete-category"
                            onClick={() => setDeleteCategoryModal({ isOpen: true, category: item })}
                            title="Delete Category"
                          >
                            <FaTrash /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {/* Bookings Tab with Admin Status Change Privileges */}
                  {activeTab === "bookings" && filterList(bookingsList).map((item) => (
                    <tr key={item.id}>
                      <td className="row-id">#{item.id}</td>
                      <td>
                        <div className="name-email">
                          <h4>Customer: {item.customerName || `User #${item.customerId}`}</h4>
                          <p>Provider: {item.providerCompanyName || `Provider #${item.providerId}`}</p>
                        </div>
                      </td>
                      <td>
                        <div className="booking-service-info">
                          <strong>{item.serviceName}</strong>
                          <p>Date: {item.bookingDate || "N/A"} {item.bookingTime ? `• ${item.bookingTime}` : ""}</p>
                          <span className="price-tag-booking">₹{item.totalPrice}</span>
                        </div>
                      </td>
                      <td>
                        {getBookingStatusBadge(item.status)}
                      </td>
                      <td>
                        <div className="booking-action-controls">
                          {/* Interactive Status Selector Dropdown */}
                          <div className="status-selector-wrapper">
                            <select
                              value={item.status || "CONFIRMED"}
                              onChange={(e) => handleUpdateBookingStatus(item.id, e.target.value)}
                              className="select-booking-status"
                              disabled={updatingBookingId === item.id}
                              title="Admin privilege: change status"
                            >
                              <option value="PENDING">PENDING</option>
                              <option value="CONFIRMED">CONFIRMED</option>
                              <option value="IN_PROGRESS">IN_PROGRESS</option>
                              <option value="COMPLETED">COMPLETED</option>
                              <option value="CANCELLED">CANCELLED</option>
                              <option value="REJECTED">REJECTED</option>
                            </select>
                          </div>

                          <button className="btn-action-icon" onClick={() => openViewModal(item, "BOOKING")}>
                            <FaEye /> Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>

      {/* Record GET Detail Modal */}
      {isDetailModalOpen && selectedRecord && (
        <div className="modal-overlay" onClick={() => setIsDetailModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-bar">
              <div className="modal-header-title">
                <span className="modal-badge-tag">{recordType}</span>
                <h3>View Detailed Information</h3>
              </div>
              <button className="btn-close" onClick={() => setIsDetailModalOpen(false)}>
                <FaTimes />
              </button>
            </div>

            <div className="details-grid">
              <div className="detail-row"><label>Record ID</label><span>#{selectedRecord.id}</span></div>

              {recordType === "ADMIN" && (
                <>
                  <div className="detail-row"><label>Full Name</label><span>{selectedRecord.name}</span></div>
                  <div className="detail-row"><label>Email Address</label><span>{selectedRecord.email}</span></div>
                  <div className="detail-row"><label>Phone Number</label><span>{selectedRecord.phone}</span></div>
                  <div className="detail-row"><label>Department</label><span>{selectedRecord.department || "System Admin"}</span></div>
                  <div className="detail-row"><label>System Role</label><span>{selectedRecord.role}</span></div>
                </>
              )}

              {recordType === "USER" && (
                <>
                  <div className="detail-row"><label>Full Name</label><span>{selectedRecord.name}</span></div>
                  <div className="detail-row"><label>Email Address</label><span>{selectedRecord.email}</span></div>
                  <div className="detail-row"><label>Phone Number</label><span>{selectedRecord.phone}</span></div>
                  <div className="detail-row"><label>Assigned Role</label><span>{selectedRecord.role}</span></div>
                  <div className="detail-row"><label>Active Status</label><span>{selectedRecord.active !== false ? "ACTIVE" : "INACTIVE / SOFT-DELETED"}</span></div>
                </>
              )}

              {recordType === "PROVIDER" && (
                <>
                  <div className="detail-row"><label>Company Name</label><span>{selectedRecord.companyName}</span></div>
                  <div className="detail-row"><label>Owner Name</label><span>{selectedRecord.userName}</span></div>
                  <div className="detail-row"><label>Owner Email</label><span>{selectedRecord.userEmail}</span></div>
                  <div className="detail-row"><label>Experience</label><span>{selectedRecord.experienceYears} Years</span></div>
                  <div className="detail-row"><label>Rating</label><span>{selectedRecord.rating || "5.0"}</span></div>
                  <div className="detail-row"><label>Bio</label><span>{selectedRecord.bio || "N/A"}</span></div>
                  <div className="detail-row"><label>Availability</label><span>{selectedRecord.companyAvailable !== false ? "AVAILABLE" : "UNAVAILABLE"}</span></div>
                </>
              )}

              {recordType === "SERVICE" && (
                <>
                  <div className="detail-row"><label>Service Title</label><span>{selectedRecord.name}</span></div>
                  <div className="detail-row"><label>Category</label><span>{selectedRecord.categoryName}</span></div>
                  <div className="detail-row"><label>Price (₹)</label><span>₹{selectedRecord.price}</span></div>
                  <div className="detail-row"><label>Duration</label><span>{selectedRecord.duration} mins</span></div>
                </>
              )}

              {recordType === "CATEGORY" && (
                <>
                  <div className="detail-row"><label>Category Title</label><span>{selectedRecord.name}</span></div>
                  <div className="detail-row"><label>Description</label><span>{selectedRecord.description || "N/A"}</span></div>
                </>
              )}

              {recordType === "BOOKING" && (
                <>
                  <div className="detail-row"><label>Customer Name</label><span>{selectedRecord.customerName}</span></div>
                  <div className="detail-row"><label>Provider Company</label><span>{selectedRecord.providerCompanyName}</span></div>
                  <div className="detail-row"><label>Service Name</label><span>{selectedRecord.serviceName}</span></div>
                  <div className="detail-row"><label>Booking Date</label><span>{selectedRecord.bookingDate}</span></div>
                  <div className="detail-row"><label>Total Price</label><span>₹{selectedRecord.totalPrice}</span></div>
                  <div className="detail-row"><label>Current Status</label><span>{getBookingStatusBadge(selectedRecord.status)}</span></div>

                  {/* Admin Status Override in Modal */}
                  <div className="modal-status-override-box">
                    <label>Admin Status Override:</label>
                    <div className="status-buttons-row">
                      {["PENDING", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED", "REJECTED"].map((st) => (
                        <button
                          key={st}
                          className={`btn-status-pill ${selectedRecord.status === st ? "active-st" : ""}`}
                          onClick={() => handleUpdateBookingStatus(selectedRecord.id, st)}
                          disabled={updatingBookingId === selectedRecord.id}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Provider Customer Reviews Modal */}
      {providerReviewsModal.isOpen && providerReviewsModal.provider && (
        <div className="modal-overlay" onClick={() => setProviderReviewsModal({ ...providerReviewsModal, isOpen: false })}>
          <div className="modal-reviews-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-bar">
              <div className="modal-header-title">
                <span className="modal-badge-tag gold"><FaStar /> REVIEWS</span>
                <h3>
                  Reviews for {providerReviewsModal.provider.companyName || providerReviewsModal.provider.userName}
                </h3>
              </div>
              <button
                className="btn-close"
                onClick={() => setProviderReviewsModal({ ...providerReviewsModal, isOpen: false })}
              >
                <FaTimes />
              </button>
            </div>

            <div className="reviews-summary-banner">
              <div className="summary-rating-box">
                <div className="rating-large-num">⭐ {providerReviewsModal.provider.rating || "5.0"}</div>
                <div className="rating-stars-label">
                  <strong>Average Rating</strong>
                  <p>{providerReviewsModal.reviews.length} Customer Feedback{providerReviewsModal.reviews.length === 1 ? "" : "s"}</p>
                </div>
              </div>
              <div className="provider-company-tag">
                <span>Provider ID: #{providerReviewsModal.provider.id}</span>
              </div>
            </div>

            {providerReviewsModal.loading ? (
              <div className="reviews-loader">
                <div className="spinner-glow"></div>
                <p>Loading customer reviews...</p>
              </div>
            ) : providerReviewsModal.reviews.length === 0 ? (
              <div className="empty-reviews-state">
                <FaCommentDots />
                <h4>No Customer Reviews Found</h4>
                <p>There are no reviews submitted for this service provider yet.</p>
              </div>
            ) : (
              <div className="reviews-scroll-list">
                {providerReviewsModal.reviews.map((rev) => (
                  <div key={rev.id} className="review-card-item">
                    <div className="review-card-header">
                      <div className="reviewer-info">
                        <div className="reviewer-avatar">
                          <FaUser />
                        </div>
                        <div>
                          <h5>{rev.customerName || `Customer #${rev.customerId}`}</h5>
                          <span className="review-date-text">
                            Booking #{rev.bookingId} • {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : "Verified Customer"}
                          </span>
                        </div>
                      </div>

                      <div className="review-rating-stars">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={i < (rev.rating || 5) ? "star-filled" : "star-empty"}
                          />
                        ))}
                        <span className="rating-num-badge">{rev.rating}.0</span>
                      </div>
                    </div>

                    <div className="review-comment-body">
                      <FaQuoteLeft className="quote-icon" />
                      <p>{rev.comment || "Customer did not provide written feedback."}</p>
                    </div>

                    <div className="review-card-footer">
                      <span className="review-id-label">Review ID: #{rev.id}</span>
                      <button
                        className="btn-delete-review"
                        onClick={() => setDeleteReviewModal({ isOpen: true, review: rev, deleting: false })}
                        title="Delete this customer review"
                      >
                        <FaTrash /> Delete Review
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Review Confirmation Modal */}
      {deleteReviewModal.isOpen && deleteReviewModal.review && (
        <div className="modal-overlay" onClick={() => setDeleteReviewModal({ isOpen: false, review: null, deleting: false })}>
          <div className="modal-confirm-box" onClick={(e) => e.stopPropagation()}>
            <div className="delete-warning-icon">
              <FaTrash />
            </div>

            <h3>Delete Customer Review?</h3>
            <p className="delete-warning-text">
              Are you sure you want to permanently delete Review #{deleteReviewModal.review.id} given by{" "}
              <strong>{deleteReviewModal.review.customerName || "Customer"}</strong>?
              This will automatically recalculate the provider's average star rating.
            </p>

            <div className="confirm-buttons-row">
              <button
                className="btn-cancel-modal"
                onClick={() => setDeleteReviewModal({ isOpen: false, review: null, deleting: false })}
                disabled={deleteReviewModal.deleting}
              >
                Cancel
              </button>
              <button
                className="btn-confirm-delete-cat"
                onClick={handleDeleteReview}
                disabled={deleteReviewModal.deleting}
              >
                {deleteReviewModal.deleting ? "Deleting..." : "Yes, Delete Review"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Register Admin Modal */}
      {isAddAdminModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddAdminModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-bar">
              <h3>Register New Admin</h3>
              <button className="btn-close" onClick={() => setIsAddAdminModalOpen(false)}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleCreateAdmin} className="modal-form-body">
              <div className="form-field-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={adminForm.name}
                  onChange={(e) => setAdminForm({ ...adminForm, name: e.target.value })}
                  className="input-styled"
                />
              </div>

              <div className="form-field-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="admin@flexserv.com"
                  value={adminForm.email}
                  onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                  className="input-styled"
                />
              </div>

              <div className="form-field-group">
                <label>Phone Number *</label>
                <input
                  type="text"
                  required
                  placeholder="9876543210"
                  value={adminForm.phone}
                  onChange={(e) => setAdminForm({ ...adminForm, phone: e.target.value })}
                  className="input-styled"
                />
              </div>

              <div className="form-field-group">
                <label>Password *</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={adminForm.password}
                  onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                  className="input-styled"
                />
              </div>

              <button type="submit" className="btn-primary-action" style={{ justifyContent: "center", marginTop: "10px" }} disabled={adminRegistering}>
                {adminRegistering ? "Registering..." : "Submit Admin Account"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {isAddCategoryModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddCategoryModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-bar">
              <div className="modal-header-title">
                <span className="modal-badge-tag orange">NEW</span>
                <h3>Add New Service Category</h3>
              </div>
              <button className="btn-close" onClick={() => setIsAddCategoryModalOpen(false)}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="modal-form-body">
              <div className="form-field-group">
                <label>Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Home Automation, Sanitization, Gardening"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  className="input-styled"
                />
              </div>

              <div className="form-field-group">
                <label>Description (Optional)</label>
                <textarea
                  rows={3}
                  placeholder="Describe the services included under this category..."
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  className="input-styled textarea-styled"
                />
              </div>

              <div className="modal-form-actions">
                <button
                  type="button"
                  className="btn-glass-secondary"
                  onClick={() => setIsAddCategoryModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary-action"
                  disabled={categorySubmitting}
                >
                  {categorySubmitting ? "Creating Category..." : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Category Confirmation Modal */}
      {deleteCategoryModal.isOpen && deleteCategoryModal.category && (
        <div className="modal-overlay" onClick={() => setDeleteCategoryModal({ isOpen: false, category: null })}>
          <div className="modal-confirm-box" onClick={(e) => e.stopPropagation()}>
            <div className="delete-warning-icon">
              <FaExclamationTriangle />
            </div>

            <h3>Delete Category "{deleteCategoryModal.category.name}"?</h3>
            <p className="delete-warning-text">
              Are you sure you want to permanently delete this category (ID #{deleteCategoryModal.category.id})? Any attached services will also be cleaned up.
            </p>

            <div className="confirm-buttons-row">
              <button
                className="btn-cancel-modal"
                onClick={() => setDeleteCategoryModal({ isOpen: false, category: null })}
                disabled={categoryDeleting}
              >
                Cancel
              </button>
              <button
                className="btn-confirm-delete-cat"
                onClick={handleDeleteCategory}
                disabled={categoryDeleting}
              >
                {categoryDeleting ? "Deleting..." : "Yes, Delete Category"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
