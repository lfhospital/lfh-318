import React from "react";
import "./ProceduresSection.css";

export default function ProceduresSection() {
  return (
    <section className="procedures-section">
      <div className="procedures-header">
        <div className="procedures-left">
          <span className="section-tag">
            03 · PROCEDURES & TREATMENTS
          </span>

          <h1>
            Advanced procedures,
            <br />
            delivered with precision.
          </h1>
        </div>

        <div className="procedures-right">
          <p>
            From diagnostic imaging to complex interventional procedures,
            every case is planned by a heart team and executed in our hybrid
            cath labs.
          </p>
        </div>
      </div>

      <div className="procedures-grid">
        <div className="procedure-card">
          <div className="card-top">
            <span className="procedure-label">
              PROCEDURE 01
            </span>

            <span className="status-pill emergency">
              EMERGENCY AVAILABLE
            </span>
          </div>

          <h2>
            Coronary Angioplasty &
            <br />
            Stenting (PCI)
          </h2>

          <p className="card-description">
            Minimally invasive opening of blocked coronary arteries using
            balloon dilation and drug-eluting stents. Performed in our 24/7
            cath lab with median door-to-balloon under 60 minutes.
          </p>

          <div className="divider"></div>

          <div className="card-footer">
            <div>
              <span className="footer-label">
                AVG. DURATION
              </span>
              <h4>45–90 min</h4>
            </div>

            <div>
              <span className="footer-label">
                HOSPITAL STAY
              </span>
              <h4>1–2 days</h4>
            </div>
          </div>
        </div>
        <div className="procedure-card">
          <div className="card-top">
            <span className="procedure-label">
              PROCEDURE 02
            </span>

            <span className="status-pill diagnostic">
              DIAGNOSTIC
            </span>
          </div>

          <h2>
            Echocardiography
            <br />
            (Echo)
          </h2>

          <p className="card-description">
            Non-invasive ultrasound imaging of the heart's chambers, valves
            and function including 2D, 3D, stress and transesophageal
            modalities. Reports on the same day.
          </p>

          <div className="divider"></div>

          <div className="card-footer">
            <div>
              <span className="footer-label">
                AVG. DURATION
              </span>
              <h4>30–45 min</h4>
            </div>

            <div>
              <span className="footer-label">
                HOSPITAL STAY
              </span>
              <h4>Outpatient</h4>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}