import React from "react";
import "./ConditionsWeTreat.css";

export default function ConditionsWeTreat() {
  return (
    <section className="conditions-section">
      <div className="conditions-header">
        <div className="conditions-left">
          <span className="section-label">02 · CONDITIONS WE TREAT</span>

          <h1 className="spcsection-title">
            From routine to
            <br />
            complex covered.
          </h1>
        </div>

        <div className="conditions-right">
          <p>
            Our cardiologists manage the full breadth of cardiovascular
            conditions, with sub-specialty pathways for arrhythmia,
            structural heart disease, heart failure and preventive care.
          </p>
        </div>
      </div>

      <div className="conditions-grid">
        <div className="condition-card large-card">
          <div>
            <h3>Hypertension</h3>
            <p>Primary &amp; secondary</p>
          </div>
          <span className="arrow">→</span>
        </div>

        <div className="condition-card">
          <div>
            <h3>Coronary Artery Disease</h3>
            <p>CAD · Ischaemia · Angina</p>
          </div>
          <span className="arrow">→</span>
        </div>

        <div className="condition-card">
          <div>
            <h3>Heart Failure</h3>
            <p>HFrEF · HFpEF</p>
          </div>
          <span className="arrow">→</span>
        </div>

        <div className="condition-card large-card">
          <div>
            <h3>Valvular Heart Disease</h3>
            <p>Stenosis · Regurgitation</p>
          </div>
          <span className="arrow">→</span>
        </div>

        <div className="condition-card">
          <div>
            <h3>Heart Failure</h3>
            <p>HFrEF · HFpEF</p>
          </div>
          <span className="arrow">→</span>
        </div>

        <div className="condition-card more-card">
          <div>
            <h3>+22 more conditions</h3>
          </div>
          <span className="arrow">→</span>
        </div>
      </div>
    </section>
  );
}