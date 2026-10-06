import React from "react";
import "./PreparationInstructions.css";

export default function PreparationInstructions() {
  const steps = [
    {
      number: "01",
      title: "Fast for 10–12 hours before sample collection",
      description:
        "Last meal should be by 9 PM the previous night for a morning collection. Plain water is permitted and encouraged.",
    },
    {
      number: "02",
      title: "Avoid alcohol for 24 hours",
      description:
        "Alcohol affects liver enzymes and lipid markers. Skip heavy or fatty meals the day before for cleaner results.",
    },
    {
      number: "03",
      title: "Skip vigorous exercise on test morning",
      description:
        "Strenuous activity can transiently elevate certain enzymes. A light walk is fine.",
    },
    {
      number: "04",
      title: "Continue regular medication unless told otherwise",
      description:
        "Bring your medication list. Carry a government-issued photo ID for the phlebotomist's verification.",
    },
  ];

  return (
    <section className="preparation-section">
      <div className="preparation-header">
        <h1>Preparation instructions</h1>

        <span>4 simple steps</span>
      </div>

      <div className="steps-grid">
        {steps.map((step) => (
          <div className="step-card" key={step.number}>
            <span className="step-number">
              {step.number}
            </span>

            <h3>{step.title}</h3>

            <p>{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}