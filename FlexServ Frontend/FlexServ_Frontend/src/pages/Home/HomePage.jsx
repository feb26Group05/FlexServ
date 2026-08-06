import { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Hero from "../../components/Hero/Hero";
import CategoryGrid from "../../components/Categories/CategoryGrid";
import PopularServices from "../../components/Services/PopularServices";
import WhyChoose from "../../components/WhyChoose/WhyChoose";
import Professionals from "../../components/Professionals/Professionals";
import HowItWorks from "../../components/HowItWorks/HowItWorks";
import Testimonials from "../../components/Testimonials/Testimonials";
import Footer from "../../components/Footer/Footer";
import BookingModal from "../../components/Booking/BookingModal";
import "./HomePage.css";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeBookingService, setActiveBookingService] = useState(null);

  const handleCategorySelect = (categoryTitle) => {
    if (selectedCategory === categoryTitle) {
      setSelectedCategory("All");
    } else {
      setSelectedCategory(categoryTitle);
    }
    const el = document.getElementById("services-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleTagClick = (tag) => {
    setSearchQuery(tag);
    const el = document.getElementById("services-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="home-container">
      <Navbar />

      <Hero
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onTagClick={handleTagClick}
      />

      <CategoryGrid
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategorySelect}
      />

      <PopularServices
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
        onBookService={(service) => setActiveBookingService(service)}
      />

      <WhyChoose />

      <Professionals />

      <HowItWorks />

      <Testimonials />

      <Footer />

      {activeBookingService && (
        <BookingModal
          service={activeBookingService}
          onClose={() => setActiveBookingService(null)}
          onBookingSuccess={() => {
            console.log("Booking created successfully!");
          }}
        />
      )}
    </div>
  );
}