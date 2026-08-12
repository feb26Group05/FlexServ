import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import businessApi from "../../api/businessApi";
import api from "../../api/api";
import "./AdminAccountManagement.css";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/authSlice";
import Cookies from "js-cookie";
import {
  FaShieldAlt,
  FaSearch,
  FaSignOutAlt,
  FaUsers,
  FaBriefcase,
  FaTimes,
  FaSync,
  FaEye,
  FaFilter,
  FaUserSlash,
  FaUserCheck,
  FaArrowLeft,
  FaCheckCircle,
  FaExclamationTriangle,
  FaPhoneAlt,
  FaEnvelope,
  FaBuilding,
  FaStar,
  FaHistory
} from "react-icons/fa";

import { useToast } from "../../components/Toast/ToastContext";

export default function AdminAccountManagement() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();

  // Active Tab: "customers" | "providers" | "all"
  const [activeTab, setActiveTab] = useState("customers");

  // Data lists
  const [usersList, setUsersList] = useState([]);
  const [providersList, setProvidersList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL"); // ALL | ACTIVE | INACTIVE

  // Modal Views
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [accountType, setAccountType] = useState("CUSTOMER"); // CUSTOMER | PROVIDER
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Confirmation Modal for Soft-Delete / Restore
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    item: null,
    type: "CUSTOMER", // CUSTOMER | PROVIDER
    targetActive: false, // false = soft delete, true = restore
  });
  const [actionProcessing, setActionProcessing] = useState(false);

  // Fetch all Users: GET /api/admin/users
  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      const res = await businessApi.get("/admin/users");
      const list = Array.isArray(res.data?.data) ? res.data.data : [];
      setUsersList(list);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      toast.error("Failed to load user accounts");
    } finally {
      setLoading(false);
    }
  };

  // Fetch all Service Providers: GET /api/admin/providers
  const fetchAllProviders = async () => {
    try {
      setLoading(true);
      const res = await businessApi.get("/admin/providers");
      const list = Array.isArray(res.data?.data) ? res.data.data : [];
      setProvidersList(list);
    } catch (err) {
      console.error("Failed to fetch providers:", err);
      toast.error("Failed to load provider accounts");
    } finally {
      setLoading(false);
    }
  };

  const refreshAllData = () => {
    fetchAllUsers();
    fetchAllProviders();
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  // Compute Metrics
  const customerUsers = usersList.filter((u) => u.role === "CUSTOMER");
  const activeCustomersCount = customerUsers.filter((u) => u.active !== false).length;
  const softDeletedCustomersCount = customerUsers.filter((u) => u.active === false).length;

  const activeProvidersCount = providersList.filter(
    (p) => p.companyAvailable !== false && p.userActive !== false
  ).length;
  const softDeletedProvidersCount = providersList.filter(
    (p) => p.companyAvailable === false || p.userActive === false
  ).length;

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

  // Open confirmation modal
  const openConfirmModal = (item, type, targetActive) => {
    setConfirmModal({
      isOpen: true,
      item,
      type,
      targetActive,
    });
  };

  // Execute Soft Delete or Restore
  const handleConfirmAction = async () => {
    if (!confirmModal.item) return;

    try {
      setActionProcessing(true);
      const { item, type, targetActive } = confirmModal;

      if (type === "CUSTOMER" || type === "USER") {
        // PUT /api/admin/users/{id}/status?active=true/false
        await businessApi.put(`/admin/users/${item.id}/status`, null, {
          params: { active: targetActive },
        });

        toast.success(
          targetActive
            ? `User "${item.name}" reactivated successfully!`
            : `User "${item.name}" soft-deleted / deactivated.`
        );
      } else if (type === "PROVIDER") {
        // PUT /api/admin/providers/{id}/status?active=true/false
        await businessApi.put(`/admin/providers/${item.id}/status`, null, {
          params: { active: targetActive },
        });

        toast.success(
          targetActive
            ? `Provider "${item.companyName || item.userName}" reactivated successfully!`
            : `Provider "${item.companyName || item.userName}" soft-deleted / deactivated.`
        );
      }

      setConfirmModal({ isOpen: false, item: null, type: "CUSTOMER", targetActive: false });
      refreshAllData();
    } catch (err) {
      console.error("Action error:", err);
      toast.error(
        "Failed to update account status: " + (err.response?.data?.message || err.message)
      );
    } finally {
      setActionProcessing(false);
    }
  };

  // Open details modal
  const openViewModal = (item, type) => {
    setSelectedAccount(item);
    setAccountType(type);
    setIsDetailModalOpen(true);
  };

  // Filter list by tab, search, and status
  const getFilteredList = () => {
    let list = [];

    if (activeTab === "customers") {
      list = customerUsers.map((u) => ({
        ...u,
        _displayType: "CUSTOMER",
        _isActive: u.active !== false,
      }));
    } else if (activeTab === "providers") {
      list = providersList.map((p) => ({
        ...p,
        _displayType: "PROVIDER",
        _isActive: p.companyAvailable !== false && p.userActive !== false,
      }));
    } else {
      // "all"
      const mappedUsers = usersList.map((u) => ({
        ...u,
        _displayType: u.role || "USER",
        _isActive: u.active !== false,
      }));
      const mappedProviders = providersList.map((p) => ({
        ...p,
        _displayType: "PROVIDER",
        _isActive: p.companyAvailable !== false && p.userActive !== false,
      }));
      list = [...mappedUsers, ...mappedProviders];
    }

    // Status Filter
    if (statusFilter === "ACTIVE") {
      list = list.filter((item) => item._isActive === true);
    } else if (statusFilter === "INACTIVE") {
      list = list.filter((item) => item._isActive === false);
    }

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((item) => {
        const idMatch = item.id && item.id.toString().includes(q);
        const nameMatch = item.name && item.name.toLowerCase().includes(q);
        const userNameMatch = item.userName && item.userName.toLowerCase().includes(q);
        const emailMatch = item.email && item.email.toLowerCase().includes(q);
        const userEmailMatch = item.userEmail && item.userEmail.toLowerCase().includes(q);
        const phoneMatch = item.phone && item.phone.toLowerCase().includes(q);
        const userPhoneMatch = item.userPhone && item.userPhone.toLowerCase().includes(q);
        const companyMatch = item.companyName && item.companyName.toLowerCase().includes(q);

        return (
          idMatch ||
          nameMatch ||
          userNameMatch ||
          emailMatch ||
          userEmailMatch ||
          phoneMatch ||
          userPhoneMatch ||
          companyMatch
        );
      });
    }

    return list;
  };

  const filteredData = getFilteredList();

  return (
    <div className="account-mgmt-container">
      <div className="account-mgmt-wrapper">
        {/* Glass Header */}
        <header className="glass-header-mgmt">
          <div className="header-left-mgmt">
            <div className="brand-icon-box-mgmt">
              <FaShieldAlt />
            </div>
            <div className="brand-info-mgmt">
              <h1>
                FlexServ <span>ACCOUNT & SOFT-DELETE HUB</span>
              </h1>
              <p>
                <span className="status-indicator-mgmt"></span>
                Admin Security Center & User Lifecycle Management
              </p>
            </div>
          </div>

          <div className="header-right-mgmt">
            <button className="btn-nav-dashboard" onClick={() => navigate("/admin")}>
              <FaArrowLeft /> Overview Dashboard
            </button>
            <button className="btn-glass-secondary-mgmt" onClick={handleLogout}>
              <FaSignOutAlt /> Exit
            </button>
          </div>
        </header>

        {/* Overview Metric Cards */}
        <div className="mgmt-metrics-grid">
          <div
            className={`mgmt-metric-card ${activeTab === "customers" ? "selected" : ""}`}
            onClick={() => setActiveTab("customers")}
          >
            <div className="metric-icon-mgmt cyan">
              <FaUsers />
            </div>
            <div className="metric-data-mgmt">
              <div className="metric-header-split">
                <h3>{customerUsers.length}</h3>
                <span className="badge-stat green">{activeCustomersCount} Active</span>
              </div>
              <p>Total Customer Users</p>
              <div className="sub-metric-row">
                <span className="sub-stat-deleted">
                  <FaUserSlash /> {softDeletedCustomersCount} Soft-Deleted
                </span>
              </div>
            </div>
          </div>

          <div
            className={`mgmt-metric-card ${activeTab === "providers" ? "selected" : ""}`}
            onClick={() => setActiveTab("providers")}
          >
            <div className="metric-icon-mgmt purple">
              <FaBriefcase />
            </div>
            <div className="metric-data-mgmt">
              <div className="metric-header-split">
                <h3>{providersList.length}</h3>
                <span className="badge-stat green">{activeProvidersCount} Active</span>
              </div>
              <p>Service Providers</p>
              <div className="sub-metric-row">
                <span className="sub-stat-deleted">
                  <FaUserSlash /> {softDeletedProvidersCount} Soft-Deleted
                </span>
              </div>
            </div>
          </div>

          <div
            className={`mgmt-metric-card ${activeTab === "all" ? "selected" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            <div className="metric-icon-mgmt indigo">
              <FaShieldAlt />
            </div>
            <div className="metric-data-mgmt">
              <div className="metric-header-split">
                <h3>{usersList.length + providersList.length}</h3>
                <span className="badge-stat orange">Admin Governed</span>
              </div>
              <p>Total Monitored Accounts</p>
              <div className="sub-metric-row">
                <span className="sub-stat-total">
                  <FaCheckCircle /> {activeCustomersCount + activeProvidersCount} Active Total
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Panel */}
        <main className="main-glass-panel-mgmt">
          {/* Tab Navigation */}
          <div className="tabs-bar-mgmt">
            <button
              className={`tab-btn-mgmt ${activeTab === "customers" ? "active" : ""}`}
              onClick={() => setActiveTab("customers")}
            >
              <FaUsers /> Customer Accounts ({customerUsers.length})
            </button>
            <button
              className={`tab-btn-mgmt ${activeTab === "providers" ? "active" : ""}`}
              onClick={() => setActiveTab("providers")}
            >
              <FaBriefcase /> Service Providers ({providersList.length})
            </button>
            <button
              className={`tab-btn-mgmt ${activeTab === "all" ? "active" : ""}`}
              onClick={() => setActiveTab("all")}
            >
              <FaHistory /> All System Accounts ({usersList.length + providersList.length})
            </button>
          </div>

          {/* Search, Filter & Action Toolbar */}
          <div className="toolbar-container-mgmt">
            <div className="search-field-box-mgmt">
              <FaSearch />
              <input
                type="text"
                placeholder="Search by name, email, phone, company, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="btn-clear-search" onClick={() => setSearchQuery("")}>
                  <FaTimes />
                </button>
              )}
            </div>

            <div className="filters-group-mgmt">
              <div className="filter-select-box">
                <FaFilter className="filter-icon-inline" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="select-styled-mgmt"
                >
                  <option value="ALL">Status: All Accounts</option>
                  <option value="ACTIVE">Status: Active Only</option>
                  <option value="INACTIVE">Status: Soft-Deleted / Inactive</option>
                </select>
              </div>

              <button className="btn-action-icon-mgmt" onClick={refreshAllData} title="Refresh Dataset">
                <FaSync /> Refresh
              </button>
            </div>
          </div>

          {/* Accounts Table */}
          <div className="table-scroll-container-mgmt">
            {loading ? (
              <div className="loader-box-mgmt">
                <div className="spinner-glow"></div>
                <p>Loading accounts from BusinessService...</p>
              </div>
            ) : filteredData.length === 0 ? (
              <div className="empty-box-mgmt">
                <FaExclamationTriangle />
                <h3>No Accounts Found</h3>
                <p>No accounts match your current tab and filter criteria.</p>
              </div>
            ) : (
              <table className="custom-table-mgmt">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Account Identity</th>
                    <th>Contact & Profile</th>
                    <th>Account Role</th>
                    <th>Lifecycle Status</th>
                    <th>Soft Delete & Access Controls</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item) => {
                    const isProvider = item._displayType === "PROVIDER";
                    const displayName = isProvider
                      ? item.companyName || item.userName || `Provider #${item.id}`
                      : item.name || `User #${item.id}`;
                    const displayEmail = isProvider ? item.userEmail : item.email;
                    const displayPhone = isProvider ? item.userPhone : item.phone;
                    const isActive = item._isActive;

                    return (
                      <tr key={`${item._displayType}-${item.id}`} className={!isActive ? "row-inactive" : ""}>
                        <td className="row-id-mgmt">#{item.id}</td>
                        <td>
                          <div className="user-identity-mgmt">
                            <div className={`avatar-badge-mgmt ${isProvider ? "provider-avatar" : "user-avatar"} ${!isActive ? "avatar-inactive" : ""}`}>
                              {displayName.charAt(0).toUpperCase()}
                            </div>
                            <div className="name-email-mgmt">
                              <h4>
                                {displayName}
                                {!isActive && <span className="tag-soft-deleted">DEACTIVATED</span>}
                              </h4>
                              <p>
                                <FaEnvelope /> {displayEmail || "No email listed"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="contact-info-cell">
                            <p>
                              <FaPhoneAlt /> {displayPhone || "N/A"}
                            </p>
                            {isProvider && (
                              <p className="sub-detail-text">
                                <FaBuilding /> {item.experienceYears || 0} Yrs Exp • Rating: {item.rating || "5.0"}
                              </p>
                            )}
                          </div>
                        </td>
                        <td>
                          <span className={`badge-role-mgmt ${item._displayType.toLowerCase()}`}>
                            {item._displayType}
                          </span>
                        </td>
                        <td>
                          {isActive ? (
                            <div className="status-pill active-pill">
                              <span className="dot-glow active-dot"></span>
                              <span>ACTIVE</span>
                            </div>
                          ) : (
                            <div className="status-pill inactive-pill">
                              <span className="dot-glow inactive-dot"></span>
                              <span>SOFT DELETED</span>
                            </div>
                          )}
                        </td>
                        <td>
                          <div className="action-buttons-cell">
                            <button
                              className="btn-action-view"
                              onClick={() => openViewModal(item, isProvider ? "PROVIDER" : "CUSTOMER")}
                              title="View full account profile"
                            >
                              <FaEye /> View
                            </button>

                            {isActive ? (
                              <button
                                className="btn-action-soft-delete"
                                onClick={() =>
                                  openConfirmModal(
                                    item,
                                    isProvider ? "PROVIDER" : "CUSTOMER",
                                    false
                                  )
                                }
                                title="Soft Delete / Deactivate Account"
                              >
                                <FaUserSlash /> Soft Delete
                              </button>
                            ) : (
                              <button
                                className="btn-action-restore"
                                onClick={() =>
                                  openConfirmModal(
                                    item,
                                    isProvider ? "PROVIDER" : "CUSTOMER",
                                    true
                                  )
                                }
                                title="Restore / Reactivate Account"
                              >
                                <FaUserCheck /> Restore
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>

      {/* Confirmation Modal for Soft-Delete / Restore */}
      {confirmModal.isOpen && confirmModal.item && (
        <div className="modal-overlay-mgmt" onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })}>
          <div className="modal-confirm-content" onClick={(e) => e.stopPropagation()}>
            <div className={`modal-confirm-icon ${confirmModal.targetActive ? "icon-restore" : "icon-delete"}`}>
              {confirmModal.targetActive ? <FaUserCheck /> : <FaUserSlash />}
            </div>

            <h3>
              {confirmModal.targetActive
                ? "Reactivate & Restore Account?"
                : "Soft Delete / Deactivate Account?"}
            </h3>

            <p className="confirm-text">
              {confirmModal.targetActive ? (
                <>
                  Are you sure you want to <strong>restore platform access</strong> for{" "}
                  <strong>
                    {confirmModal.item.name ||
                      confirmModal.item.companyName ||
                      confirmModal.item.userName}
                  </strong>{" "}
                  (ID #{confirmModal.item.id})? This will mark the account as <strong>Active</strong>.
                </>
              ) : (
                <>
                  Are you sure you want to <strong>soft delete / deactivate</strong>{" "}
                  <strong>
                    {confirmModal.item.name ||
                      confirmModal.item.companyName ||
                      confirmModal.item.userName}
                  </strong>{" "}
                  (ID #{confirmModal.item.id})? This preserves all data records but restricts active access.
                </>
              )}
            </p>

            <div className="confirm-actions-row">
              <button
                className="btn-cancel-modal"
                onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                disabled={actionProcessing}
              >
                Cancel
              </button>
              <button
                className={`btn-confirm-action ${confirmModal.targetActive ? "btn-confirm-restore" : "btn-confirm-delete"}`}
                onClick={handleConfirmAction}
                disabled={actionProcessing}
              >
                {actionProcessing ? (
                  "Processing..."
                ) : confirmModal.targetActive ? (
                  <>
                    <FaCheckCircle /> Confirm Reactivation
                  </>
                ) : (
                  <>
                    <FaUserSlash /> Confirm Soft Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail View Modal */}
      {isDetailModalOpen && selectedAccount && (
        <div className="modal-overlay-mgmt" onClick={() => setIsDetailModalOpen(false)}>
          <div className="modal-detail-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-bar-mgmt">
              <div className="modal-title-box">
                <span className="badge-modal-type">{accountType}</span>
                <h3>Account Profile Details</h3>
              </div>
              <button className="btn-close-mgmt" onClick={() => setIsDetailModalOpen(false)}>
                <FaTimes />
              </button>
            </div>

            <div className="details-grid-mgmt">
              <div className="detail-row-mgmt">
                <label>Account ID</label>
                <span>#{selectedAccount.id}</span>
              </div>

              {accountType === "CUSTOMER" && (
                <>
                  <div className="detail-row-mgmt">
                    <label>Full Name</label>
                    <span>{selectedAccount.name}</span>
                  </div>
                  <div className="detail-row-mgmt">
                    <label>Email Address</label>
                    <span>{selectedAccount.email}</span>
                  </div>
                  <div className="detail-row-mgmt">
                    <label>Phone Number</label>
                    <span>{selectedAccount.phone}</span>
                  </div>
                  <div className="detail-row-mgmt">
                    <label>Assigned Role</label>
                    <span>{selectedAccount.role}</span>
                  </div>
                  <div className="detail-row-mgmt">
                    <label>Lifecycle Status</label>
                    <span>{selectedAccount.active !== false ? "ACTIVE (Enabled)" : "SOFT DELETED (Disabled)"}</span>
                  </div>
                  {selectedAccount.createdAt && (
                    <div className="detail-row-mgmt">
                      <label>Created On</label>
                      <span>{selectedAccount.createdAt}</span>
                    </div>
                  )}
                </>
              )}

              {accountType === "PROVIDER" && (
                <>
                  <div className="detail-row-mgmt">
                    <label>Company Name</label>
                    <span>{selectedAccount.companyName || "N/A"}</span>
                  </div>
                  <div className="detail-row-mgmt">
                    <label>Owner Name</label>
                    <span>{selectedAccount.userName || "N/A"}</span>
                  </div>
                  <div className="detail-row-mgmt">
                    <label>Owner Email</label>
                    <span>{selectedAccount.userEmail || "N/A"}</span>
                  </div>
                  <div className="detail-row-mgmt">
                    <label>Owner Phone</label>
                    <span>{selectedAccount.userPhone || "N/A"}</span>
                  </div>
                  <div className="detail-row-mgmt">
                    <label>Experience</label>
                    <span>{selectedAccount.experienceYears || 0} Years</span>
                  </div>
                  <div className="detail-row-mgmt">
                    <label>Rating</label>
                    <span>
                      <FaStar style={{ color: "#f59e0b" }} /> {selectedAccount.rating || "5.0"}
                    </span>
                  </div>
                  <div className="detail-row-mgmt">
                    <label>Company Availability</label>
                    <span>{selectedAccount.companyAvailable !== false ? "AVAILABLE" : "UNAVAILABLE"}</span>
                  </div>
                  <div className="detail-row-mgmt">
                    <label>User Account Status</label>
                    <span>{selectedAccount.userActive !== false ? "ACTIVE" : "SOFT DELETED"}</span>
                  </div>
                  <div className="detail-row-mgmt">
                    <label>Bio Summary</label>
                    <span>{selectedAccount.bio || "No bio description"}</span>
                  </div>
                </>
              )}
            </div>

            <div className="modal-footer-mgmt">
              <button className="btn-close-action" onClick={() => setIsDetailModalOpen(false)}>
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
