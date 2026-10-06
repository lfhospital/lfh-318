import React from "react";
import "./CardiacHero.css";

export default function CardiacCare() {
  return (
    <section className="cardiac-section">
      <div className="cardiac-content">
        <div className="section-title">
          <span className="title-dark">SPECIALITY</span>
          <span className="title-slash"> / </span>
          <span className="title-light">COMPREHENSIVE CARDIAC CARE.</span>
        </div>
        <h1 className="cardiac-title">
          Comprehensive
          <br />
          cardiac care.
        </h1>

        <p className="cardiac-description">
          Our team combines advanced diagnostics, experienced specialists, and
          modern treatment approaches to support better heart health.
        </p>

        <div className="cardiac-actions">
          <button className="find-btn">
            <span>Find a Cardiologist</span>
            <span className="heroarrow">→</span>
          </button>

          <a href="/" className="packages-link">
            Heart Checkup Packages
          </a>
        </div>
      </div>
    </section>
  );
}
