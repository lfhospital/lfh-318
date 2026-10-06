import React from "react";
import "./CareJourney.css";

const steps = [
  {
    number: "01",
    title: "Book Online",
    description:
      "Choose a specialist, select a convenient time, and confirm your visit in just a few steps.",
  },
  {
    number: "02",
    title: "Check In",
    description:
      "Arrive at a calm, guided reception experience. Your records stay connected, so your care feels seamless.",
  },
  {
    number: "03",
    title: "Consultation",
    description:
      "Dedicated time with your doctor, practical guidance, and clear next steps.",
  },
  {
    number: "04",
    title: "Treatment",
    description:
      "Continued support coordinated across specialists, with a trusted team by your side throughout treatment.",
  },
];

export default function CareJourney() {
  return (
    <section className="care-journey">
      <div className="care-container">
        <div className="care-header">
          <p className="care-label">Your Care Journey</p>

          <h2 className="care-title">
            Simple steps
            <br />
            toward better care.
          </h2>
        </div>

        <div className="journey-grid">
          {steps.map((step) => (
            <div className="homejourney-card" key={step.number}>
              <span className="homestep-number">{step.number}</span>

              <h3 className="step-title">{step.title}</h3>

              <p className="step-description">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}