import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import transactionApi from "../../api/transactionApi";
import { FaTimes, FaCalendarAlt, FaClock, FaBan, FaCheckCircle, FaSpinner, FaMapMarkerAlt } from "react-icons/fa";
import "./MyBookingsModal.css";

export default function MyBookingsModal({ onClose }) {
  const currentUser = useSelector((state) => state.auth.user);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [activeTab, setActiveTab] = useState("ALL");

  const customerId = currentUser?.id || currentUser?.userId;

  const fetchCustomerBookings = async () => {
    if (!customerId) return;
    setLoading(true);
    try {
      const res = await transactionApi.get(`/bookings/customer/${customerId}`);
      const list = Array.isArray(res.data?.data) ? res.data.data : [];
      setBookings(list);
    } catch (err) {
      console.error("Failed to fetch customer bookings:", err);
      setErrorMsg("Failed loading bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerBookings();
  }, [customerId]);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this service request?")) return;
    try {
      setCancellingId(bookingId);
      await transactionApi.put(`/bookings/${bookingId}/cancel?reason=Cancelled+by+customer`);
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: "CANCELLED" } : b))
      );
    } catch (err) {
      alert("Failed to cancel booking: " + (err.response?.data?.message || err.message));
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusBadge = (status) => {
    const s = (status || "").toUpperCase();
    switch (s) {
      case "PENDING":
        return <span className="status-badge status-pending"><FaSpinner className="spin" /> Requested (Pending)</span>;
      case "CONFIRMED":
        return <span className="status-badge status-confirmed"><FaCheckCircle /> Confirmed</span>;
      case "IN_PROGRESS":
        return <span className="status-badge status-inprogress"><FaSpinner className="spin" /> In Progress</span>;
      case "COMPLETED":
        return <span className="status-badge status-completed"><FaCheckCircle /> Completed</span>;
      case "CANCELLED":
        return <span className="status-badge status-cancelled"><FaBan /> Cancelled</span>;
      case "REJECTED":
        return <span className="status-badge status-rejected"><FaBan /> Rejected by Provider</span>;
      default:
        return <span className="status-badge">{status}</span>;
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === "ALL") return true;
    if (activeTab === "ACTIVE") return ["PENDING", "CONFIRMED", "IN_PROGRESS"].includes((b.status || "").toUpperCase());
    if (activeTab === "COMPLETED") return (b.status || "").toUpperCase() === "COMPLETED";
    if (activeTab === "CANCELLED") return ["CANCELLED", "REJECTED"].includes((b.status || "").toUpperCase());
    return true;
  });

  return (
    <div className="mybookings-modal-overlay">
      <div className="mybookings-modal-card">
        <button className="close-btn" onClick={onClose}>
          <FaTimes />
        </button>

        <div className="modal-header">
          <h2>My Service Bookings</h2>
          <p>Track your requested services and real-time status updates</p>

          <div className="booking-tabs">
            <button className={activeTab === "ALL" ? "tab active" : "tab"} onClick={() => setActiveTab("ALL")}>
              All ({bookings.length})
            </button>
            <button className={activeTab === "ACTIVE" ? "tab active" : "tab"} onClick={() => setActiveTab("ACTIVE")}>
              Active Requests
            </button>
            <button className={activeTab === "COMPLETED" ? "tab active" : "tab"} onClick={() => setActiveTab("COMPLETED")}>
              Completed
            </button>
            <button className={activeTab === "CANCELLED" ? "tab active" : "tab"} onClick={() => setActiveTab("CANCELLED")}>
              Cancelled
            </button>
          </div>
        </div>

        {errorMsg && <div className="modal-error-banner">{errorMsg}</div>}

        {loading ? (
          <div className="modal-loader">Loading your bookings...</div>
        ) : filteredBookings.length === 0 ? (
          <div className="empty-bookings-box">
            <p>No service bookings found in this category.</p>
          </div>
        ) : (
          <div className="bookings-scroll-list">
            {filteredBookings.map((b) => (
              <div key={b.id} className="booking-item-card">
                <div className="booking-card-top">
                  <div>
                    <span className="booking-id-tag">Booking #{b.id}</span>
                    <h3>{b.serviceName || "Home Service"}</h3>
                  </div>
                  {getStatusBadge(b.status)}
                </div>

                <div className="booking-card-details">
                  <p className="detail-line">
                    <strong>Provider:</strong> {b.providerCompanyName || "Assigned Provider"}
                  </p>
                  <p className="detail-line">
                    <FaMapMarkerAlt /> {b.addressDetails || "Service Address"}
                  </p>
                  <div className="detail-row">
                    <span><FaCalendarAlt /> {b.bookingDate}</span>
                    <span><FaClock /> {b.bookingTime}</span>
                    <span className="price-label">Price: ₹{b.totalPrice}</span>
                  </div>
                </div>

                {["PENDING", "CONFIRMED"].includes((b.status || "").toUpperCase()) && (
                  <div className="booking-card-actions">
                    <button
                      className="cancel-booking-btn"
                      onClick={() => handleCancelBooking(b.id)}
                      disabled={cancellingId === b.id}
                    >
                      {cancellingId === b.id ? "Cancelling..." : "Cancel Request"}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
