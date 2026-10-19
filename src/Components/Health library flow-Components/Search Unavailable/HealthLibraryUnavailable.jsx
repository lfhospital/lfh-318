import React, { useState } from "react";
import { Search, ArrowRight } from "lucide-react";
import "./HealthLibraryUnavailable.css";
import Navbar from "../../Home-page-Components/Navbar/Navbar";
import Footer from "../../Home-page-Components/Footer/HomeFooter";
import { navigateTo } from "../../../navigation";

const openList = (params) => navigateTo("List", params);

export default function HealthLibraryUnavailable() {
  const [query, setQuery] = useState("");
  const search = () => openList({ query: query.trim() });

  return (
    <>
      <Navbar active="Health Library" />
      <div className="hlu-page">
        {/* =====================================================
          HEADER
      ===================================================== */}

        <header className="hlu-header">
          <div className="hlu-label">HEALTH LIBRARY</div>

          <h1 className="hlu-title">
            The Health
            <br />
            Library.
          </h1>

          <p className="hlu-description">
            Clear, doctor-reviewed answers about conditions, treatments,
            medicines and tests, so you can
            <br />
            understand your health and confidently take the next step.
          </p>
        </header>

        {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

        <main className="hlu-content">
          {/* ===================================================
            FILTER SIDEBAR
        =================================================== */}

          <aside className="hlu-sidebar">
            {/* Filter Header */}

            <div className="hlu-filter-header">
              <h2>Filters</h2>

              <button className="hlu-clear" onClick={() => openList()}>Clear all (4)</button>
            </div>

            {/* =================================================
              CONDITION TYPE
          ================================================= */}

            <div className="hlu-filter-group">
              <label className="hlu-filter-label">Condition type</label>

              <div className="hlu-small-search">
                <Search size={12} />

                <input type="text" placeholder="Search condition" />
              </div>

              {/* Selected filters */}

              <div className="hlu-tags">
                <span className="hlu-tag">
                  Cardiology
                  <span>×</span>
                </span>

                <span className="hlu-tag">
                  Cardiology
                  <span>×</span>
                </span>

                <span className="hlu-tag">
                  Cardiology
                  <span>×</span>
                </span>
              </div>

              {/* Condition checkboxes */}

              <div className="hlu-checkbox-list">
                <label className="hlu-checkbox-row">
                  <input type="checkbox" />
                  <span className="hlu-checkbox"></span>
                  <span>Diseases</span>
                </label>

                <label className="hlu-checkbox-row is-checked">
                  <input type="checkbox" defaultChecked />
                  <span className="hlu-checkbox"></span>
                  <span>Treatments</span>
                </label>

                <label className="hlu-checkbox-row">
                  <input type="checkbox" />
                  <span className="hlu-checkbox"></span>
                  <span>Tests</span>
                </label>

                <label className="hlu-checkbox-row">
                  <input type="checkbox" />
                  <span className="hlu-checkbox"></span>
                  <span>Symptoms</span>
                </label>

                <label className="hlu-checkbox-row">
                  <input type="checkbox" />
                  <span className="hlu-checkbox"></span>
                  <span>Cardiology</span>
                </label>

                <label className="hlu-checkbox-row is-checked">
                  <input type="checkbox" defaultChecked />
                  <span className="hlu-checkbox"></span>
                  <span>Cardiology</span>
                </label>
              </div>
            </div>

            {/* =================================================
              SPECIALTY
          ================================================= */}

            <div className="hlu-filter-group hlu-specialty">
              <label className="hlu-filter-label">Specialty</label>

              <div className="hlu-small-search">
                <Search size={12} />

                <input type="text" placeholder="Search specialty" />
              </div>

              <div className="hlu-checkbox-list">
                <label className="hlu-checkbox-row">
                  <input type="checkbox" />
                  <span className="hlu-checkbox"></span>
                  <span>Cardiology</span>
                </label>

                <label className="hlu-checkbox-row">
                  <input type="checkbox" />
                  <span className="hlu-checkbox"></span>
                  <span>Oncology</span>
                </label>

                <label className="hlu-checkbox-row">
                  <input type="checkbox" />
                  <span className="hlu-checkbox"></span>
                  <span>Endocrinology</span>
                </label>

                <label className="hlu-checkbox-row">
                  <input type="checkbox" />
                  <span className="hlu-checkbox"></span>
                  <span>Cardiology</span>
                </label>

                <label className="hlu-checkbox-row">
                  <input type="checkbox" />
                  <span className="hlu-checkbox"></span>
                  <span>Oncology</span>
                </label>

                <label className="hlu-checkbox-row">
                  <input type="checkbox" />
                  <span className="hlu-checkbox"></span>
                  <span>Endocrinology</span>
                </label>
              </div>

              <button className="hlu-more" onClick={() => openList()}>
                +7 more languages
              </button>
            </div>
          </aside>

          {/* ===================================================
            RIGHT / RESULTS AREA
        =================================================== */}

          <section className="hlu-results">
            {/* Main search */}

            <div className="hlu-main-search">
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
              TEMPORARILY UNAVAILABLE STATE
          ================================================= */}

            <div className="hlu-unavailable">
              <h2>Search is temporarily unavailable</h2>

              <p>
                We couldn't reach the library right now. This is usually a
                <br />
                brief network issue — please try again in a moment.
              </p>

              {/* Buttons */}

              <div className="hlu-actions">
                <button className="hlu-retry" onClick={search}>
                  Try again
                </button>

                <button className="hlu-home" onClick={() => navigateTo("healthLibraryHero")}>
                  Back to library home
                </button>
              </div>
            </div>
          </section>
        </main>

        {/* =====================================================
          BOTTOM HELP
      ===================================================== */}

        <footer className="hlu-help">
          <div className="hlu-help-content">
            <h2>Got questions about booking?</h2>

            <p>Booking guidance, insurance, second opinion. All in one place</p>
          </div>

          <button className="hlu-help-link" onClick={() => navigateTo("ContactUs")}>
            <span>Visit help centre</span>

            <ArrowRight size={16} />
          </button>
        </footer>
      </div>
      <Footer />
    </>
  );
}
