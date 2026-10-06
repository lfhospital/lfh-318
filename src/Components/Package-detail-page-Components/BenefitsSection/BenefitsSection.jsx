import React from "react";
import "./BenefitsSection.css";

export default function BenefitsSection() {
  const benefits = [
    {
      number: "01",
      label: "EARLY DETECTION",
      title: "Catch metabolic shifts before symptoms.",
      description:
        "The panel surfaces early markers of diabetes, thyroid imbalance and vitamin deficiencies when course-correction is simplest.",
    },
    {
      number: "02",
      label: "DOCTOR INCLUDED",
      title: "A 15-min teleconsult, on us.",
      description:
        "A Sacred Health physician walks you through your report, flags anomalies and gives you a clear next step. No upsell.",
    },
    {
      number: "03",
      label: "HOME PHLEBOTOMY",
      title: "Painless visit, 7AM–9PM, free.",
      description:
        "Trained phlebotomists arrive with sterilised kits. Most home collections take under 15 minutes.",
    },
    {
      number: "04",
      label: "DIGITAL REPORTS",
      title: "Shareable with any doctor, anywhere.",
      description:
        "Reports are available on the Sacred portal in 12 hours. Download as PDF or share a secure link with your GP.",
    },
  ];

  return (
    <section className="benefits-section">
      <div className="benefits-header">
        <h1>Benefits</h1>

        <span>Why this package</span>
      </div>

      <div className="benefits-grid">
        {benefits.map((item, index) => (
          <div className="benefit-card" key={index}>
            <span className="benefit-label">
              {item.number} · {item.label}
            </span>

            <h3>{item.title}</h3>

            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}