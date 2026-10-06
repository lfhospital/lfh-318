import React from "react";
import "./HealthPackages-checkup.css";
import { Search, ChevronDown } from "lucide-react";
import { useCompare } from "../CompareContext.jsx";

export default function HealthPackagesCheckup() {
  const { compareMode, toggleCompareMode, selectedPackages, maxCompare } =
    useCompare();

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
            <input type="text" placeholder="Search for tests or packages" />
            <Search size={30} strokeWidth={1.5} />
          </div>

          <div className="right-controls">
            <span className="package-count">48 packages available</span>

            <button className="sort-btn">
              Sort By: Recommended
              <ChevronDown size={18} />
            </button>

            <button className="heroplan-btn">
              Your Plan
              <span className="plan-count">0</span>
            </button>
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