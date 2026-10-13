import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import "./HealthPackages.css";

const PACKAGES_API = "https://ishah.in/api/lfhospital/packages";
const VISIBLE_COUNT = 3;

const toCard = (pkg) => {
  const totalTests = (pkg.labTests || []).reduce(
    (sum, test) => sum + (test.subTests?.length || 1),
    0
  );
  const meta = [
    `${totalTests} tests`,
    pkg.home_collection_available && "Home collection available",
  ]
    .filter(Boolean)
    .join(" · ");

  return {
    id: pkg._id,
    tag: pkg.package_type?.package_type?.toUpperCase() || "HEALTH PACKAGE",
    title: pkg.package_name,
    description: pkg.description || "Comprehensive health screening package",
    meta,
    price: `₹${Number(pkg.price).toLocaleString("en-IN")}`,
  };
};

export default function HealthPackages() {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        const response = await fetch(PACKAGES_API);
        const data = await response.json();

        if (data.success && Array.isArray(data.packages)) {
          setPackages(
            data.packages
              .filter((pkg) => !pkg.archived)
              .slice(0, VISIBLE_COUNT)
              .map(toCard)
          );
        } else {
          setError("Failed to load packages");
        }
      } catch (err) {
        console.error("Error fetching packages:", err);
        setError("Failed to load packages");
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const detailPath = (id) => `/package-detail-1?package_id=${id}`;

  return (
    <section className="health-packages">
      <div className="packages-header">
        <div>
          <h2 className="packages-title">Health Packages</h2>
          <p className="packages-subtitle">
            Curated checkup bundles with everything you need tests,
            <br />
            consultations, and reports delivered within 24 hours.
          </p>
        </div>

        <button
          className="view-packages-btn"
          onClick={() => navigate("/health-packages")}
        >
          View all packages
        </button>
      </div>

      {loading && <p className="packages-status">Loading packages...</p>}
      {!loading && error && <p className="packages-status">{error}</p>}

      <div className="packages-grid">
        {packages.map((item) => (
          <div className="homepackage-card" key={item.id}>
            <p className="top-package-tag">{item.tag}</p>

            <h3 className="package-title">{item.title}</h3>

            <p className="package-description">
              {item.description}
            </p>

            <p className="package-meta">{item.meta}</p>

            <div className="package-footer">
              <div>
                <h4 className="package-price">{item.price}</h4>
                <p className="package-tax">
                  Inclusive of all taxes
                </p>
              </div>

              <Link to={detailPath(item.id)} className="package-detail">
                View Detail
              </Link>
            </div>

            <button
              className="home-add-plan-btn"
              onClick={() => navigate(detailPath(item.id))}
            >
              Add to plan
              <ArrowRight size={20} />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
