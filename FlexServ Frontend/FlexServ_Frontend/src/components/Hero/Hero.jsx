import { FaSearch } from "react-icons/fa";
import "./Hero.css";

export default function Hero({ searchQuery, onSearchChange, onTagClick }) {
  const popularTags = ["Plumbing", "Electrical", "Cleaning", "Appliance Repair", "Painting"];

  return (
    <section className="hero">
      <div className="hero-left">
        <h1>
          Home Services
          <br />
          At Your
          <span> Doorstep</span>
        </h1>

        <p>
          Book trusted professionals for cleaning, plumbing, electrical, repairs and maintenance in just a few clicks.
        </p>

        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Search Plumbing, Electrical, Cleaning, Appliance Repair..."
            value={searchQuery}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
          />
          <button onClick={() => {
            const el = document.getElementById("services-section");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}>
            Search
          </button>
        </div>

        <div className="popular-tags">
          {popularTags.map((tag) => (
            <button key={tag} onClick={() => onTagClick && onTagClick(tag)}>
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="hero-right">
        <img
          src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=900"
          alt="professional"
        />
      </div>
    </section>
  );
}