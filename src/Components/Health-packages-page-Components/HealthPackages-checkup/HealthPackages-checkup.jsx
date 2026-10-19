import React, { useEffect, useRef, useState } from "react";
import "./HealthPackages-checkup.css";
import { Search, ChevronDown, X } from "lucide-react";
import { useCompare } from "../CompareContext.jsx";
import { clearPlan, formatRupees, removeFromPlan, usePlan } from "../../../planStore";

export default function HealthPackagesCheckup({
  searchQuery = "",
  onSearchChange,
  packageCount = null,
}) {
  const { compareMode, toggleCompareMode, selectedPackages, maxCompare } =
    useCompare();
  const { items: planItems, total: planTotal } = usePlan();
  const [planOpen, setPlanOpen] = useState(false);
  const planRef = useRef(null);

  // Close the plan dropdown on an outside click or Escape
  useEffect(() => {
    if (!planOpen) return;
    const handleClick = (e) => {
      if (!planRef.current?.contains(e.target)) setPlanOpen(false);
    };
    const handleKey = (e) => e.key === "Escape" && setPlanOpen(false);
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [planOpen]);

  return (
    <section className="health-packages-section">
      <div className="health-content">
        <span className="section-label">DIAGNOSTICS · PREVENTIVE CARE</span>

        <h1 className="main-heading">
          Health packages
          <br />
          & checkups
        </h1>

        <p className="description">
          From routine health panels to advanced screenings, our services
          combine accurate diagnostics with seamless access to preventive care.
        </p>

        <div className="search-row">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search for tests or packages"
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
            />
            <Search size={30} strokeWidth={1.5} />
          </div>

          <div className="right-controls">
            <span className="package-count">
              {packageCount == null
                ? "Loading packages..."
                : `${packageCount} ${packageCount === 1 ? "package" : "packages"} ${
                    searchQuery.trim() ? "found" : "available"
                  }`}
            </span>

            <button className="sort-btn">
              Sort By: Recommended
              <ChevronDown size={18} />
            </button>

            <div className="plan-menu" ref={planRef}>
              <button
                className="heroplan-btn"
                aria-expanded={planOpen}
                onClick={() => setPlanOpen((open) => !open)}
              >
                Your Plan
                <span className="plan-count">{planItems.length}</span>
              </button>

              {planOpen && (
                <div className="plan-dropdown" role="dialog" aria-label="Your plan">
                  {planItems.length === 0 ? (
                    <p className="plan-empty">
                      No packages yet. Use “Add to plan” on any package.
                    </p>
                  ) : (
                    <>
                      <ul className="plan-list">
                        {planItems.map((item) => (
                          <li key={item.id}>
                            <span className="plan-item-title">{item.title}</span>
                            <span className="plan-item-price">{formatRupees(item.price)}</span>
                            <button
                              className="plan-remove"
                              aria-label={`Remove ${item.title} from plan`}
                              onClick={() => removeFromPlan(item.id)}
                            >
                              <X size={14} />
                            </button>
                          </li>
                        ))}
                      </ul>
                      <div className="plan-total">
                        <span>Total</span>
                        <strong>{formatRupees(planTotal)}</strong>
                      </div>
                      <button className="plan-clear" onClick={clearPlan}>
                        Clear plan
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="filters-row">
          <div className="filters-left">
            <div className="filter-group">
              <label>CATEGORY</label>
              <button>
                Select
                <ChevronDown size={16} />
              </button>
            </div>

            <div className="filter-group">
              <label>KEY TESTS</label>
              <button>
                Select
                <ChevronDown size={16} />
              </button>
            </div>

            <div className="filter-group">
              <label>GENDER</label>
              <button>
                Any
                <ChevronDown size={16} />
              </button>
            </div>

            <div className="filter-group">
              <label>AGE GROUP</label>
              <button>
                30-45
                <ChevronDown size={16} />
              </button>
            </div>

            <div className="filter-group price-filter">
              <label>PRICE RANGE</label>
              <button>
                ₹800 - ₹1800
                <ChevronDown size={16} />
              </button>
            </div>
          </div>

          <div className="filters-right">
            <div className="toggle-item">
              <span>Home sample collection</span>

              <label className="switch">
                <input type="checkbox" />
                <span className="slider"></span>
              </label>
            </div>

            <div className="toggle-item">
              <span>
                Compare 
              </span>

              <label className="switch">
                <input
                  type="checkbox"
                  checked={compareMode}
                  onChange={toggleCompareMode}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}