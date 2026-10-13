import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./BrowseBySpecialty.css";
import { ArrowRight } from "lucide-react";

const API_URL = "https://ishah.in/api/lfhospital/specialities/departments";

export default function BrowseBySpecialty({ searchTerm = "" }) {
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredSpecialties = normalizedSearch
    ? specialties.filter((specialty) =>
        `${specialty.name} ${specialty.description}`
          .toLowerCase()
          .includes(normalizedSearch)
      )
    : specialties;

  useEffect(() => {
    let isMounted = true;

    async function fetchSpecialties() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();

        if (!data?.success || !Array.isArray(data?.specialist)) {
          throw new Error("Unexpected response from departments API");
        }

        if (isMounted) {
          const mapped = data.specialist
            .filter((item) => item.isActive)
            .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
            .map((item, index) => ({
              id: item._id,
              number: String(index + 1).padStart(2, "0"),
              name: item.name?.trim() || "Specialty",
              description: item.description?.trim() || "",
            }));

          setSpecialties(mapped);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to load specialties");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchSpecialties();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="browse-specialty-section">

      <div className="browse-specialty-container">

        {/* Heading */}
        <p className="browse-specialty-heading">
          BROWSE BY SPECIALTY
        </p>

        {loading && (
          <p className="specialty-status">Loading specialties...</p>
        )}

        {!loading && error && (
          <p className="specialty-status specialty-status-error">
            Unable to load specialties: {error}
          </p>
        )}

        {!loading && !error && (
          <>
            {normalizedSearch && filteredSpecialties.length === 0 && (
              <p className="specialty-status">
                No specialties found for "{searchTerm}"
              </p>
            )}

            {/* Specialty Grid */}
            <div className="specialty-grid">
              {filteredSpecialties.map((specialty) => (
                <Link
                  to={`/doctors?department=${specialty.id}`}
                  className="specialty-card"
                  key={specialty.id}
                >

                  <span className="specialty-number">
                    {specialty.number}
                  </span>

                  <div className="specialty-content">
                    <h3 className="specialty-name">
                      {specialty.name}
                    </h3>

                    {specialty.description && (
                      <p className="specialty-description">
                        {specialty.description}
                      </p>
                    )}
                  </div>

                </Link>
              ))}
            </div>

            {/* Bottom Help Section */}
            <div className="specialty-bottom">

              <div className="specialty-help">
                <h3>Got questions about booking?</h3>

                <p>
                  Booking guidance, insurance, second opinion. All in one place
                </p>
              </div>

              <a href="#" className="visit-help">
                <span>Visit help centre</span>
                <ArrowRight size={16} />
              </a>

            </div>
          </>
        )}

      </div>

    </section>
  );
}
