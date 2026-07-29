import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import adminApi from "../../api/adminApi";
import "./AdminDashboard.css";
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
  FaArrowRight
} from "react-icons/fa";

export default function AdminDashboard() {
  const navigate = useNavigate();

  // Active Directory Tab: "admins" | "users" | "providers" | "services" | "categories" | "bookings"
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
    department: "System Administration",
  });
  const [adminRegistering, setAdminRegistering] = useState(false);

  // 1. GET ALL ADMINS: GET /api/admin
  const fetchAllAdmins = async () => {
    try {
      setLoading(true);
      const res = await adminApi.get("/admin");
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
      const res = await adminApi.get(`/admin/${id}`);
      const item = res.data?.data || res.data;
      if (item) {
        setSelectedRecord(item);
        setRecordType("ADMIN");
        setIsDetailModalOpen(true);
      }
    } catch (err) {
      alert("Admin not found with ID: " + id);
    } finally {
      setLoading(false);
    }
  };

  // 3. GET ALL USERS: GET /api/admin/users
  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      const res = await adminApi.get("/admin/users");
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
      const res = await adminApi.get(`/admin/users/${id}`);
      const item = res.data?.data || res.data;
      if (item) {
        setSelectedRecord(item);
        setRecordType("USER");
        setIsDetailModalOpen(true);
      }
    } catch (err) {
      alert("User not found with ID: " + id);
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
      const res = await adminApi.get(`/admin/users/role/${role}`);
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
      const res = await adminApi.get("/admin/providers");
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
      const res = await adminApi.get(`/admin/providers/${id}`);
      const item = res.data?.data || res.data;
      if (item) {
        setSelectedRecord(item);
        setRecordType("PROVIDER");
        setIsDetailModalOpen(true);
      }
    } catch (err) {
      alert("Provider not found with ID: " + id);
    } finally {
      setLoading(false);
    }
  };

  // 8. GET ALL SERVICES: GET /api/admin/services
  const fetchAllServices = async () => {
    try {
      setLoading(true);
      const res = await adminApi.get("/admin/services");
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
      const res = await adminApi.get(`/admin/services/${id}`);
      const item = res.data?.data || res.data;
      if (item) {
        setSelectedRecord(item);
        setRecordType("SERVICE");
        setIsDetailModalOpen(true);
      }
    } catch (err) {
      alert("Service not found with ID: " + id);
    } finally {
      setLoading(false);
    }
  };

  // 10. GET ALL CATEGORIES: GET /api/admin/categories
  const fetchAllCategories = async () => {
    try {
      setLoading(true);
      const res = await adminApi.get("/admin/categories");
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
      const res = await adminApi.get(`/admin/categories/${id}`);
      const item = res.data?.data || res.data;
      if (item) {
        setSelectedRecord(item);
        setRecordType("CATEGORY");
        setIsDetailModalOpen(true);
      }
    } catch (err) {
      alert("Category not found with ID: " + id);
    } finally {
      setLoading(false);
    }
  };

  // 12. GET ALL BOOKINGS: GET /api/admin/bookings
  const fetchAllBookings = async () => {
    try {
      setLoading(true);
      const res = await adminApi.get("/admin/bookings");
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
      const res = await adminApi.get(`/admin/bookings/${id}`);
      const item = res.data?.data || res.data;
      if (item) {
        setSelectedRecord(item);
        setRecordType("BOOKING");
        setIsDetailModalOpen(true);
      }
    } catch (err) {
      alert("Booking not found with ID: " + id);
    } finally {
      setLoading(false);
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
      await adminApi.post("/admin/register", adminForm);
      alert("Admin Account Created Successfully!");
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
      alert("Registration failed: " + (err.response?.data?.message || err.message));
    } finally {
      setAdminRegistering(false);
    }
  };

  const openViewModal = (item, type) => {
    setSelectedRecord(item);
    setRecordType(type);
    setIsDetailModalOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
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
              <h1>FlexServ Admin Portal</h1>
              <p>
                <span className="status-indicator"></span> Standalone Microservice Engine (Port 8082)
              </p>
            </div>
          </div>

          <div className="header-right">
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
          <div className="metric-card" onClick={() => setActiveTab("admins")}>
            <div className="metric-icon indigo"><FaShieldAlt /></div>
            <div className="metric-data">
              <h3>{counts.admins}</h3>
              <p>Total Admins</p>
            </div>
          </div>

          <div className="metric-card" onClick={() => setActiveTab("users")}>
            <div className="metric-icon cyan"><FaUsers /></div>
            <div className="metric-data">
              <h3>{counts.users}</h3>
              <p>Registered Users</p>
            </div>
          </div>

          <div className="metric-card" onClick={() => setActiveTab("providers")}>
            <div className="metric-icon purple"><FaBriefcase /></div>
            <div className="metric-data">
              <h3>{counts.providers}</h3>
              <p>Service Providers</p>
            </div>
          </div>

          <div className="metric-card" onClick={() => setActiveTab("services")}>
            <div className="metric-icon emerald"><FaConciergeBell /></div>
            <div className="metric-data">
              <h3>{counts.services}</h3>
              <p>Active Services</p>
            </div>
          </div>

          <div className="metric-card" onClick={() => setActiveTab("categories")}>
            <div className="metric-icon orange"><FaThList /></div>
            <div className="metric-data">
              <h3>{counts.categories}</h3>
              <p>Categories</p>
            </div>
          </div>

          <div className="metric-card" onClick={() => setActiveTab("bookings")}>
            <div className="metric-icon rose"><FaCalendarCheck /></div>
            <div className="metric-data">
              <h3>{counts.bookings}</h3>
              <p>Total Bookings</p>
            </div>
          </div>
        </div>

        {/* Main Directory Glass Panel */}
        <main className="main-glass-panel">
          <div className="tabs-bar">
            <button className={`tab-button ${activeTab === "admins" ? "active" : ""}`} onClick={() => setActiveTab("admins")}>
              <FaShieldAlt /> Admins Directory
            </button>
            <button className={`tab-button ${activeTab === "users" ? "active" : ""}`} onClick={() => setActiveTab("users")}>
              <FaUsers /> Users Directory
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
              <FaCalendarCheck /> Bookings
            </button>
          </div>

          {/* Search, Filter & Lookup Bar */}
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
              {/* Role filter dropdown for users tab */}
              {activeTab === "users" && (
                <select
                  value={selectedRole}
                  onChange={(e) => fetchUsersByRole(e.target.value)}
                  className="select-styled"
                >
                  <option value="ALL">Filter Role: ALL</option>
                  <option value="USER">USER</option>
                  <option value="SERVICE_PROVIDER">SERVICE_PROVIDER</option>
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
                  <FaFilter /> GET ID
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

          {/* Data Directory Table */}
          <div className="table-scroll-container">
            {loading ? (
              <div className="loader-box">Retrieving dataset from AdminService...</div>
            ) : (
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Entity Details</th>
                    <th>Sub Information</th>
                    <th>Role / Status</th>
                    <th>Actions</th>
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
                          <FaEye /> View GET
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
                        <button className="btn-action-icon" onClick={() => openViewModal(item, "USER")}>
                          <FaEye /> View GET
                        </button>
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
                      <td>{item.userEmail} | {item.experienceYears} Yrs Exp</td>
                      <td>
                        <span className="badge-role-tag provider">PROVIDER</span>
                      </td>
                      <td>
                        <button className="btn-action-icon" onClick={() => openViewModal(item, "PROVIDER")}>
                          <FaEye /> View GET
                        </button>
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
                        <span style={{ color: "var(--brand-emerald)", fontWeight: "700" }}>${item.price}</span>
                      </td>
                      <td>
                        <button className="btn-action-icon" onClick={() => openViewModal(item, "SERVICE")}>
                          <FaEye /> View GET
                        </button>
                      </td>
                    </tr>
                  ))}

                  {activeTab === "categories" && filterList(categoriesList).map((item) => (
                    <tr key={item.id}>
                      <td className="row-id">#{item.id}</td>
                      <td>
                        <div className="name-email">
                          <h4>{item.name}</h4>
                        </div>
                      </td>
                      <td>{item.description || "System Service Category"}</td>
                      <td><span className="badge-role-tag admin">CATEGORY</span></td>
                      <td>
                        <button className="btn-action-icon" onClick={() => openViewModal(item, "CATEGORY")}>
                          <FaEye /> View GET
                        </button>
                      </td>
                    </tr>
                  ))}

                  {activeTab === "bookings" && filterList(bookingsList).map((item) => (
                    <tr key={item.id}>
                      <td className="row-id">#{item.id}</td>
                      <td>
                        <div className="name-email">
                          <h4>Customer: {item.customerName}</h4>
                          <p>Provider: {item.providerCompanyName}</p>
                        </div>
                      </td>
                      <td>Service: {item.serviceName} ({item.bookingDate})</td>
                      <td>
                        <span style={{ color: "var(--brand-cyan)", fontWeight: "700" }}>{item.status || "CONFIRMED"}</span>
                      </td>
                      <td>
                        <button className="btn-action-icon" onClick={() => openViewModal(item, "BOOKING")}>
                          <FaEye /> View GET
                        </button>
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
              <h3>{recordType} GET Detail View</h3>
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
                </>
              )}

              {recordType === "SERVICE" && (
                <>
                  <div className="detail-row"><label>Service Title</label><span>{selectedRecord.name}</span></div>
                  <div className="detail-row"><label>Category</label><span>{selectedRecord.categoryName}</span></div>
                  <div className="detail-row"><label>Price ($)</label><span>${selectedRecord.price}</span></div>
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
                  <div className="detail-row"><label>Total Price</label><span>${selectedRecord.totalPrice}</span></div>
                </>
              )}
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
                <label>Department</label>
                <input
                  type="text"
                  placeholder="System Administration"
                  value={adminForm.department}
                  onChange={(e) => setAdminForm({ ...adminForm, department: e.target.value })}
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
    </div>
  );
}
