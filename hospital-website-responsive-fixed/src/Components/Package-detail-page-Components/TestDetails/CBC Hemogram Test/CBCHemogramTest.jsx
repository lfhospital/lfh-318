import React, { useState } from "react";
import { Home, Building2, Phone } from "lucide-react";
import "./CBCHemogramTest.css";

export default function CBCHemogramTest() {
  const [showPackageStickyBar, setShowPackageStickyBar] = useState(false);

  const includedTests = [
    "Complete Blood Count (CBC)",
    "Blood Sugar Fasting + PP",
    "Lipid Profile Full",
    "Thyroid Function (TSH)",
    "Liver Function Test (LFT)",
  ];

  const keyTests = [
    "Complete Blood Count",
    "Lipid Profile",
    "HbA1c",
    "Liver Function",
    "Kidney Function",
    "Thyroid Profile",
    "Vitamin D",
    "Vitamin B12",
    "Iron Studies",
  ];

  return (
    <section className="test-details-section">
      <div className="test-details-container">
        {/* LEFT */}
        <div className="cbctest-left">
          <div className="breadcrumb">
            <span className="breadcrumb-item">PACKAGES</span>
            <span className="separator">/</span>
            <span className="breadcrumb-item active">CBC HEMOGRAM TEST</span>
          </div>
          <span className="test-category">
            COMPREHENSIVE · MOST CHOSEN · FOR 35+
          </span>

          <h1>CBC Hemogram Test</h1>

          <p className="test-description">
            A comprehensive blood test that evaluates red blood cells, white
            blood cells, platelets, and other key blood parameters. Commonly
            recommended as part of routine health assessments, it helps identify
            infections, anaemia, inflammation, and other underlying health
            concerns while providing valuable insight into overall wellbeing.
          </p>

          <div className="stats-wrapper">
            <div className="stat-box">
              <span>TESTS</span>
              <h3>08 included</h3>
              <p>Blood health markers</p>
            </div>

            <div className="stat-box">
              <span>FASTING</span>
              <h3>0 hrs</h3>
              <p>Not required</p>
            </div>

            <div className="stat-box">
              <span>REPORT</span>
              <h3>24-48 hrs</h3>
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

              <span className="test-chip more-chip">+78 more</span>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="test-right">
          <h3 className="plan-title">Add to your plan</h3>

          <div className="price-box">
            <h2>₹1,299</h2>
            <p>Inclusive of all taxes · Free home collection</p>
          </div>

          <div className="mode-selector">
            <button className="active-mode">
              <Home size={18} /> Home Collection
            </button>

            <button>
              <Building2 size={18} /> Visit Hospital
            </button>
          </div>

          <div className="included-section">
            <h4>WHAT'S INCLUDED</h4>

            {includedTests.map((item, index) => (
              <div className="included-item" key={index}>
                ✓ {item}
              </div>
            ))}

            <p className="more-tests">+12 more tests included</p>
          </div>

          <button
            className="add-plan-btn"
            onClick={() => setShowPackageStickyBar(true)}
          >
            Add to plan →
          </button>

          <div className="advisor-section">
            <span>Need help deciding?</span>

            <button>
              <Phone size={18} /> Talk to advisor
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
