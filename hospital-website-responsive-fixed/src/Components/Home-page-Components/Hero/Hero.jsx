import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Calendar,
  Home,
  Users,
  ScanText,
  Shield,
} from "lucide-react";
import img from "../../../asserts/image.png";
import "./Hero.css";

const searchData = {
  "Top Results": [
    "CBC (Complete Blood Count)",
    "Cardiology",
    "Chest Pain",
    "Cold & Flu",
    "Cardiac Risk Profile",
    "Critical Care",
    "Diabetes",
    "Heart Checkup",
  ],
  Tests: [
    "CBC (Complete Blood Count)",
    "Lipid Profile",
    "Liver Function Test",
    "Blood Sugar",
    "HbA1c",
    "Vitamin D",
    "Thyroid Profile",
  ],
  Doctors: [
    "Dr. Rahul Sharma",
    "Dr. Priya Reddy",
    "Dr. Kiran Kumar",
    "Dr. Sneha Patel",
    "Dr. Arjun Rao",
  ],
  Packages: [
    "Executive Health Checkup",
    "Diabetes Package",
    "Heart Care Package",
    "Women's Wellness Package",
  ],
  Symptoms: [
    "Chest Pain",
    "Cold & Flu",
    "Fever",
    "Headache",
    "Cough",
    "Body Pain",
  ],
};

export default function Hero() {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeTab, setActiveTab] = useState("Top Results");

  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredResults = searchData[activeTab].filter((item) =>
    item.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <section className="hero">
      <div className="hero-bg">
        <img src={img} alt="Hospital" className="hero-img" />
        <div className="hero-overlay" />
      </div>

      <div className="hero-content">
        <p className="hero-trust">
          <span><Shield size={16} /> </span> Trusted by 10,000+ patients
        </p>

        <h1 className="hero-headline">
          Expert care you
          <br />
          can trust.
        </h1>

        <p className="hero-sub">
          Trusted healthcare backed by leading medical specialists. 200+
          doctors across 15+ departments, available when you need them.
        </p>

        <div className="hero-search-wrapper" ref={searchRef}>
          <div className="hero-search">
            <input
              type="text"
              className="search-input"
              placeholder="Search doctors, specialities, or symptoms"
              value={query}
              onFocus={() => setShowSuggestions(true)}
              onChange={(e) => setQuery(e.target.value)}
            />

            <Search className="search-icon" />
          </div>

          {showSuggestions && (
            <div className="search-suggestions">
              <div className="search-tabs">
                {Object.keys(searchData).map((tab) => (
                  <button
                    key={tab}
                    className={activeTab === tab ? "active-tab" : ""}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="search-results">
                {filteredResults.length ? (
                  filteredResults.map((item) => (
                    <div
                      key={item}
                      className="search-result-item"
                      onClick={() => {
                        setQuery(item);
                        setShowSuggestions(false);
                      }}
                    >
                      {item}
                    </div>
                  ))
                ) : (
                  <div className="no-result">
                    No results found
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="hero-actions">
        <a href="#" className="hero-action-btn">
          <Calendar size={18} />
          Book Appointment
        </a>

        <a href="#" className="hero-action-btn">
          <Users size={18} />
          Second Opinion
        </a>

        <a href="#" className="hero-action-btn">
          <Home size={18} />
          Home Care
        </a>

        <a href="#" className="hero-action-btn">
          <ScanText size={18} />
          Lab Tests
        </a>
      </div>
    </section>
  );
}