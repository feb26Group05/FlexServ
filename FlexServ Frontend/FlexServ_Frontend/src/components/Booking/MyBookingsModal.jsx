import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import transactionApi from "../../api/transactionApi";
import { FaTimes, FaCalendarAlt, FaClock, FaBan, FaCheckCircle, FaSpinner, FaMapMarkerAlt, FaCreditCard, FaStar } from "react-icons/fa";
import PaymentModal from "../Payment/PaymentModal";
import ReviewModal from "../Review/ReviewModal";
import "./MyBookingsModal.css";

export default function MyBookingsModal({ onClose }) {
  const currentUser = useSelector((state) => state.auth.user);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [activeTab, setActiveTab] = useState("ALL");

  const [selectedPaymentBooking, setSelectedPaymentBooking] = useState(null);
  const [selectedReviewBooking, setSelectedReviewBooking] = useState(null);
  const [paidBookingMap, setPaidBookingMap] = useState({});
  const [reviewedBookingMap, setReviewedBookingMap] = useState({});

  const customerId = currentUser?.id || currentUser?.userId;

  const fetchCustomerBookings = async () => {
    if (!customerId) return;
    setLoading(true);
    try {
      const res = await transactionApi.get(`/bookings/customer/${customerId}`);
      const list = Array.isArray(res.data?.data) ? res.data.data : [];
      setBookings(list);

      // Fetch payment and review statuses
      try {
        const payRes = await transactionApi.get(`/payments/customer/${customerId}`);
        const payList = Array.isArray(payRes.data?.data) ? payRes.data.data : [];
        const payMap = {};
        payList.forEach((p) => { payMap[p.bookingId] = p; });
        setPaidBookingMap(payMap);
      } catch (e) {
        console.warn("Could not fetch payments:", e);
      }

      try {
        const revRes = await transactionApi.get(`/reviews/customer/${customerId}`);
        const revList = Array.isArray(revRes.data?.data) ? revRes.data.data : [];
        const revMap = {};
        revList.forEach((r) => { revMap[r.bookingId] = r; });
        setReviewedBookingMap(revMap);
      } catch (e) {
        console.warn("Could not fetch reviews:", e);
      }

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
          <p>Track your requested services, payments, and ratings</p>

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
            {filteredBookings.map((b) => {
              const statusUpper = (b.status || "").toUpperCase();
              const isPaid = !!paidBookingMap[b.id];
              const reviewObj = reviewedBookingMap[b.id];

              return (
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

                  <div className="booking-card-actions">
                    {/* Cancel Request button */}
                    {["PENDING", "CONFIRMED"].includes(statusUpper) && (
                      <button
                        className="cancel-booking-btn"
                        onClick={() => handleCancelBooking(b.id)}
                        disabled={cancellingId === b.id}
                      >
                        {cancellingId === b.id ? "Cancelling..." : "Cancel Request"}
                      </button>
                    )}

                    {/* Payment status / Pay Now */}
                    {!["CANCELLED", "REJECTED"].includes(statusUpper) && (
                      isPaid ? (
                        <span className="payment-status-tag">
                          <FaCheckCircle /> Paid ({paidBookingMap[b.id].paymentMethod})
                        </span>
                      ) : (
                        <button
                          className="pay-now-btn"
                          onClick={() => setSelectedPaymentBooking(b)}
                        >
                          <FaCreditCard /> Pay Now (₹{b.totalPrice})
                        </button>
                      )
                    )}

                    {/* Review Service Provider */}
                    {statusUpper === "COMPLETED" && (
                      reviewObj ? (
                        <span className="review-status-tag">
                          <FaStar className="star-gold" /> {reviewObj.rating}/5 Rated
                        </span>
                      ) : (
                        <button
                          className="review-btn"
                          onClick={() => setSelectedReviewBooking(b)}
                        >
                          <FaStar /> Leave Review
                        </button>
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Sub-modals for Payment & Review */}
      {selectedPaymentBooking && (
        <PaymentModal
          booking={selectedPaymentBooking}
          onClose={() => setSelectedPaymentBooking(null)}
          onPaymentSuccess={(payment) => {
            setPaidBookingMap((prev) => ({ ...prev, [payment.bookingId]: payment }));
          }}
        />
      )}

      {selectedReviewBooking && (
        <ReviewModal
          booking={selectedReviewBooking}
          onClose={() => setSelectedReviewBooking(null)}
          onReviewSuccess={(review) => {
            setReviewedBookingMap((prev) => ({ ...prev, [review.bookingId]: review }));
          }}
        />
      )}
    </div>
  );
}
