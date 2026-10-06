import React from "react";
import { Home, Building2, Phone } from "lucide-react";
import "./CompleteBodyCount.css";

export default function CompleteBodyCount() {
  const includedTests = [
    "Complete Blood Count (CBC)",
    "Blood Sugar Fasting + PP",
    "Lipid Profile Full",
    "Liver Function Test (LFT)",
    "Kidney Function Test (KFT)",
  ];

  const keyTests = [
    "Complete Blood Count",
    "Lipid Profile",
    "Liver Function",
    "Kidney Function",
    "Thyroid Profile",
    "Vitamin D",
    "Vitamin B12",
  ];

  return (
    <section className="test-details-section">
      <div className="test-details-container">
        {/* LEFT */}
        <div className="test-left">
          <span className="test-category">
            COMPREHENSIVE · MOST CHOSEN · FOR 35+
          </span>

          <h1>Complete Blood <br /> Count (CBC)</h1>

          <p className="test-description">
            A comprehensive 86-test screening covering metabolism, liver,
            kidney, thyroid, lipid profile, vitamins and complete blood count.
            Curated by our physicians for adults 30 and above as part of an
            annual wellness routine.
          </p>

          <div className="stats-wrapper">
            <div className="stat-box">
              <span>TESTS</span>
              <h3>86 included</h3>
              <p>Across 7 panels</p>
            </div>

            <div className="stat-box">
              <span>FASTING</span>
              <h3>10-12 hrs</h3>
              <p>Required</p>
            </div>

            <div className="stat-box">
              <span>REPORT</span>
              <h3>12 hrs</h3>
              <p>Digital + printed</p>
            </div>
          </div>

          <div className="key-tests-section">
            <h4>KEY TESTS</h4>

            <div className="chips-container">
              {keyTests.map((item, index) => (
                <span key={index} className="test-chip">
                  {item}
                </span>
              ))}

              <span className="test-chip more-chip">+79 more</span>
            </div>
          </div>
        </div>

       {/* RIGHT */}
<div className="cbctest-right">
  <h3 className="plan-title">Add to your plan</h3>

  <div className="price-box">
    <h2>₹1,299</h2>
    <p>Inclusive of all taxes · Free home collection</p>
  </div>

  <div className="mode-selector">
    <button className="active-mode">
      <Home size={14} />
      Home Collection
    </button>

    <button>
      <Building2 size={14} />
      Visit Hospital
    </button>
  </div>

  <div className="test-info-row">
    <div className="info-box">
      <span>SAMPLE TYPE</span>
      <h4>Blood</h4>
    </div>

    <div className="info-divider"></div>

    <div className="info-box">
      <span>FASTING</span>
      <h4>8-10 hrs</h4>
    </div>

    <div className="info-divider"></div>

    <div className="info-box">
      <span>REPORT</span>
      <h4>6 hours</h4>
    </div>
  </div>

  <button className="add-plan-btn">
    Add to plan &nbsp; →
  </button>

  <div className="advisor-section">
    <span>Need help deciding?</span>

    <button>
      <Phone size={14} />
      Talk to advisor
    </button>
  </div>
</div>
      </div>
    </section>
  );
}