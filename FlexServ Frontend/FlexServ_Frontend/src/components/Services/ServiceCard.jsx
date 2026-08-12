export default function ServiceCard({ service, onBook }) {
    const imageUrl =
      service.image ||
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=700";
  
    return (
      <div className="service-card">
        <img src={imageUrl} alt={service.name || service.title} />
  
        <div className="service-content">
          <h3>{service.name || service.title}</h3>
  
          <span>⭐ {service.rating || "4.9"} ({service.bookings || "1.2k"})</span>
  
          <p>Starting from ₹{service.price}</p>
  
          <button onClick={() => onBook && onBook(service)}>
            Book Now
          </button>
        </div>
      </div>
    );
  }