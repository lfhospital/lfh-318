import React from "react";
import "./WhoShouldTake.css";

export default function WhoShouldTake() {
  const recommendations = [
    "Adults aged 30+ for routine annual screening",
    "Individuals with sedentary lifestyle",
    "People with a family history of diabetes or heart disease",
    "Anyone with fatigue, weight changes or unexplained symptoms",
    "Pre-employment or insurance medical screening",
    "Smokers and individuals with elevated stress levels",
  ];

  return (
    <section className="who-should-take">
      <div className="who-header">
        <h1>Who should take this package</h1>

        <span>Recommended for</span>
      </div>

      <div className="recommendation-grid">
        {recommendations.map((item, index) => (
          <div className="recommendation-card" key={index}>
            <div className="check-icon">
              ✓
            </div>

            <p>{item}</p>
          </div>
        ))}
      </div>
    </section>
  );
}