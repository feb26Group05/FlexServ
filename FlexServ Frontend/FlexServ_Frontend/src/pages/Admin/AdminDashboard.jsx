import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import "./AdminDashboard.css";
import {
  FaShieldAlt,
  FaSearch,
  FaUserCog,
  FaSync,
  FaEye,
  FaTimes,
  FaUserPlus,
  FaSignOutAlt,
  FaBuilding,
  FaUserCheck,
  FaUsers,
  FaBriefcase,
  FaConciergeBell,
  FaThList,
  FaCalendarCheck,
  FaFilter
} from "react-icons/fa";

export default function AdminDashboard() {
  const navigate = useNavigate();

  // Active Directory Tab: "admins" | "users" | "providers" | "services" | "categories" | "bookings"
  const [activeTab, setActiveTab] = useState("admins");

  // Data lists
  const [adminsList, setAdminsList] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [providersList, setProvidersList] = useState([]);
  const [servicesList, setServicesList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [bookingsList, setBookingsList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("ALL");
  const [lookupId, setLookupId] = useState("");

  // Modal detail view state
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [recordType, setRecordType] = useState("ADMIN");
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Add Admin Modal state
  const [isAddAdminModalOpen, setIsAddAdminModalOpen] = useState(false);
  const [adminForm, setAdminForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    department: "System Administration",
  });
  const [adminRegistering, setAdminRegistering] = useState(false);

  // Fetch Methods for All GET Endpoints
  const fetchAllAdmins = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin");
      const list = Array.isArray(res.data?.data) ? res.data.data : (Array.isArray(res.data) ? res.data : []);
      setAdminsList(list);
    } catch (err) {
      console.error("Failed to fetch admins:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/users");
      const list = Array.isArray(res.data?.data) ? res.data.data : (Array.isArray(res.data) ? res.data : []);
      setUsersList(list);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsersByRole = async (role) => {
    setSelectedRole(role);
    if (role === "ALL") {
      fetchAllUsers();
      return;
    }
    try {
      setLoading(true);
      const res = await api.get(`/admin/users/role/${role}`);
      const list = Array.isArray(res.data?.data) ? res.data.data : (Array.isArray(res.data) ? res.data : []);
      setUsersList(list);
    } catch (err) {
      console.error(`Failed to fetch users for role ${role}:`, err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllProviders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/providers");
      const list = Array.isArray(res.data?.data) ? res.data.data : (Array.isArray(res.data) ? res.data : []);
      setProvidersList(list);
    } catch (err) {
      console.error("Failed to fetch service providers:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllServices = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/services");
      const list = Array.isArray(res.data?.data) ? res.data.data : (Array.isArray(res.data) ? res.data : []);
      setServicesList(list);
    } catch (err) {
      console.error("Failed to fetch services:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/categories");
      const list = Array.isArray(res.data?.data) ? res.data.data : (Array.isArray(res.data) ? res.data : []);
      setCategoriesList(list);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/bookings");
      const list = Array.isArray(res.data?.data) ? res.data.data : (Array.isArray(res.data) ? res.data : []);
      setBookingsList(list);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
    } finally {
      setLoading(false);
    }
  };


  const fetchAllData = () => {
    fetchAllAdmins();
    fetchAllUsers();
    fetchAllProviders();
    fetchAllServices();
    fetchAllCategories();
    fetchAllBookings();
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Lookup By ID Handlers
  const handleLookupSubmit = async (e) => {
    e.preventDefault();
    if (!lookupId.trim()) return;
    const id = lookupId.trim();

    try {
      setLoading(true);
      let endpoint = `/admin/${id}`;
      let type = "ADMIN";

      if (activeTab === "users") {
        endpoint = `/admin/users/${id}`;
        type = "USER";
      } else if (activeTab === "providers") {
        endpoint = `/admin/providers/${id}`;
        type = "PROVIDER";
      } else if (activeTab === "services") {
        endpoint = `/admin/services/${id}`;
        type = "SERVICE";
      } else if (activeTab === "categories") {
        endpoint = `/admin/categories/${id}`;
        type = "CATEGORY";
      } else if (activeTab === "bookings") {
        endpoint = `/admin/bookings/${id}`;
        type = "BOOKING";
      }

      const res = await api.get(endpoint);
      if (res.data && res.data.data) {
        setSelectedRecord(res.data.data);
        setRecordType(type);
        setIsDetailModalOpen(true);
      }
    } catch (err) {
      alert(err.response?.data?.message || `Record with ID ${id} not found.`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    if (!adminForm.name || !adminForm.email || !adminForm.phone || !adminForm.password) {
      alert("Please fill in all required admin fields.");
      return;
    }

    try {
      setAdminRegistering(true);
      const res = await api.post("/admin/register", adminForm);
      alert(res.data.message || "Admin registered successfully!");
      setIsAddAdminModalOpen(false);
      setAdminForm({
        name: "",
        email: "",
        phone: "",
        password: "",
        department: "System Administration",
      });
      fetchAllAdmins();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to register admin.");
    } finally {
      setAdminRegistering(false);
    }
  };

  const handleOpenDetailModal = (item, type) => {
    setSelectedRecord(item);
    setRecordType(type);
    setIsDetailModalOpen(true);
  };

  // Filter Items by Query
  const query = searchQuery.toLowerCase();
  const filteredAdmins = adminsList.filter((a) => a.name?.toLowerCase().includes(query) || a.email?.toLowerCase().includes(query) || a.phone?.toLowerCase().includes(query) || a.id?.toString().includes(query));
  const filteredUsers = usersList.filter((u) => u.name?.toLowerCase().includes(query) || u.email?.toLowerCase().includes(query) || u.phone?.toLowerCase().includes(query) || u.id?.toString().includes(query));
  const filteredProviders = providersList.filter((p) => p.companyName?.toLowerCase().includes(query) || p.userName?.toLowerCase().includes(query) || p.userEmail?.toLowerCase().includes(query) || p.id?.toString().includes(query));
  const filteredServices = servicesList.filter((s) => s.name?.toLowerCase().includes(query) || s.categoryName?.toLowerCase().includes(query) || s.id?.toString().includes(query));
  const filteredCategories = categoriesList.filter((c) => c.name?.toLowerCase().includes(query) || c.id?.toString().includes(query));
  const filteredBookings = bookingsList.filter((b) => b.customerName?.toLowerCase().includes(query) || b.providerCompanyName?.toLowerCase().includes(query) || b.serviceName?.toLowerCase().includes(query) || b.status?.toLowerCase().includes(query) || b.id?.toString().includes(query));

  return (
    <div className="admin-container">
      <div className="admin-overlay">
        {/* Top Header Navbar */}
        <header className="admin-header">
          <div className="admin-brand">
            <div className="brand-icon-box">
              <FaShieldAlt />
            </div>
            <div>
              <h1>FlexServ</h1>
              <span>ADMIN SYSTEM MODULE</span>
            </div>
          </div>

          <div className="header-actions">
            <button className="primary-add-btn" onClick={() => setIsAddAdminModalOpen(true)}>
              <FaUserPlus /> Register Admin
            </button>
            <button className="refresh-btn" onClick={fetchAllData}>
              <FaSync /> Refresh All
            </button>
            <button className="logout-btn" onClick={() => navigate("/")}>
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </header>

        {/* Welcome Banner */}
        <div className="welcome-banner">
          <div className="welcome-text">
            <h2>System Administration Portal 👋</h2>
            <p>Full GET access across Admins, Users, Service Providers, Services, Categories, and Bookings.</p>
          </div>
          <div className="system-status-chip">
            <span className="live-indicator"></span>
            All Endpoints Active
          </div>
        </div>

        {/* Stats Overview Grid */}
        <div className="stats-grid">
          <div className="stat-card" onClick={() => setActiveTab("admins")} style={{ cursor: "pointer" }}>
            <div className="stat-info">
              <p>Admins</p>
              <h2>{adminsList.length}</h2>
            </div>
            <div className="stat-icon-wrapper">
              <FaUserCog />
            </div>
          </div>

          <div className="stat-card blue" onClick={() => setActiveTab("users")} style={{ cursor: "pointer" }}>
            <div className="stat-info">
              <p>Total Users</p>
              <h2>{usersList.length}</h2>
            </div>
            <div className="stat-icon-wrapper">
              <FaUsers />
            </div>
          </div>

          <div className="stat-card green" onClick={() => setActiveTab("providers")} style={{ cursor: "pointer" }}>
            <div className="stat-info">
              <p>Providers</p>
              <h2>{providersList.length}</h2>
            </div>
            <div className="stat-icon-wrapper">
              <FaBriefcase />
            </div>
          </div>

          <div className="stat-card purple" onClick={() => setActiveTab("services")} style={{ cursor: "pointer" }}>
            <div className="stat-info">
              <p>Services</p>
              <h2>{servicesList.length}</h2>
            </div>
            <div className="stat-icon-wrapper">
              <FaConciergeBell />
            </div>
          </div>

          <div className="stat-card" onClick={() => setActiveTab("categories")} style={{ cursor: "pointer" }}>
            <div className="stat-info">
              <p>Categories</p>
              <h2>{categoriesList.length}</h2>
            </div>
            <div className="stat-icon-wrapper">
              <FaThList />
            </div>
          </div>

          <div className="stat-card green" onClick={() => setActiveTab("bookings")} style={{ cursor: "pointer" }}>
            <div className="stat-info">
              <p>Bookings</p>
              <h2>{bookingsList.length}</h2>
            </div>
            <div className="stat-icon-wrapper">
              <FaCalendarCheck />
            </div>
          </div>
        </div>

        {/* Main Content Panel */}
        <div className="content-panel">
          {/* Directory Tabs */}
          <div className="controls-bar">
            <div className="controls-top-row">
              <div className="tabs-container" style={{ flexWrap: "wrap" }}>
                <button className={`tab-btn ${activeTab === "admins" ? "active" : ""}`} onClick={() => setActiveTab("admins")}>
                  <FaShieldAlt /> Admins ({filteredAdmins.length})
                </button>
                <button className={`tab-btn ${activeTab === "users" ? "active" : ""}`} onClick={() => setActiveTab("users")}>
                  <FaUsers /> Users ({filteredUsers.length})
                </button>
                <button className={`tab-btn ${activeTab === "providers" ? "active" : ""}`} onClick={() => setActiveTab("providers")}>
                  <FaBriefcase /> Providers ({filteredProviders.length})
                </button>
                <button className={`tab-btn ${activeTab === "services" ? "active" : ""}`} onClick={() => setActiveTab("services")}>
                  <FaConciergeBell /> Services ({filteredServices.length})
                </button>
                <button className={`tab-btn ${activeTab === "categories" ? "active" : ""}`} onClick={() => setActiveTab("categories")}>
                  <FaThList /> Categories ({filteredCategories.length})
                </button>
                <button className={`tab-btn ${activeTab === "bookings" ? "active" : ""}`} onClick={() => setActiveTab("bookings")}>
                  <FaCalendarCheck /> Bookings ({filteredBookings.length})
                </button>
              </div>

              {/* Role Pills for Users */}
              {activeTab === "users" && (
                <div className="filter-pills-bar">
                  <span className="filter-pill-label" style={{ fontSize: "13px", color: "#94a3b8" }}>
                    <FaFilter /> Role:
                  </span>
                  <button className={`filter-pill ${selectedRole === "ALL" ? "active" : ""}`} onClick={() => fetchUsersByRole("ALL")}>All</button>
                  <button className={`filter-pill ${selectedRole === "CUSTOMER" ? "active" : ""}`} onClick={() => fetchUsersByRole("CUSTOMER")}>Customer</button>
                  <button className={`filter-pill ${selectedRole === "SERVICE_PROVIDER" ? "active" : ""}`} onClick={() => fetchUsersByRole("SERVICE_PROVIDER")}>Provider</button>
                  <button className={`filter-pill ${selectedRole === "ADMIN" ? "active" : ""}`} onClick={() => fetchUsersByRole("ADMIN")}>Admin</button>
                </div>
              )}
            </div>

            {/* Search & ID Lookup Bar */}
            <div className="search-row">
              <div className="search-input-group">
                <FaSearch />
                <input
                  type="text"
                  placeholder={`Search in ${activeTab}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <form onSubmit={handleLookupSubmit} className="lookup-form">
                <input
                  type="number"
                  placeholder={`Enter ${activeTab.slice(0, -1)} ID...`}
                  value={lookupId}
                  onChange={(e) => setLookupId(e.target.value)}
                  className="lookup-input"
                />
                <button type="submit" className="lookup-btn">
                  Get By ID
                </button>
              </form>
            </div>
          </div>

          {/* Directory Data Tables */}
          <div className="table-wrapper">
            {loading ? (
              <div className="empty-state">Loading records from backend...</div>
            ) : activeTab === "admins" ? (
              filteredAdmins.length === 0 ? (
                <div className="empty-state">No admin records found.</div>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Admin Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Department</th>
                      <th>Role</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAdmins.map((admin) => (
                      <tr key={admin.id}>
                        <td>#{admin.id}</td>
                        <td>
                          <div className="user-cell">
                            <div className="user-avatar admin-avatar">{admin.name ? admin.name.charAt(0).toUpperCase() : "A"}</div>
                            <div className="user-name-box">
                              <span>{admin.name}</span>
                              <small>{admin.department || "System Administration"}</small>
                            </div>
                          </div>
                        </td>
                        <td>{admin.email}</td>
                        <td>{admin.phone}</td>
                        <td>{admin.department || "System Administration"}</td>
                        <td>
                          <span className="badge-role admin"><span className="badge-dot"></span>{admin.role}</span>
                        </td>
                        <td>
                          <button className="action-btn" onClick={() => handleOpenDetailModal(admin, "ADMIN")}>
                            <FaEye /> View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            ) : activeTab === "users" ? (
              filteredUsers.length === 0 ? (
                <div className="empty-state">No user records found.</div>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>User Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Role</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id}>
                        <td>#{user.id}</td>
                        <td>
                          <div className="user-cell">
                            <div className="user-avatar">{user.name ? user.name.charAt(0).toUpperCase() : "U"}</div>
                            <div className="user-name-box">
                              <span>{user.name}</span>
                              <small>{user.email}</small>
                            </div>
                          </div>
                        </td>
                        <td>{user.email}</td>
                        <td>{user.phone}</td>
                        <td>
                          <span className={`badge-role ${user.role ? user.role.toLowerCase() : "customer"}`}>
                            <span className="badge-dot"></span>{user.role}
                          </span>
                        </td>
                        <td>
                          <button className="action-btn" onClick={() => handleOpenDetailModal(user, "USER")}>
                            <FaEye /> View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            ) : activeTab === "providers" ? (
              filteredProviders.length === 0 ? (
                <div className="empty-state">No service provider records found.</div>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Company Name</th>
                      <th>Provider Name</th>
                      <th>Email</th>
                      <th>Experience</th>
                      <th>Verified</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProviders.map((provider) => (
                      <tr key={provider.id}>
                        <td>#{provider.id}</td>
                        <td>
                          <div className="user-cell">
                            <div className="user-avatar">{provider.companyName ? provider.companyName.charAt(0).toUpperCase() : "P"}</div>
                            <div className="user-name-box">
                              <span>{provider.companyName || "N/A"}</span>
                              <small>Rating: {provider.rating || "5.0"}</small>
                            </div>
                          </div>
                        </td>
                        <td>{provider.userName || "N/A"}</td>
                        <td>{provider.userEmail || "N/A"}</td>
                        <td>{provider.experienceYears || 0} Years</td>
                        <td>
                          <span className={`badge-role ${provider.isVerified ? "admin" : "customer"}`}>
                            <span className="badge-dot"></span>{provider.isVerified ? "VERIFIED" : "PENDING"}
                          </span>
                        </td>
                        <td>
                          <button className="action-btn" onClick={() => handleOpenDetailModal(provider, "PROVIDER")}>
                            <FaEye /> View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            ) : activeTab === "services" ? (
              filteredServices.length === 0 ? (
                <div className="empty-state">No service records found.</div>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Service Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Duration</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredServices.map((service) => (
                      <tr key={service.id}>
                        <td>#{service.id}</td>
                        <td>
                          <div className="user-cell">
                            <div className="user-avatar">{service.name ? service.name.charAt(0).toUpperCase() : "S"}</div>
                            <div className="user-name-box">
                              <span>{service.name}</span>
                              <small>{service.description ? service.description.substring(0, 30) + "..." : "N/A"}</small>
                            </div>
                          </div>
                        </td>
                        <td>{service.categoryName || "N/A"}</td>
                        <td>${service.price}</td>
                        <td>{service.duration} mins</td>
                        <td>
                          <button className="action-btn" onClick={() => handleOpenDetailModal(service, "SERVICE")}>
                            <FaEye /> View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            ) : activeTab === "categories" ? (
              filteredCategories.length === 0 ? (
                <div className="empty-state">No category records found.</div>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Category Name</th>
                      <th>Description</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCategories.map((category) => (
                      <tr key={category.id}>
                        <td>#{category.id}</td>
                        <td>
                          <div className="user-cell">
                            <div className="user-avatar">{category.name ? category.name.charAt(0).toUpperCase() : "C"}</div>
                            <div className="user-name-box">
                              <span>{category.name}</span>
                            </div>
                          </div>
                        </td>
                        <td>{category.description || "N/A"}</td>
                        <td>
                          <button className="action-btn" onClick={() => handleOpenDetailModal(category, "CATEGORY")}>
                            <FaEye /> View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            ) : activeTab === "bookings" ? (
              filteredBookings.length === 0 ? (
                <div className="empty-state">No booking records found.</div>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Customer</th>
                      <th>Provider Company</th>
                      <th>Service</th>
                      <th>Booking Date</th>
                      <th>Status</th>
                      <th>Price</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((booking) => (
                      <tr key={booking.id}>
                        <td>#{booking.id}</td>
                        <td>{booking.customerName || "N/A"}</td>
                        <td>{booking.providerCompanyName || "N/A"}</td>
                        <td>{booking.serviceName || "N/A"}</td>
                        <td>{booking.bookingDate || "N/A"}</td>
                        <td>
                          <span className="badge-role admin">
                            <span className="badge-dot"></span>{booking.status || "CONFIRMED"}
                          </span>
                        </td>
                        <td>${booking.totalPrice}</td>
                        <td>
                          <button className="action-btn" onClick={() => handleOpenDetailModal(booking, "BOOKING")}>
                            <FaEye /> View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            ) : null}
          </div>
        </div>
      </div>

      {/* Record Detail Modal */}
      {isDetailModalOpen && selectedRecord && (
        <div className="modal-backdrop" onClick={() => setIsDetailModalOpen(false)}>
          <div className="detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{recordType} Details</h3>
              <button className="close-modal-btn" onClick={() => setIsDetailModalOpen(false)}>
                <FaTimes />
              </button>
            </div>

            <div className="detail-list">
              <div className="detail-item">
                <label>Record ID</label>
                <span>#{selectedRecord.id}</span>
              </div>

              {recordType === "ADMIN" && (
                <>
                  <div className="detail-item"><label>Full Name</label><span>{selectedRecord.name}</span></div>
                  <div className="detail-item"><label>Email</label><span>{selectedRecord.email}</span></div>
                  <div className="detail-item"><label>Phone</label><span>{selectedRecord.phone}</span></div>
                  <div className="detail-item"><label>Department</label><span>{selectedRecord.department || "System Administration"}</span></div>
                  <div className="detail-item"><label>Role</label><span>{selectedRecord.role}</span></div>
                </>
              )}

              {recordType === "USER" && (
                <>
                  <div className="detail-item"><label>Full Name</label><span>{selectedRecord.name}</span></div>
                  <div className="detail-item"><label>Email</label><span>{selectedRecord.email}</span></div>
                  <div className="detail-item"><label>Phone</label><span>{selectedRecord.phone}</span></div>
                  <div className="detail-item"><label>Role</label><span>{selectedRecord.role}</span></div>
                </>
              )}

              {recordType === "PROVIDER" && (
                <>
                  <div className="detail-item"><label>Company Name</label><span>{selectedRecord.companyName}</span></div>
                  <div className="detail-item"><label>User Name</label><span>{selectedRecord.userName}</span></div>
                  <div className="detail-item"><label>Email</label><span>{selectedRecord.userEmail}</span></div>
                  <div className="detail-item"><label>Experience</label><span>{selectedRecord.experienceYears} Years</span></div>
                  <div className="detail-item"><label>Rating</label><span>{selectedRecord.rating || "5.0"}</span></div>
                  <div className="detail-item"><label>Bio</label><span>{selectedRecord.bio || "N/A"}</span></div>
                </>
              )}

              {recordType === "SERVICE" && (
                <>
                  <div className="detail-item"><label>Service Name</label><span>{selectedRecord.name}</span></div>
                  <div className="detail-item"><label>Category</label><span>{selectedRecord.categoryName}</span></div>
                  <div className="detail-item"><label>Price</label><span>${selectedRecord.price}</span></div>
                  <div className="detail-item"><label>Duration</label><span>{selectedRecord.duration} mins</span></div>
                  <div className="detail-item"><label>Description</label><span>{selectedRecord.description || "N/A"}</span></div>
                </>
              )}

              {recordType === "CATEGORY" && (
                <>
                  <div className="detail-item"><label>Category Name</label><span>{selectedRecord.name}</span></div>
                  <div className="detail-item"><label>Description</label><span>{selectedRecord.description || "N/A"}</span></div>
                </>
              )}

              {recordType === "BOOKING" && (
                <>
                  <div className="detail-item"><label>Customer Name</label><span>{selectedRecord.customerName}</span></div>
                  <div className="detail-item"><label>Provider Company</label><span>{selectedRecord.providerCompanyName}</span></div>
                  <div className="detail-item"><label>Service Name</label><span>{selectedRecord.serviceName}</span></div>
                  <div className="detail-item"><label>Booking Date</label><span>{selectedRecord.bookingDate}</span></div>
                  <div className="detail-item"><label>Total Price</label><span>${selectedRecord.totalPrice}</span></div>
                  <div className="detail-item"><label>Status</label><span>{selectedRecord.status}</span></div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Register Admin Modal */}
      {isAddAdminModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsAddAdminModalOpen(false)}>
          <div className="detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Register New Admin</h3>
              <button className="close-modal-btn" onClick={() => setIsAddAdminModalOpen(false)}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleCreateAdmin} className="modal-form">
              <div className="form-group-modal">
                <label>Full Name *</label>
                <input
                  type="text"
                  placeholder="Enter admin name"
                  value={adminForm.name}
                  onChange={(e) => setAdminForm({ ...adminForm, name: e.target.value })}
                  className="modal-input"
                  required
                />
              </div>

              <div className="form-group-modal">
                <label>Email Address *</label>
                <input
                  type="email"
                  placeholder="Enter email"
                  value={adminForm.email}
                  onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                  className="modal-input"
                  required
                />
              </div>

              <div className="form-group-modal">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  placeholder="10-digit phone number"
                  value={adminForm.phone}
                  onChange={(e) => setAdminForm({ ...adminForm, phone: e.target.value })}
                  className="modal-input"
                  required
                />
              </div>

              <div className="form-group-modal">
                <label>Department</label>
                <input
                  type="text"
                  placeholder="System Administration"
                  value={adminForm.department}
                  onChange={(e) => setAdminForm({ ...adminForm, department: e.target.value })}
                  className="modal-input"
                />
              </div>

              <div className="form-group-modal">
                <label>Password *</label>
                <input
                  type="password"
                  placeholder="Enter password (min 6 chars)"
                  value={adminForm.password}
                  onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                  className="modal-input"
                  required
                />
              </div>

              <button
                type="submit"
                className="primary-add-btn"
                style={{ width: "100%", justifyContent: "center", marginTop: "10px" }}
                disabled={adminRegistering}
              >
                {adminRegistering ? "Registering..." : "Create Admin Account"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
