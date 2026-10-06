import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./PackageSection.css";
import { useCompare } from "../CompareContext.jsx";

export default function PackageCards() {
  const navigate = useNavigate();
  const {
    compareMode,
    selectedPackages,
    togglePackageSelection,
    maxCompare,
  } = useCompare();

  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://ishah.in/api/lfhospital/packages');
        const data = await response.json();
        
        if (data.success && data.packages) {
          // Transform API data to match component structure
          const transformedPackages = data.packages.map((pkg) => {
            // Count total tests
            const totalTests = pkg.labTests.reduce((sum, test) => {
              return sum + (test.subTests?.length || 1);
            }, 0);

            // Get target audience for category
            const audienceText = pkg.target_audience?.join(', ') || 'All';
            const categoryText = `${pkg.package_type?.package_type?.toUpperCase() || 'HEALTH PACKAGE'}`;

            return {
              id: pkg._id,
              category: categoryText,
              title: pkg.package_name,
              booked: "", // API doesn't provide booking count
              description: pkg.description || "Comprehensive health screening package",
              tests: `${totalTests} tests${pkg.home_collection_available ? ' · Home collection available' : ''}`,
              price: `₹${pkg.price}`,
              rawData: pkg // Store original data for future use
            };
          });
          
          setPackages(transformedPackages);
        }
      } catch (err) {
        console.error('Error fetching packages:', err);
        setError('Failed to load packages');
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  if (loading) {
    return (
      <section className="package-section">
        <div className="package-grid">
          <p style={{ textAlign: 'center', padding: '2rem', fontSize: '1.2rem' }}>Loading packages...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="package-section">
        <div className="package-grid">
          <p style={{ textAlign: 'center', padding: '2rem', fontSize: '1.2rem', color: 'red' }}>{error}</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="package-section">
        <div className="package-grid">
          {packages.map((item) => {
            const isSelected = selectedPackages.includes(item.id);
            const limitReached =
              !isSelected && selectedPackages.length >= maxCompare;

            return (
              <div className="healthpackage-card" key={item.id}>
                <div className="card-top-row">
                  <span className="package-tag">{item.category}</span>

                  {compareMode && (
                    <div className="compare-box">
                      <span className="compare-count">
                        {selectedPackages.length}/{maxCompare}
                      </span>

                      <label
                        className={`compare-checkbox ${limitReached ? "disabled" : ""
                          }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          disabled={limitReached}
                          onChange={() => togglePackageSelection(item.id)}
                        />
                        <span className="checkbox-custom"></span>
                      </label>
                    </div>
                  )}
                </div>

                <h2>{item.title}</h2>
                {item.booked && <p className="booked-text">{item.booked}</p>}
                <p className="description-text">{item.description}</p>
                <p className="tests-text">{item.tests}</p>

                <div className="price-section">
                  <div>
                    <h3>{item.price}</h3>
                    <span>Inclusive of all taxes</span>
                  </div>
                  <button
                    className="detail-btn"
                    onClick={() => navigate(`/package-detail-1?package_id=${item.id}`)}
                  >
                    View Detail
                  </button>
                </div>

                <button className="plan-btn">
                  Add to plan
                  <span>→</span>
                </button>
              </div>
            );
          })}
        </div>
      </section>

      <div className="pagination-section">
        <span className="showing-text">Showing 1–{packages.length} of {packages.length} packages</span>
        <div className="pagination">
          <button className="pagination-btn">← Previous</button>
          <button className="page-number active-page">1</button>
          <button className="page-number">2</button>
          <button className="page-number">3</button>
          <span className="pagination-dots">...</span>
          <button className="pagination-btn">Next →</button>
        </div>
      </div>

      <div className="carthelp-section">
        <div className="help-content">
          <h2>Not sure which package fits?</h2>

          <p>Booking guidance, insurance, second opinion. All in one place</p>
        </div>

        <button className="team-btn">
          <span className="team-text">Talk to our team</span>
          <span className="team-arrow">→</span>
        </button>
      </div>
    </>
  );
}