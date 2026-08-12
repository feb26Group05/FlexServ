import { useState } from "react";
import transactionApi from "../../api/transactionApi";
import { FaTimes, FaStar, FaCheckCircle, FaUserTie } from "react-icons/fa";
import "./ReviewModal.css";

export default function ReviewModal({ booking, onClose, onReviewSuccess }) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!rating || rating < 1 || rating > 5) {
      setErrorMsg("Please select a rating between 1 and 5 stars.");
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg("");

      const payload = {
        bookingId: booking.id,
        rating: rating,
        comment: comment,
      };

      const res = await transactionApi.post("/reviews", payload);

      if (res.data?.success) {
        setSuccessMsg("Thank you! Review submitted successfully.");
        setTimeout(() => {
          if (onReviewSuccess) onReviewSuccess(res.data.data);
          onClose();
        }, 1500);
      }
    } catch (err) {
      setErrorMsg("Failed to submit review: " + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="review-modal-overlay">
      <div className="review-modal-card">
        <button className="close-btn" onClick={onClose}>
          <FaTimes />
        </button>

        <div className="modal-header">
          <span className="modal-badge">Service Feedback</span>
          <h2>Review Service Provider</h2>
          <p className="provider-info-line">
            <FaUserTie /> {booking?.providerCompanyName || "Assigned Provider"}
          </p>
          <p className="service-name-sub">Service: <strong>{booking?.serviceName}</strong></p>
        </div>

        {errorMsg && <div className="modal-error-banner">{errorMsg}</div>}
        {successMsg && <div className="modal-success-banner"><FaCheckCircle /> {successMsg}</div>}

        <form onSubmit={handleSubmitReview} className="review-form">
          <div className="rating-section">
            <label>Rate Your Experience</label>
            <div className="stars-picker">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  className={`star-icon ${(hoverRating || rating) >= star ? "filled" : ""}`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                />
              ))}
            </div>
            <span className="rating-label">
              {rating === 5 && "⭐ Excellent Service!"}
              {rating === 4 && "👍 Very Good"}
              {rating === 3 && "😐 Average"}
              {rating === 2 && "👎 Poor Experience"}
              {rating === 1 && "😡 Very Dissatisfied"}
            </span>
          </div>

          <div className="form-group">
            <label>Write Your Feedback / Comments</label>
            <textarea
              rows="4"
              placeholder="Tell us about the quality of service, provider behavior, punctuality..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="modal-textarea"
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="cancel-btn" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="confirm-btn" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
