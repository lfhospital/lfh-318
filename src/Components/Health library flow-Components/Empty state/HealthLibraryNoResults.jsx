import React, { useState } from "react";
import { Search, ArrowRight } from "lucide-react";
import "./HealthLibraryNoResults.css";
import Navbar from "../../Home-page-Components/Navbar/Navbar";
import Footer from "../../Home-page-Components/Footer/HomeFooter";
import { navigateTo } from "../../../navigation";

const openList = (params) => navigateTo("List", params);

export default function HealthLibraryNoResults() {
  const [query, setQuery] = useState("");
  const search = () => openList({ query: query.trim() });

  return (
    <>
      <Navbar active="Health Library" />
      <div className="hlnr-no-results-page">
        {/* =====================================================
          HEADER
      ===================================================== */}

        <header className="hlnr-header">
          <div className="hlnr-header-label">HEALTH LIBRARY</div>

          <h1 className="hlnr-main-title">
            The Health
            <br />
            Library.
          </h1>

          <p className="hlnr-header-description">
            Clear, doctor-reviewed answers about conditions, treatments,
            medicines and tests, so you can
            <br />
            understand your health and confidently take the next step.
          </p>
        </header>

        {/* =====================================================
          SEARCH + FILTER AREA
      ===================================================== */}

        <main className="hlnr-library-content">
          {/* ===================================================
            FILTER SIDEBAR
        =================================================== */}

          <aside className="hlnr-filter-sidebar">
            {/* Filter header */}

            <div className="hlnr-filter-header">
              <h2>Filters</h2>

              <button className="hlnr-clear-button" onClick={() => openList()}>
                Clear all (4)
              </button>
            </div>

            {/* Condition type */}

            <div className="hlnr-filter-group">
              <label className="hlnr-filter-label">Condition type</label>

              <div className="hlnr-small-search">
                <Search size={12} />

                <input type="text" placeholder="Search condition" />
              </div>

              {/* Selected tags */}

              <div className="hlnr-filter-tags">
                <span className="hlnr-filter-tag">
                  Cardiology
                  <span>×</span>
                </span>

                <span className="hlnr-filter-tag">
                  Cardiology
                  <span>×</span>
                </span>

                <span className="hlnr-filter-tag">
                  Cardiology
                  <span>×</span>
                </span>
              </div>

              {/* Condition checkboxes */}

              <div className="hlnr-checkbox-list">
                <label className="hlnr-checkbox-row">
                  <input type="checkbox" />
                  <span className="hlnr-checkbox"></span>
                  <span>Diseases</span>
                </label>

                <label className="hlnr-checkbox-row checked">
                  <input type="checkbox" defaultChecked />
                  <span className="hlnr-checkbox"></span>
                  <span>Treatments</span>
                </label>

                <label className="hlnr-checkbox-row">
                  <input type="checkbox" />
                  <span className="hlnr-checkbox"></span>
                  <span>Tests</span>
                </label>

                <label className="hlnr-checkbox-row">
                  <input type="checkbox" />
                  <span className="hlnr-checkbox"></span>
                  <span>Symptoms</span>
                </label>

                <label className="hlnr-checkbox-row">
                  <input type="checkbox" />
                  <span className="hlnr-checkbox"></span>
                  <span>Cardiology</span>
                </label>

                <label className="hlnr-checkbox-row checked">
                  <input type="checkbox" defaultChecked />
                  <span className="hlnr-checkbox"></span>
                  <span>Cardiology</span>
                </label>
              </div>
            </div>

            {/* Specialty */}

            <div className="hlnr-filter-group hlnr-specialty-group">
              <label className="hlnr-filter-label">Specialty</label>

              <div className="hlnr-small-search">
                <Search size={12} />

                <input type="text" placeholder="Search specialty" />
              </div>

              <div className="hlnr-checkbox-list">
                <label className="hlnr-checkbox-row">
                  <input type="checkbox" />
                  <span className="hlnr-checkbox"></span>
                  <span>Cardiology</span>
                </label>

                <label className="hlnr-checkbox-row">
                  <input type="checkbox" />
                  <span className="hlnr-checkbox"></span>
                  <span>Oncology</span>
                </label>

                <label className="hlnr-checkbox-row">
                  <input type="checkbox" />
                  <span className="hlnr-checkbox"></span>
                  <span>Endocrinology</span>
                </label>

                <label className="hlnr-checkbox-row">
                  <input type="checkbox" />
                  <span className="hlnr-checkbox"></span>
                  <span>Cardiology</span>
                </label>

                <label className="hlnr-checkbox-row">
                  <input type="checkbox" />
                  <span className="hlnr-checkbox"></span>
                  <span>Oncology</span>
                </label>

                <label className="hlnr-checkbox-row">
                  <input type="checkbox" />
                  <span className="hlnr-checkbox"></span>
                  <span>Endocrinology</span>
                </label>
              </div>

              <button className="hlnr-more-languages" onClick={() => openList()}>
                +7 more languages
              </button>
            </div>
          </aside>

          {/* ===================================================
            RESULTS AREA
        =================================================== */}

          <section className="hlnr-results">
            {/* Main search */}

            <div className="hlnr-main-search">
              <input
                type="text"
                placeholder="Search conditions, treatment, symptoms and more"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && search()}
              />

              <button aria-label="Search" onClick={search}>
                <Search size={17} />
              </button>
            </div>

            {/* =================================================
              NO RESULTS
          ================================================= */}

            <div className="hlnr-no-results">
              <h2>No results for “coronary artery disease”</h2>

              <p>
                We couldn't find any matching topics. Check your
                <br />
                spelling, try a broader term, or browse by category.
              </p>

              <button
                className="hlnr-search-instead"
                onClick={() => openList({ query: "coronary artery disease" })}
              >
                Search “coronary artery disease” instead
              </button>
            </div>
          </section>
        </main>

        {/* =====================================================
          BOTTOM HELP
      ===================================================== */}

        <footer className="hlnr-help-section">
          <div className="hlnr-help-text">
            <h2>Got questions about booking?</h2>

            <p>Booking guidance, insurance, second opinion. All in one place</p>
          </div>

          <button className="hlnr-help-link" onClick={() => navigateTo("ContactUs")}>
            <span>Visit help centre</span>

            <ArrowRight size={16} />
          </button>
        </footer>
      </div>
      <Footer />
    </>
  );
}
