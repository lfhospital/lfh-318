import React, { useEffect, useState } from "react";
import "./BrowseBySpecialty.css";
import { ArrowRight } from "lucide-react";

const API_URL = "https://ishah.in/api/lfhospital/specialities";

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
          throw new Error("Unexpected response from specialties API");
        }

        if (isMounted) {
          const mapped = data.specialist.map((item, index) => ({
            number: String(index + 1).padStart(2, "0"),
            name: item.label?.trim() || item.value?.trim() || "Specialty",
            description: item.specialistDescription?.trim() || "",
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
              {filteredSpecialties.map((specialty, index) => (
                <div className="specialty-card" key={index}>

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

                </div>
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
