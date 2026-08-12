import { useState, useEffect } from "react";
import ServiceCard from "./ServiceCard";
import businessApi from "../../api/businessApi";
import "./Services.css";

export default function PopularServices({ searchQuery, selectedCategory, onBookService }) {
  const [dbServices, setDbServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fallbackServices = [
    {
      id: 1,
      name: "Leaky Pipe Repair",
      categoryName: "Plumbing",
      price: "450.00",
      duration: 60,
      rating: "4.8",
      bookings: "1.2k",
      image: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=700",
      description: "Fixing minor to major water pipeline leaks and joint sealings."
    },
    {
      id: 2,
      name: "Fan Installation",
      categoryName: "Electrical",
      price: "300.00",
      duration: 45,
      rating: "4.7",
      bookings: "950",
      image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=700",
      description: "Unboxing and ceiling mount installation of standard and decorative ceiling fans."
    },
    {
      id: 3,
      name: "Full House Deep Cleaning",
      categoryName: "Cleaning",
      price: "2500.00",
      duration: 240,
      rating: "4.9",
      bookings: "2.5k",
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=700",
      description: "Complete wiping, mopping, deep scrubbing, and vacuuming of a standard 2BHK flat."
    },
    {
      id: 4,
      name: "Bathroom Tap & Shower Fitting",
      categoryName: "Plumbing",
      price: "600.00",
      duration: 90,
      rating: "4.8",
      bookings: "1.1k",
      image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=700",
      description: "Installation and replacement of bathroom faucets, mixers, and shower heads."
    },
    {
      id: 5,
      name: "Drain Blockage Removal",
      categoryName: "Plumbing",
      price: "800.00",
      duration: 120,
      rating: "4.9",
      bookings: "1.4k",
      image: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=700",
      description: "Professional unclogging of kitchen sinks, bathroom drains, and main waste pipes."
    },
    {
      id: 6,
      name: "AC Service & Gas Refill",
      categoryName: "Appliance Repair",
      price: "1500.00",
      duration: 90,
      rating: "4.9",
      bookings: "3.2k",
      image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=700",
      description: "Complete indoor/outdoor unit wash, filter cleaning, and refrigerant gas top-up."
    },
    {
      id: 7,
      name: "Refrigerator Repair & Diagnostics",
      categoryName: "Appliance Repair",
      price: "750.00",
      duration: 60,
      rating: "4.8",
      bookings: "1.6k",
      image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=700",
      description: "Compressor checkup, cooling coil inspection, and thermostat replacement."
    },
    {
      id: 8,
      name: "Sofa & Carpet Shampooing",
      categoryName: "Cleaning",
      price: "1200.00",
      duration: 150,
      rating: "4.9",
      bookings: "2.1k",
      image: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=700",
      description: "Foam wash and deep extraction cleaning of 5-seater sofa set and carpet."
    },
    {
      id: 9,
      name: "Complete House Wiring Inspection",
      categoryName: "Electrical",
      price: "1800.00",
      duration: 180,
      rating: "4.9",
      bookings: "800",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=700",
      description: "Diagnostic safety check of circuit breakers, distribution boards, and grounding."
    },
    {
      id: 10,
      name: "Switchboard & MCB Replacement",
      categoryName: "Electrical",
      price: "450.00",
      duration: 45,
      rating: "4.7",
      bookings: "1.3k",
      image: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=700",
      description: "Replacing burnt or damaged electrical switches, sockets, and miniature circuit breakers."
    },
    {
      id: 11,
      name: "Kitchen Chimney Cleaning",
      categoryName: "Cleaning",
      price: "999.00",
      duration: 90,
      rating: "4.8",
      bookings: "1.7k",
      image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=700",
      description: "Degreasing of filter mesh, motor duct cleaning, and outer body polish."
    },
    {
      id: 12,
      name: "Wall Painting Touch-up",
      categoryName: "Painting & Carpentry",
      price: "3500.00",
      duration: 300,
      rating: "4.9",
      bookings: "1.1k",
      image: "https://images.unsplash.com/photo-1562259949-e8bd807712a5?w=700",
      description: "Patchwork repair, putty sanding, and dual-coat emulsion painting for room walls."
    }
  ];

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const res = await businessApi.get("/admin/services");
        const list = Array.isArray(res.data?.data) ? res.data.data : [];
        if (list.length > 0) {
          setDbServices(list);
        } else {
          setDbServices(fallbackServices);
        }
      } catch (err) {
        console.warn("Could not fetch DB services, using fallback:", err);
        setDbServices(fallbackServices);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const filteredServices = dbServices.filter((service) => {
    const nameStr = (service.name || service.title || "").toLowerCase();
    const catStr = (service.categoryName || service.category?.name || "").toLowerCase();
    const descStr = (service.description || "").toLowerCase();

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!nameStr.includes(q) && !catStr.includes(q) && !descStr.includes(q)) return false;
    }

    if (selectedCategory && selectedCategory !== "All") {
      const cat = selectedCategory.toLowerCase();
      const isMatch = catStr.includes(cat) || cat.includes(catStr) || nameStr.includes(cat);
      if (!isMatch) return false;
    }

    return true;
  });

  return (
    <section className="popular-services" id="services-section">
      <h2>Popular Services</h2>
      <p>Book trusted professionals for home services in just a few clicks</p>

      {loading ? (
        <div style={{ textAlign: "center", padding: "2rem", color: "#64748b" }}>
          Loading available services...
        </div>
      ) : filteredServices.length === 0 ? (
        <div style={{ textAlign: "center", padding: "2rem", color: "#94a3b8" }}>
          No services matching your search filter.
        </div>
      ) : (
        <div className="service-grid">
          {filteredServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onBook={onBookService}
            />
          ))}
        </div>
      )}
    </section>
  );
}