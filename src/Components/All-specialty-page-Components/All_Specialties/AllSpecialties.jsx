import React from "react";
import "./AllSpecialties.css";
import { Search } from "lucide-react";

export default function AllSpecialties({ searchTerm = "", onSearchChange }) {
  return (
    <section className="all-specialties">
      <div className="specialties-container">

        <p className="specialties-label">
          ALL SPECIALTIES
        </p>

        <h1 className="specialties-title">
          Find the right specialty for your care
        </h1>

        <p className="specialties-description">
          We offer an extensive range of clinical specialties, each staffed by
          experienced specialists committed to providing thoughtful,
          <br />
          evidence based care throughout your health journey.
        </p>

        <div className="specialties-search">
          <input
            type="text"
            placeholder="Search by specialty, doctor, or condition..."
            value={searchTerm}
            onChange={(e) => onSearchChange?.(e.target.value)}
          />
            <Search size={16}/>
        </div>

      </div>
    </section>
  );
}
