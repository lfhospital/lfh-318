import React from "react";
import { ArrowRight } from "lucide-react";
import "./ConditionDetailsHome.css";
import { navigateTo } from "../../../../navigation";

export default function ConditionDetailsHome() {
  return (
    <section className="condition-details">
      {/* =========================================
          BREADCRUMB
      ========================================= */}
      <div className="condition-breadcrumb">
        <button
          type="button"
          className="breadcrumb-main breadcrumb-link"
          onClick={() => navigateTo("healthLibraryHero")}
        >
          HEALTH LIBRARY
        </button>

        <span className="breadcrumb-slash"> / </span>

        <button
          type="button"
          className="breadcrumb-current breadcrumb-link"
          onClick={() => navigateTo("List")}
        >
          DISEASE &amp; CONDITION
        </button>
      </div>

      {/* =========================================
          MAIN CONTENT
      ========================================= */}
      <div className="condition-content">
        {/* Title */}
        <h1 className="condition-title">
          Coronary Artery
          <br />
          Disease
        </h1>

        {/* Description */}
        <p className="condition-description">
          A narrowing or blockage of the coronary arteries—the vessels that
          supply blood to your heart
          <br />
          muscle caused by a gradual build-up of plaque. It is the most common
          type of heart disease.
        </p>

        {/* =========================================
            ACTION BUTTONS
        ========================================= */}
        <div className="condition-actions">
          {/* Primary Button */}
          <button
            className="condition-btn condition-btn-primary"
            onClick={() => navigateTo("allDoctors", { specialty: "Cardiology" })}
          >
            <span>Find a Cardiologist</span>
            <ArrowRight size={16} strokeWidth={1.7} />
          </button>

          {/* Secondary Button */}
          <button
            className="condition-btn condition-btn-secondary"
            onClick={() => navigateTo("healthPackages")}
          >
            Heart Checkup Packages
          </button>

          {/* Secondary Button */}
          <button
            className="condition-btn condition-btn-secondary"
            onClick={() => navigateTo("allDoctors", { specialty: "Cardiology" })}
          >
            Book Appointment
          </button>
        </div>
      </div>
    </section>
  );
}
