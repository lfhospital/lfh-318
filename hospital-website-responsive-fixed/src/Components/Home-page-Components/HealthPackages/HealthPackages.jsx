import React from "react";
import { ArrowRight } from "lucide-react";
import "./HealthPackages.css";

const packages = [
  {
    id: 1,
    title: "Full Body",
    booked: "Booked 1200+ times this month",
    description:
      "Cardiac risk assessment with lipid profile, hs-CRP, ECG, 2D echo and consultation with a cardiologist...",
    meta: "42 tests · 8h fasting · Report in 24h · Home collection available",
    price: "₹2,299",
  },
  {
    id: 2,
    title: "Full Body",
    booked: "Booked 1200+ times this month",
    description:
      "Cardiac risk assessment with lipid profile, hs-CRP, ECG, 2D echo and consultation with a cardiologist...",
    meta: "42 tests · 8h fasting · Report in 24h · Home collection available",
    price: "₹2,299",
  },
  {
    id: 3,
    title: "Full Body",
    booked: "Booked 1200+ times this month",
    description:
      "Cardiac risk assessment with lipid profile, hs-CRP, ECG, 2D echo and consultation with a cardiologist...",
    meta: "42 tests · 8h fasting · Report in 24h · Home collection available",
    price: "₹2,299",
  },
];

export default function HealthPackages() {
  return (
    <section className="health-packages">
      <div className="packages-header">
        <div>
          <h2 className="packages-title">Health Packages</h2>
          <p className="packages-subtitle">
            Curated checkup bundles with everything you need tests,
            <br />
            consultations, and reports delivered within 24 hours.
          </p>
        </div>

        <button className="view-packages-btn">
          View all packages
        </button>
      </div>

      <div className="packages-grid">
        {packages.map((item) => (
          <div className="homepackage-card" key={item.id}>
            <p className="top-package-tag">
              COMPREHENSIVE · MOST CHOSEN
            </p>

            <h3 className="package-title">{item.title}</h3>

            <p className="package-booked">{item.booked}</p>

            <p className="package-description">
              {item.description}
            </p>

            <p className="package-meta">{item.meta}</p>

            <div className="package-footer">
              <div>
                <h4 className="package-price">{item.price}</h4>
                <p className="package-tax">
                  Inclusive of all taxes
                </p>
              </div>

              <a href="/" className="package-detail">
                View Detail
              </a>
            </div>

            <button className="home-add-plan-btn">
              Add to plan
              <ArrowRight size={20} />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}