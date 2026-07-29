import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import adminApi from "../../api/adminApi";
import "./AdminDashboard.css";
import {
  FaShieldAlt,
  FaSearch,
  FaUserPlus,
  FaSignOutAlt,
  FaToggleOn,
  FaToggleOff,
  FaUsers,
  FaBriefcase,
  FaConciergeBell,
  FaThList,
  FaCalendarCheck,
  FaTimes
} from "react-icons/fa";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("admins");

  const [adminsList, setAdminsList] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [providersList, setProvidersList] = useState([]);
  const [servicesList, setServicesList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [bookingsList, setBookingsList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const [isAddAdminModalOpen, setIsAddAdminModalOpen] = useState(false);
  const [adminForm, setAdminForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    department: "System Administration",
  });
  const [adminRegistering, setAdminRegistering] = useState(false);

  const fetchAllAdmins = async () => {
    try {
      setLoading(true);
      const res = await adminApi.get("/admin");
      const list = Array.isArray(res.data?.data) ? res.data.data : [];
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
      const res = await adminApi.get("/admin/users");
      const list = Array.isArray(res.data?.data) ? res.data.data : [];
      setUsersList(list);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllProviders = async () => {
    try {
      setLoading(true);
      const res = await adminApi.get("/admin/providers");
      const list = Array.isArray(res.data?.data) ? res.data.data : [];
      setProvidersList(list);
    } catch (err) {
      console.error("Failed to fetch providers:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllServices = async () => {
    try {
      setLoading(true);
      const res = await adminApi.get("/admin/services");
      const list = Array.isArray(res.data?.data) ? res.data.data : [];
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
      const res = await adminApi.get("/admin/categories");
      const list = Array.isArray(res.data?.data) ? res.data.data : [];
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
      const res = await adminApi.get("/admin/bookings");
      const list = Array.isArray(res.data?.data) ? res.data.data : [];
      setBookingsList(list);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "admins") fetchAllAdmins();
    else if (activeTab === "users") fetchAllUsers();
    else if (activeTab === "providers") fetchAllProviders();
    else if (activeTab === "services") fetchAllServices();
    else if (activeTab === "categories") fetchAllCategories();
    else if (activeTab === "bookings") fetchAllBookings();
  }, [activeTab]);

  const handleToggleStatus = async (type, id) => {
    try {
      let endpoint = "";
      if (type === "admins") endpoint = `/admin/${id}/toggle-status`;
      else if (type === "users") endpoint = `/admin/users/${id}/toggle-status`;
      else if (type === "providers") endpoint = `/admin/providers/${id}/toggle-status`;
      else if (type === "services") endpoint = `/admin/services/${id}/toggle-status`;
      else if (type === "categories") endpoint = `/admin/categories/${id}/toggle-status`;
      else if (type === "bookings") endpoint = `/admin/bookings/${id}/toggle-status`;

      await adminApi.patch(endpoint);

      if (activeTab === "admins") fetchAllAdmins();
      else if (activeTab === "users") fetchAllUsers();
      else if (activeTab === "providers") fetchAllProviders();
      else if (activeTab === "services") fetchAllServices();
      else if (activeTab === "categories") fetchAllCategories();
      else if (activeTab === "bookings") fetchAllBookings();
    } catch (err) {
      console.error("Failed to toggle status:", err);
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    try {
      setAdminRegistering(true);
      await adminApi.post("/admin/register", adminForm);
      alert("Admin Registered Successfully!");
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
      alert("Failed to register admin: " + (err.response?.data?.message || err.message));
    } finally {
      setAdminRegistering(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="admin-dashboard-container">
      <div className="admin-overlay">
        <header className="admin-header">
          <div className="logo-section">
            <div className="logo-badge">
              <FaShieldAlt />
            </div>
            <div className="header-title-box">
              <h1>FlexServ Admin Console</h1>
              <p>Standalone Microservice Governance Platform (Port 8082)</p>
            </div>
          </div>

          <div className="header-actions">
            <button className="primary-add-btn" onClick={() => setIsAddAdminModalOpen(true)}>
              <FaUserPlus /> Register Admin
            </button>
            <button className="logout-btn" onClick={handleLogout}>
              <FaSignOutAlt /> Exit
            </button>
          </div>
        </header>

        <main className="directory-panel">
          <div className="controls-top-row">
            <div className="tabs-container">
              <button className={`tab-btn ${activeTab === "admins" ? "active" : ""}`} onClick={() => setActiveTab("admins")}>
                <FaShieldAlt /> Admins
              </button>
              <button className={`tab-btn ${activeTab === "users" ? "active" : ""}`} onClick={() => setActiveTab("users")}>
                <FaUsers /> Users
              </button>
              <button className={`tab-btn ${activeTab === "providers" ? "active" : ""}`} onClick={() => setActiveTab("providers")}>
                <FaBriefcase /> Providers
              </button>
              <button className={`tab-btn ${activeTab === "services" ? "active" : ""}`} onClick={() => setActiveTab("services")}>
                <FaConciergeBell /> Services
              </button>
              <button className={`tab-btn ${activeTab === "categories" ? "active" : ""}`} onClick={() => setActiveTab("categories")}>
                <FaThList /> Categories
              </button>
              <button className={`tab-btn ${activeTab === "bookings" ? "active" : ""}`} onClick={() => setActiveTab("bookings")}>
                <FaCalendarCheck /> Bookings
              </button>
            </div>
          </div>

          <div className="search-row">
            <div className="search-input-group">
              <FaSearch />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="table-wrapper">
            {loading ? (
              <div className="empty-state">Loading data from AdminService (Port 8082)...</div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name / Label</th>
                    <th>Details</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {activeTab === "admins" && adminsList.map((item) => (
                    <tr key={item.id}>
                      <td>#{item.id}</td>
                      <td>{item.name}</td>
                      <td>{item.email} ({item.department})</td>
                      <td>
                        <span className={`status-badge ${item.isActive ? "active" : "inactive"}`}>
                          {item.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <button className="toggle-btn" onClick={() => handleToggleStatus("admins", item.id)}>
                          {item.isActive ? <FaToggleOff /> : <FaToggleOn />} Toggle Status
                        </button>
                      </td>
                    </tr>
                  ))}

                  {activeTab === "users" && usersList.map((item) => (
                    <tr key={item.id}>
                      <td>#{item.id}</td>
                      <td>{item.name}</td>
                      <td>{item.email} | {item.phone} | Role: {item.role}</td>
                      <td>
                        <span className={`status-badge ${item.isActive ? "active" : "inactive"}`}>
                          {item.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <button className="toggle-btn" onClick={() => handleToggleStatus("users", item.id)}>
                          {item.isActive ? <FaToggleOff /> : <FaToggleOn />} Toggle Status
                        </button>
                      </td>
                    </tr>
                  ))}

                  {activeTab === "providers" && providersList.map((item) => (
                    <tr key={item.id}>
                      <td>#{item.id}</td>
                      <td>{item.companyName}</td>
                      <td>User: {item.userName} ({item.userEmail})</td>
                      <td>
                        <span className={`status-badge ${item.isActive ? "active" : "inactive"}`}>
                          {item.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <button className="toggle-btn" onClick={() => handleToggleStatus("providers", item.id)}>
                          {item.isActive ? <FaToggleOff /> : <FaToggleOn />} Toggle Status
                        </button>
                      </td>
                    </tr>
                  ))}

                  {activeTab === "services" && servicesList.map((item) => (
                    <tr key={item.id}>
                      <td>#{item.id}</td>
                      <td>{item.name}</td>
                      <td>Category: {item.categoryName} | Price: ${item.price}</td>
                      <td>
                        <span className={`status-badge ${item.isActive ? "active" : "inactive"}`}>
                          {item.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <button className="toggle-btn" onClick={() => handleToggleStatus("services", item.id)}>
                          {item.isActive ? <FaToggleOff /> : <FaToggleOn />} Toggle Status
                        </button>
                      </td>
                    </tr>
                  ))}

                  {activeTab === "categories" && categoriesList.map((item) => (
                    <tr key={item.id}>
                      <td>#{item.id}</td>
                      <td>{item.name}</td>
                      <td>{item.description}</td>
                      <td>
                        <span className={`status-badge ${item.isActive ? "active" : "inactive"}`}>
                          {item.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <button className="toggle-btn" onClick={() => handleToggleStatus("categories", item.id)}>
                          {item.isActive ? <FaToggleOff /> : <FaToggleOn />} Toggle Status
                        </button>
                      </td>
                    </tr>
                  ))}

                  {activeTab === "bookings" && bookingsList.map((item) => (
                    <tr key={item.id}>
                      <td>#{item.id}</td>
                      <td>Customer: {item.customerName}</td>
                      <td>Service: {item.serviceName} | Date: {item.bookingDate}</td>
                      <td>
                        <span className={`status-badge ${item.isActive ? "active" : "inactive"}`}>
                          {item.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <button className="toggle-btn" onClick={() => handleToggleStatus("bookings", item.id)}>
                          {item.isActive ? <FaToggleOff /> : <FaToggleOn />} Toggle Status
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
                <label>Name *</label>
                <input
                  type="text"
                  required
                  value={adminForm.name}
                  onChange={(e) => setAdminForm({ ...adminForm, name: e.target.value })}
                  className="modal-input"
                />
              </div>
              <div className="form-group-modal">
                <label>Email *</label>
                <input
                  type="email"
                  required
                  value={adminForm.email}
                  onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                  className="modal-input"
                />
              </div>
              <div className="form-group-modal">
                <label>Phone *</label>
                <input
                  type="text"
                  required
                  value={adminForm.phone}
                  onChange={(e) => setAdminForm({ ...adminForm, phone: e.target.value })}
                  className="modal-input"
                />
              </div>
              <div className="form-group-modal">
                <label>Department</label>
                <input
                  type="text"
                  value={adminForm.department}
                  onChange={(e) => setAdminForm({ ...adminForm, department: e.target.value })}
                  className="modal-input"
                />
              </div>
              <div className="form-group-modal">
                <label>Password *</label>
                <input
                  type="password"
                  required
                  value={adminForm.password}
                  onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                  className="modal-input"
                />
              </div>
              <button type="submit" className="primary-add-btn" disabled={adminRegistering}>
                {adminRegistering ? "Registering..." : "Submit Admin"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
