import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import "./Hero.css";

export default function Hero() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e?.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/services?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate("/services");
    }
  };

  const handleTagClick = (tag) => {
    navigate(`/services?search=${encodeURIComponent(tag)}`);
  };

  return (
    <section className="hero">
      <div className="hero-left">
        <h1>
          Home Services
          <br />
          At Your
          <span>Doorstep</span>
        </h1>

        <p>
          Book trusted professionals for cleaning, beauty, repairs and maintenance in just a few clicks.
        </p>

        <form className="search-box" onSubmit={handleSearch}>
          <FaSearch />
          <input
            type="text"
            placeholder="Search AC Repair, Cleaning..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>

        <div className="popular-tags">
          <button type="button" onClick={() => handleTagClick("Cleaning")}>
            Cleaning
          </button>
          <button type="button" onClick={() => handleTagClick("AC Repair")}>
            AC Repair
          </button>
          <button type="button" onClick={() => handleTagClick("Electrician")}>
            Electrician
          </button>
          <button type="button" onClick={() => handleTagClick("Salon")}>
            Salon
          </button>
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