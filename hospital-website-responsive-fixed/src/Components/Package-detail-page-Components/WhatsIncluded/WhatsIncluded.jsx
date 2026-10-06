import React, { useState } from "react";
import "./WhatsIncluded.css";

export default function WhatsIncluded() {
  const [openPanels, setOpenPanels] = useState([]);

  const togglePanel = (index) => {
    setOpenPanels((prev) =>
      prev.includes(index)
        ? prev.filter((item) => item !== index)
        : [...prev, index]
    );
  };

  const panels = [
    {
      number: "01",
      title: "Blood & Hematology",
      description: "Complete blood count and related markers",
      tests: "14 TESTS",
    },
    {
      number: "02",
      title: "Diabetes & Metabolism",
      description: "Sugar control and insulin sensitivity",
      tests: "9 TESTS",
    },
    {
      number: "03",
      title: "Cardiac & Lipid Profile",
      description: "Heart risk markers and cholesterol",
      tests: "11 TESTS",
    },
    {
      number: "04",
      title: "Liver Function",
      description: "Hepatic enzymes, proteins and bilirubin",
      tests: "12 TESTS",
    },
    {
      number: "05",
      title: "Kidney Function",
      description: "Renal markers and electrolytes",
      tests: "9 TESTS",
    },
    {
      number: "06",
      title: "Thyroid Profile",
      description: "Comprehensive thyroid function tests",
      tests: "5 TESTS",
    },
    {
      number: "07",
      title: "Vitamins & Minerals",
      description: "Essential nutrient panel",
      tests: "26 TESTS",
    },
  ];

  const benefits = [
    {
      title: "Doctor reviewed",
      subtitle: "Curated by senior physicians",
    },
    {
      title: "12-hour reports",
      subtitle: "Digital + printed copies",
    },
    {
      title: "2.4 lakh+ patients",
      subtitle: "Trusted across Vijayawada",
    },
    {
      title: "NABL & CAP certified",
      subtitle: "Same standard, every sample",
    },
  ];

  return (
    <section className="package-tabs-section">
      <div className="package-content">
        <div className="package-left">
          <div className="title-row">
            <h1>What's included</h1>
            <span>86 tests · 7 panels</span>
          </div>

          {panels.map((item, index) => (
            <div className="panel-wrapper" key={index}>
              <div className="panel-row">
                <div className="panel-number">{item.number}</div>

                <div className="panel-content">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>

                <div className="panel-actions">
                  <span className="tests-badge">{item.tests}</span>

                  <button
                    className={`plus-btn ${
                      openPanels.includes(index) ? "active" : ""
                    }`}
                    onClick={() => togglePanel(index)}
                  >
                    {openPanels.includes(index) ? "−" : "+"}
                  </button>
                </div>
              </div>

              {openPanels.includes(index) && (
                <div className="dropdown-content">
                  <div className="test-item">✓ Complete Blood Count (CBC)</div>
                  <div className="test-item">✓ Complete Blood Count (CBC)</div>
                  <div className="test-item">✓ Complete Blood Count (CBC)</div>
                  <div className="test-item">✓ Complete Blood Count (CBC)</div>
                  <div className="test-item">✓ Complete Blood Count (CBC)</div>
                  <div className="test-item">✓ Complete Blood Count (CBC)</div>
                  <div className="test-item">✓ Complete Blood Count (CBC)</div>
                  <div className="test-item">✓ Complete Blood Count (CBC)</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}