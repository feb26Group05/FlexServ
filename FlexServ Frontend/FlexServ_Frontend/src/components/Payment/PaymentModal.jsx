import { useState } from "react";
import transactionApi from "../../api/transactionApi";
import { FaTimes, FaMoneyBillWave, FaCreditCard, FaMobileAlt, FaCheckCircle, FaLock } from "react-icons/fa";
import "./PaymentModal.css";

export default function PaymentModal({ booking, onClose, onPaymentSuccess }) {
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [upiId, setUpiId] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handlePay = async (e) => {
    e.preventDefault();
    if (paymentMethod === "CARD") {
      if (!cardNumber || cardNumber.length < 16) {
        setErrorMsg("Please enter a valid 16-digit card number.");
        return;
      }
      if (!cardExpiry || !cardCvv) {
        setErrorMsg("Please enter card expiry and CVV.");
        return;
      }
    } else if (paymentMethod === "UPI") {
      if (!upiId || !upiId.includes("@")) {
        setErrorMsg("Please enter a valid UPI ID (e.g., username@upi).");
        return;
      }
    }

    try {
      setSubmitting(true);
      setErrorMsg("");

      const payload = {
        bookingId: booking.id,
        amount: booking.totalPrice,
        paymentMethod: paymentMethod,
        cardNumber: paymentMethod === "CARD" ? cardNumber : null,
        upiId: paymentMethod === "UPI" ? upiId : null,
      };

      const res = await transactionApi.post("/payments", payload);

      if (res.data?.success) {
        setSuccessMsg(`Payment Successful! Transaction ID: ${res.data.data.transactionId}`);
        setTimeout(() => {
          if (onPaymentSuccess) onPaymentSuccess(res.data.data);
          onClose();
        }, 1500);
      }
    } catch (err) {
      setErrorMsg("Payment failed: " + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="payment-modal-overlay">
      <div className="payment-modal-card">
        <button className="close-btn" onClick={onClose}>
          <FaTimes />
        </button>

        <div className="modal-header">
          <span className="modal-badge">FlexServ Secure Checkout</span>
          <h2>Payment for Booking #{booking?.id}</h2>
          <p className="service-title-text">{booking?.serviceName || "Home Service"}</p>
          <div className="amount-highlight">
            Total Payable: <strong>₹{booking?.totalPrice}</strong>
          </div>
        </div>

        {errorMsg && <div className="modal-error-banner">{errorMsg}</div>}
        {successMsg && <div className="modal-success-banner"><FaCheckCircle /> {successMsg}</div>}

        <form onSubmit={handlePay} className="payment-form">
          <label className="form-label">Select Payment Method</label>

          <div className="method-selector">
            <button
              type="button"
              className={`method-tab ${paymentMethod === "CASH" ? "active" : ""}`}
              onClick={() => setPaymentMethod("CASH")}
            >
              <FaMoneyBillWave className="method-icon" />
              <span>Cash</span>
            </button>

            <button
              type="button"
              className={`method-tab ${paymentMethod === "CARD" ? "active" : ""}`}
              onClick={() => setPaymentMethod("CARD")}
            >
              <FaCreditCard className="method-icon" />
              <span>Card</span>
            </button>

            <button
              type="button"
              className={`method-tab ${paymentMethod === "UPI" ? "active" : ""}`}
              onClick={() => setPaymentMethod("UPI")}
            >
              <FaMobileAlt className="method-icon" />
              <span>UPI / QR</span>
            </button>
          </div>

          {/* Cash Details */}
          {paymentMethod === "CASH" && (
            <div className="payment-details-box cash-box">
              <FaMoneyBillWave className="box-icon" />
              <div>
                <h4>Pay Cash on Delivery</h4>
                <p>Pay ₹{booking?.totalPrice} directly in cash to the service provider after completion.</p>
              </div>
            </div>
          )}

          {/* Card Details */}
          {paymentMethod === "CARD" && (
            <div className="payment-details-box">
              <div className="input-group">
                <label>Card Number</label>
                <input
                  type="text"
                  maxLength="16"
                  placeholder="1234 5678 9101 1121"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ""))}
                  required
                />
              </div>

              <div className="input-row">
                <div className="input-group">
                  <label>Expiry (MM/YY)</label>
                  <input
                    type="text"
                    maxLength="5"
                    placeholder="12/28"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    required
                  />
                </div>
                <div className="input-group">
                  <label>CVV</label>
                  <input
                    type="password"
                    maxLength="3"
                    placeholder="123"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ""))}
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* UPI Details */}
          {paymentMethod === "UPI" && (
            <div className="payment-details-box">
              <div className="input-group">
                <label>VPA / UPI ID</label>
                <input
                  type="text"
                  placeholder="yourname@upi or mobile@paytm"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  required
                />
              </div>
              <small className="upi-hint">Instant payment request will be sent to your UPI app.</small>
            </div>
          )}

          <div className="security-note">
            <FaLock /> 256-bit Encrypted & Secure Payment
          </div>

          <div className="modal-footer">
            <button type="button" className="cancel-btn" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="confirm-btn" disabled={submitting}>
              {submitting ? "Processing..." : `Pay ₹${booking?.totalPrice}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
