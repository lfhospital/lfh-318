import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./PackageSection.css";
import { useCompare } from "../CompareContext.jsx";
import { getPageItems } from "../../../utils/pagination";
import { togglePlanItem, usePlan } from "../../../planStore";

const PAGE_SIZE = 9;

export default function PackageCards({ searchQuery = "", onPackagesFiltered }) {
  const navigate = useNavigate();
  const {
    compareMode,
    selectedPackages,
    togglePackageSelection,
    maxCompare,
  } = useCompare();
  const { isInPlan } = usePlan();

  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const gridRef = useRef(null);

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
              // Everything a user might search by: name, type, concerns, tests
              searchText: [
                pkg.package_name,
                pkg.description,
                pkg.package_type?.package_type,
                ...(pkg.health_concern || []).map((concern) => concern.title),
                ...(pkg.labTests || []).flatMap((test) => [
                  test.labMainTest,
                  ...(test.subTests || []).map((sub) => sub?.name || sub),
                ]),
              ]
                .filter((text) => typeof text === "string")
                .join(" ")
                .toLowerCase(),
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

  const filteredPackages = useMemo(() => {
    const terms = searchQuery.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return packages.filter((pkg) => terms.every((term) => pkg.searchText.includes(term)));
  }, [packages, searchQuery]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  useEffect(() => {
    if (!loading) onPackagesFiltered?.(error ? 0 : filteredPackages.length);
  }, [loading, error, filteredPackages.length]);

  const totalPages = Math.max(1, Math.ceil(filteredPackages.length / PAGE_SIZE));
  const pageStart = (page - 1) * PAGE_SIZE;
  const pagePackages = filteredPackages.slice(pageStart, pageStart + PAGE_SIZE);

  const goToPage = (p) => {
    if (p < 1 || p > totalPages || p === page) return;
    setPage(p);
    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

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
      <section className="package-section" ref={gridRef}>
        {filteredPackages.length === 0 && (
          <p style={{ textAlign: 'center', padding: '2rem', fontSize: '1.2rem' }}>
            No packages match "{searchQuery.trim()}"
          </p>
        )}
        <div className="package-grid">
          {pagePackages.map((item) => {
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

                <button
                  className={`plan-btn ${isInPlan(item.id) ? "in-plan" : ""}`}
                  aria-pressed={isInPlan(item.id)}
                  onClick={() =>
                    togglePlanItem({ id: item.id, title: item.title, price: item.rawData.price })
                  }
                >
                  {isInPlan(item.id) ? "Added to plan" : "Add to plan"}
                  <span>{isInPlan(item.id) ? "✓" : "→"}</span>
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {filteredPackages.length > 0 && (
        <div className="pagination-section">
          <span className="showing-text">
            Showing {pageStart + 1}–{pageStart + pagePackages.length} of {filteredPackages.length} packages
          </span>
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-btn"
                onClick={() => goToPage(page - 1)}
                disabled={page === 1}
              >
                ← Previous
              </button>
              {getPageItems(page, totalPages).map((item) =>
                typeof item === "number" ? (
                  <button
                    key={item}
                    className={`page-number ${item === page ? "active-page" : ""}`}
                    onClick={() => goToPage(item)}
                  >
                    {item}
                  </button>
                ) : (
                  <span key={item} className="pagination-dots">...</span>
                )
              )}
              <button
                className="pagination-btn"
                onClick={() => goToPage(page + 1)}
                disabled={page === totalPages}
              >
                Next →
              </button>
            </div>
          )}
        </div>
      )}

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