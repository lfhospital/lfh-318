import React from "react";
import "./PackageSection.css";
import { useCompare } from "../CompareContext.jsx";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function PackageCards() {
  const {
    compareMode,
    selectedPackages,
    togglePackageSelection,
    maxCompare,
  } = useCompare();

  const packages = [
    {
      id: 1,
      category: "COMPREHENSIVE · MOST CHOSEN",
      title: "Full Body",
      booked: "Booked 1200+ times this month",
      description:
        "Cardiac risk assessment with lipid profile, hs-CRP, ECG, 2D echo and consultation with a cardiologist...",
      tests:
        "42 tests · 8h fasting · Report in 24h · Home collection available",
      price: "₹2,299",
    },
    {
      id: 2,
      category: "COMPREHENSIVE · MOST CHOSEN",
      title: "Full Body",
      booked: "Booked 1200+ times this month",
      description:
        "Cardiac risk assessment with lipid profile, hs-CRP, ECG, 2D echo and consultation with a cardiologist...",
      tests:
        "42 tests · 8h fasting · Report in 24h · Home collection available",
      price: "₹2,299",
    },
    {
      id: 3,
      category: "COMPREHENSIVE · MOST CHOSEN",
      title: "Full Body",
      booked: "Booked 1200+ times this month",
      description:
        "Cardiac risk assessment with lipid profile, hs-CRP, ECG, 2D echo and consultation with a cardiologist...",
      tests:
        "42 tests · 8h fasting · Report in 24h · Home collection available",
      price: "₹2,299",
    },
    {
      id: 4,
      category: "COMPREHENSIVE · MOST CHOSEN",
      title: "Full Body",
      booked: "Booked 1200+ times this month",
      description:
        "Cardiac risk assessment with lipid profile, hs-CRP, ECG, 2D echo and consultation with a cardiologist...",
      tests:
        "42 tests · 8h fasting · Report in 24h · Home collection available",
      price: "₹2,299",
    },
    {
      id: 5,
      category: "COMPREHENSIVE · MOST CHOSEN",
      title: "Full Body",
      booked: "Booked 1200+ times this month",
      description:
        "Cardiac risk assessment with lipid profile, hs-CRP, ECG, 2D echo and consultation with a cardiologist...",
      tests:
        "42 tests · 8h fasting · Report in 24h · Home collection available",
      price: "₹2,299",
    },
    {
      id: 6,
      category: "COMPREHENSIVE · MOST CHOSEN",
      title: "Full Body",
      booked: "Booked 1200+ times this month",
      description:
        "Cardiac risk assessment with lipid profile, hs-CRP, ECG, 2D echo and consultation with a cardiologist...",
      tests:
        "42 tests · 8h fasting · Report in 24h · Home collection available",
      price: "₹2,299",
    },
    {
      id: 7,
      category: "COMPREHENSIVE · MOST CHOSEN",
      title: "Full Body",
      booked: "Booked 1200+ times this month",
      description:
        "Cardiac risk assessment with lipid profile, hs-CRP, ECG, 2D echo and consultation with a cardiologist...",
      tests:
        "42 tests · 8h fasting · Report in 24h · Home collection available",
      price: "₹2,299",
    },
    {
      id: 8,
      category: "COMPREHENSIVE · MOST CHOSEN",
      title: "Full Body",
      booked: "Booked 1200+ times this month",
      description:
        "Cardiac risk assessment with lipid profile, hs-CRP, ECG, 2D echo and consultation with a cardiologist...",
      tests:
        "42 tests · 8h fasting · Report in 24h · Home collection available",
      price: "₹2,299",
    },
    {
      id: 9,
      category: "COMPREHENSIVE · MOST CHOSEN",
      title: "Full Body",
      booked: "Booked 1200+ times this month",
      description:
        "Cardiac risk assessment with lipid profile, hs-CRP, ECG, 2D echo and consultation with a cardiologist...",
      tests:
        "42 tests · 8h fasting · Report in 24h · Home collection available",
      price: "₹2,299",
    },
  ];

  return (
    <>
      <section className="package-section">
        <div className="package-grid">
          {packages.map((item) => {
            const isSelected = selectedPackages.includes(item.id);

            return (
              <div className="healthpackage-card" key={item.id}>
                <div className="card-top-row">
                  <span className="package-tag">{item.category}</span>

                  {compareMode && (
                    <div className="compare-box">
                      <span className="compare-count">
                        {isSelected ? 1 : 0}/{maxCompare}
                      </span>

                      <label className="compare-checkbox">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => togglePackageSelection(item.id)}
                        />
                        <span className="checkbox-custom"></span>
                      </label>
                    </div>
                  )}
                </div>

                <h2>{item.title}</h2>
                <p className="booked-text">{item.booked}</p>
                <p className="description-text">{item.description}</p>
                <p className="tests-text">{item.tests}</p>

                <div className="price-section">
                  <div>
                    <h3>{item.price}</h3>
                    <span>Inclusive of all taxes</span>
                  </div>
                  <button className="detail-btn">View Detail</button>
                </div>

                <button className="plan-btn">
                  Add to plan
                  <span><ArrowRight size={18} /></span>
                </button>
              </div>
            );
          })}
        </div>
      </section>

      <div className="pagination-section">
        <span className="showing-text">Showing 1–6 of 18 doctors</span>
        <div className="pagination">
          <button className="pagination-btn"><ArrowLeft size={18} /> Previous</button>
          <button className="page-number active-page">1</button>
          <button className="page-number">2</button>
          <button className="page-number">3</button>
          <span className="pagination-dots">...</span>
          <button className="pagination-btn">Next <ArrowRight size={18} /></button>
        </div>
      </div>

      <div className="carthelp-section">
        <div className="help-content">
          <h2>Not sure which package fits?</h2>

          <p>Booking guidance, insurance, second opinion. All in one place</p>
        </div>

        <button className="team-btn">
          <span className="team-text">Talk to our team</span>
          <span className="team-arrow"><ArrowRight size={18} /></span>
        </button>
      </div>
    </>
  );
}