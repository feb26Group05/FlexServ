import { useState, useEffect } from "react";
import CategoryCard from "./CategoryCard";
import businessApi from "../../api/businessApi";
import "./Categories.css";

import {
  FaBroom,
  FaBolt,
  FaTint,
  FaTools,
  FaPaintRoller,
  FaBug,
} from "react-icons/fa";

export default function CategoryGrid({ selectedCategory, onSelectCategory }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const getCategoryIcon = (name = "") => {
    const n = name.toLowerCase();
    if (n.includes("plumb")) return <FaTint />;
    if (n.includes("electr")) return <FaBolt />;
    if (n.includes("clean")) return <FaBroom />;
    if (n.includes("appliance") || n.includes("ac")) return <FaTools />;
    if (n.includes("paint") || n.includes("carpent")) return <FaPaintRoller />;
    if (n.includes("pest") || n.includes("lawn")) return <FaBug />;
    return <FaTools />;
  };

  const fallbackCategories = [
    {
      id: 1,
      title: "Plumbing",
      name: "Plumbing",
      description: "All kinds of residential and commercial plumbing repair & piping.",
      icon: <FaTint />,
    },
    {
      id: 2,
      title: "Electrical",
      name: "Electrical",
      description: "Appliance repairs, house wiring, and switchboard installation.",
      icon: <FaBolt />,
    },
    {
      id: 3,
      title: "Cleaning",
      name: "Cleaning",
      description: "Deep home cleaning, sofa/carpet shampooing, and sanitation.",
      icon: <FaBroom />,
    },
    {
      id: 4,
      title: "Appliance Repair",
      name: "Appliance Repair",
      description: "Washing machine, refrigerator, microwave, and AC servicing.",
      icon: <FaTools />,
    },
    {
      id: 5,
      title: "Painting & Carpentry",
      name: "Painting & Carpentry",
      description: "Interior wall painting, wood furniture repair, and custom woodwork.",
      icon: <FaPaintRoller />,
    },
    {
      id: 6,
      title: "Pest Control & Lawn Care",
      name: "Pest Control & Lawn Care",
      description: "Residential pest eradication, termite control, and garden care.",
      icon: <FaBug />,
    },
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await businessApi.get("/admin/categories");
        const list = Array.isArray(res.data?.data) ? res.data.data : [];
        if (list.length > 0) {
          setCategories(
            list.map((c) => ({
              id: c.id,
              title: c.name,
              name: c.name,
              description: c.description || `Expert ${c.name} services`,
              icon: getCategoryIcon(c.name),
            }))
          );
        } else {
          setCategories(fallbackCategories);
        }
      } catch (err) {
        console.warn("Could not fetch DB categories, using fallback:", err);
        setCategories(fallbackCategories);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <section className="categories" id="categories-section">
      <h2>Explore Our Categories</h2>
      <p>Click on any category to view available services</p>

      {loading ? (
        <div style={{ textAlign: "center", padding: "2rem", color: "#64748b" }}>
          Loading categories...
        </div>
      ) : (
        <div className="category-grid">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => onSelectCategory && onSelectCategory(category.title)}
              style={{
                cursor: "pointer",
                borderRadius: "12px",
                outline: selectedCategory === category.title ? "3px solid #ff6b00" : "none",
              }}
            >
              <CategoryCard category={category} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}