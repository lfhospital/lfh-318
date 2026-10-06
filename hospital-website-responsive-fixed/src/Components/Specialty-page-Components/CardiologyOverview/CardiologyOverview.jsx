import React, { useState, useRef } from "react";
import "./CardiologyOverview.css";
import { Phone } from "lucide-react";
import ConditionsWeTreat from "../ConditionsWeTreat/ConditionsWeTreat";
import ProceduresSection from "../ProceduresSection/ProceduresSection";
import DoctorsHelpSection from "../DoctorsSection/DoctorsSection";

export default function CardiologyOverview() {
  const [activeTab, setActiveTab] = useState(1);

  const overviewRef = useRef(null);
  const conditionsRef = useRef(null);
  const proceduresRef = useRef(null);
  const doctorsRef = useRef(null);
  const faqRef = useRef(null);

  const tabs = [
    { id: 1, number: "01", label: "Overview", ref: overviewRef },
    { id: 2, number: "02", label: "Conditions We Treat", ref: conditionsRef },
    { id: 3, number: "03", label: "Procedures", ref: proceduresRef },
    { id: 4, number: "04", label: "Doctors", ref: doctorsRef },
    { id: 5, number: "05", label: "FAQ", ref: faqRef },
  ];

  const scrollToSection = (tab) => {
    setActiveTab(tab.id);
    const section = tab.ref?.current;
    if (section) {
      const yOffset = -115;
      const y =
        section.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <section className="overview-section">
      <header className="top-nav">
        <div className="nav-links">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`nav-item ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => scrollToSection(tab)}
            >
              <span className="nav-number">{tab.number}</span>
              <span>{tab.label}</span>
            </div>
          ))}
        </div>
        <button className="call-btn">
          <Phone size={18} />
          <span>Call OPD</span>
        </button>
      </header>

      {/* 01 Overview */}
      <div ref={overviewRef}>
        <div className="overview-content">
          <div className="overview-label">01 · OVERVIEW</div>
          <div className="overview-text">
            <h1>
              A complete heart programme, from
              <br />
              first symptom to lifelong follow up.
            </h1>
            <p>
              Our Department of Cardiology combines evidence based diagnostics
              with compassionate, continuous care. Every patient is reviewed by a
              multi-disciplinary panel so the plan is right the first time.
            </p>
          </div>
        </div>
        <div className="cards-grid">
          <div className="info-card">
            <span className="card-number">01</span>
            <h3>Dedicated Cardiac ICU</h3>
            <p>
              16-bed CCU with continuous telemetry, on-site intensivist cover
              and dedicated cardiac nursing.
            </p>
          </div>
          <div className="info-card">
            <span className="card-number">02</span>
            <h3>Cath Lab 24/7</h3>
            <p>
              Two hybrid catheterisation labs activated round-the-clock for
              primary PCI and structural procedures.
            </p>
          </div>
          <div className="info-card">
            <span className="card-number">03</span>
            <h3>Non Invasive Diagnostics</h3>
            <p>
              Echo, TMT, Holter, CT coronary angio and cardiac MRI — most
              reports turned around the same day.
            </p>
          </div>
          <div className="info-card">
            <span className="card-number">04</span>
            <h3>Multi-Disciplinary Team</h3>
            <p>
              Weekly heart-team meets unite cardiology, CTVS, imaging and rehab
              around every complex case.
            </p>
          </div>
        </div>
      </div>

      {/* 02 Conditions We Treat */}
      <div ref={conditionsRef} className="section-placeholder">
        <ConditionsWeTreat/>
      </div>

      {/* 03 Procedures */}
      <div ref={proceduresRef} className="section-placeholder">
        <ProceduresSection/>
      </div>

      {/* 04 Doctors */}
      <div ref={doctorsRef} className="section-placeholder">
        <DoctorsHelpSection/>
      </div>

      {/* 05 FAQ */}
      <div ref={faqRef} className="section-placeholder">
        {/* Your FAQ content here */}
      </div>
    </section>
  );
}