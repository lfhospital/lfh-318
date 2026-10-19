import React from "react";
import "./HealthLibrary.css";
import { Link } from "react-router-dom";
import { Search, ArrowRight } from "lucide-react";

export default function HealthLibrary() {
  const categories = [
    {
      number: "01",
      title: "Diseases & Conditions",
      slug: "diseases",
      description: "From everyday ailments to complex chronic conditions.",
    },
    {
      number: "02",
      title: "Treatments & Procedures",
      slug: "treatments",
      description: "What to expect, step by step, before and after.",
    },
    {
      number: "03",
      title: "Symptoms Guide",
      slug: "symptoms",
      description: "Understand what your symptoms could mean.",
    },
    {
      number: "04",
      title: "Health Technology",
      slug: "technology",
      description: "How modern diagnostics and devices work.",
    },
    {
      number: "05",
      title: "Medicines",
      slug: "medicines",
      description: "Uses, dosage, side effects and precautions.",
    },
    {
      number: "06",
      title: "Diagnostics & Tests",
      slug: "tests",
      description: "What each test measures and how to prepare",
    },
  ];

  return (
    <>
      <section className="hl-library">
        {/* ================= HERO CONTENT ================= */}
        <div className="hl-container">
          <div className="hl-label">HEALTH LIBRARY</div>

          <h1 className="hl-title">
            The Health
            <br />
            Library.
          </h1>

          <p className="hl-description">
            Clear, doctor-reviewed answers about conditions, treatments,
            medicines and tests, so you can
            <br />
            understand your health and confidently take the next step.
          </p>

          {/* ================= SEARCH ================= */}
          <div className="hl-search-box">
            <input
              type="text"
              placeholder="Search conditions, treatment, symptoms and more"
              className="hl-search-input"
            />

            <button className="hl-search-button" aria-label="Search">
              <Search size={16} strokeWidth={1.8} />
            </button>
          </div>

          {/* ================= CATEGORY ================= */}
          <div className="hl-category-section">
            <div className="hl-category-label">BROWSE BY CATEGORY</div>

            <div className="hl-category-header">
              <div>
                <h2 className="hl-category-title">
                  Find what you're
                  <br />
                  looking for.
                </h2>

                <p className="hl-category-description">
                  Select a letter to browse all diseases, treatments, medicines
                  and tests starting with it.
                </p>
              </div>

              <Link to="/health-library/browse" className="hl-view-all">
                <span>View all</span>
                <ArrowRight size={25} strokeWidth={1.6} />
              </Link>
            </div>
          </div>
        </div>
        <section className="hc-section">
          <div className="hc-grid">
            {categories.map((category, index) => (
              <Link
                className="hc-card"
                key={category.number}
                to={`/health-library/browse?type=${category.slug}`}
              >
                <div className="hc-number">{category.number}</div>

                <div className="hc-card-content">
                  <h3 className="hc-title">{category.title}</h3>

                  <p className="hc-description">{category.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </section>
    </>
  );
}
