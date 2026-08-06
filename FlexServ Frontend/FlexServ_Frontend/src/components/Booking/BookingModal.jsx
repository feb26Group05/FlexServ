import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import businessApi from "../../api/businessApi";
import transactionApi from "../../api/transactionApi";
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaTimes, FaCheckCircle, FaUserTie, FaPlus } from "react-icons/fa";
import "./BookingModal.css";

export default function BookingModal({ service, onClose, onBookingSuccess }) {
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.user);

  const [providers, setProviders] = useState([]);
  const [selectedProviderId, setSelectedProviderId] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [showAddAddress, setShowAddAddress] = useState(false);

  // New Address Form State
  const [newAddress, setNewAddress] = useState({
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
  });

  // Booking Schedule
  const todayStr = new Date().toISOString().split("T")[0];
  const [bookingDate, setBookingDate] = useState(todayStr);
  const [bookingTime, setBookingTime] = useState("10:00");

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (!currentUser) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. Fetch Providers
        const provRes = await businessApi.get("/admin/providers");
        const provList = Array.isArray(provRes.data?.data) ? provRes.data.data : [];
        setProviders(provList);
        if (provList.length > 0) {
          setSelectedProviderId(provList[0].id);
        }

        // 2. Fetch User Addresses
        const addrRes = await businessApi.get("/users/addresses");
        const addrList = Array.isArray(addrRes.data?.data) ? addrRes.data.data : [];
        setAddresses(addrList);
        if (addrList.length > 0) {
          setSelectedAddressId(addrList[0].id);
        } else {
          setShowAddAddress(true);
        }
      } catch (err) {
        console.error("Error loading booking dependencies:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="booking-modal-overlay">
        <div className="booking-modal-card text-center">
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
          <h2>Authentication Required</h2>
          <p>Please log in as a Customer to request and book services.</p>
          <div className="modal-actions">
            <button className="primary-btn" onClick={() => navigate("/login")}>
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleAddNewAddress = async (e) => {
    e.preventDefault();
    if (!newAddress.streetAddress || !newAddress.city || !newAddress.state || !newAddress.zipCode) {
      setErrorMsg("Please fill out all address fields.");
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg("");
      const res = await businessApi.post("/users/addresses", {
        houseNo: "A-1",
        street: newAddress.streetAddress,
        area: newAddress.city,
        city: newAddress.city,
        state: newAddress.state,
        pincode: newAddress.zipCode,
      });

      const added = res.data?.data;
      if (added) {
        setAddresses((prev) => [...prev, added]);
        setSelectedAddressId(added.id);
        setShowAddAddress(false);
        setNewAddress({ streetAddress: "", city: "", state: "", zipCode: "" });
      }
    } catch (err) {
      setErrorMsg("Failed to add address: " + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmBooking = async () => {
    if (!selectedProviderId) {
      setErrorMsg("Please select a Service Provider.");
      return;
    }
    if (!selectedAddressId) {
      setErrorMsg("Please select or add a service address.");
      return;
    }
    if (!bookingDate || !bookingTime) {
      setErrorMsg("Please choose booking date and time.");
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg("");

      const payload = {
        customerId: currentUser.id || currentUser.userId,
        providerId: Number(selectedProviderId),
        serviceId: service.id,
        addressId: Number(selectedAddressId),
        bookingDate: bookingDate,
        bookingTime: bookingTime.length === 5 ? `${bookingTime}:00` : bookingTime,
        totalPrice: service.price || 599,
      };

      const res = await transactionApi.post("/bookings", payload);

      if (res.data?.success) {
        setSuccessMsg("Booking Request Submitted Successfully! Status: PENDING");
        setTimeout(() => {
          if (onBookingSuccess) onBookingSuccess(res.data.data);
          onClose();
        }, 1500);
      }
    } catch (err) {
      setErrorMsg("Booking Request Failed: " + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="booking-modal-overlay">
      <div className="booking-modal-card">
        <button className="close-btn" onClick={onClose}>
          <FaTimes />
        </button>

        <div className="modal-header">
          <span className="modal-badge">Service Booking Cycle</span>
          <h2>Book Service: {service.name || service.title}</h2>
          <p className="service-price-tag">
            Starting Price: <strong>₹{service.price}</strong>
          </p>
        </div>

        {errorMsg && <div className="modal-error-banner">{errorMsg}</div>}
        {successMsg && <div className="modal-success-banner"><FaCheckCircle /> {successMsg}</div>}

        {loading ? (
          <div className="modal-loader">Loading provider & address data...</div>
        ) : (
          <div className="modal-body">
            {/* Provider Selection */}
            <div className="form-group">
              <label>
                <FaUserTie /> Select Service Provider
              </label>
              <select
                value={selectedProviderId}
                onChange={(e) => setSelectedProviderId(e.target.value)}
                className="modal-select"
              >
                {providers.length === 0 && <option value="">No Providers Available</option>}
                {providers.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.companyName || `Provider #${p.id}`} (Rating: ⭐{p.rating || "4.8"})
                  </option>
                ))}
              </select>
            </div>

            {/* Address Selection & Add New Address */}
            <div className="form-group">
              <div className="label-row">
                <label>
                  <FaMapMarkerAlt /> Service Location Address
                </label>
                <button
                  type="button"
                  className="link-btn"
                  onClick={() => setShowAddAddress(!showAddAddress)}
                >
                  <FaPlus /> {showAddAddress ? "Select Existing" : "Add New Address"}
                </button>
              </div>

              {!showAddAddress ? (
                <select
                  value={selectedAddressId}
                  onChange={(e) => setSelectedAddressId(e.target.value)}
                  className="modal-select"
                >
                  {addresses.length === 0 && <option value="">No Address Found - Please Add One Below</option>}
                  {addresses.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.streetAddress || a.street}, {a.city}, {a.state} ({a.zipCode || a.pincode})
                    </option>
                  ))}
                </select>
              ) : (
                <div className="add-address-box">
                  <input
                    type="text"
                    placeholder="Street Address / House No"
                    value={newAddress.streetAddress}
                    onChange={(e) => setNewAddress({ ...newAddress, streetAddress: e.target.value })}
                  />
                  <div className="input-row">
                    <input
                      type="text"
                      placeholder="City"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    />
                    <input
                      type="text"
                      placeholder="State"
                      value={newAddress.state}
                      onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                    />
                    <input
                      type="text"
                      placeholder="Zip Code"
                      value={newAddress.zipCode}
                      onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
                    />
                  </div>
                  <button
                    type="button"
                    className="secondary-btn"
                    onClick={handleAddNewAddress}
                    disabled={submitting}
                  >
                    Save & Use Address
                  </button>
                </div>
              )}
            </div>

            {/* Date & Time Selection */}
            <div className="form-group input-row">
              <div>
                <label>
                  <FaCalendarAlt /> Service Date
                </label>
                <input
                  type="date"
                  min={todayStr}
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="modal-input"
                />
              </div>
              <div>
                <label>
                  <FaClock /> Service Time
                </label>
                <input
                  type="time"
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  className="modal-input"
                />
              </div>
            </div>
          </div>
        )}

        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose} disabled={submitting}>
            Cancel
          </button>
          <button
            className="confirm-btn"
            onClick={handleConfirmBooking}
            disabled={submitting || loading}
          >
            {submitting ? "Requesting..." : "Submit Booking Request"}
          </button>
        </div>
      </div>
    </div>
  );
}
