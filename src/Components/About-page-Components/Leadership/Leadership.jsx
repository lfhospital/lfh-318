import React from "react";
import "./Leadership.css";

// Placeholder rows from the design; replace with the real leadership team
const leaders = [
  { id: 1, name: "Dr.Abburi Vidyasagar", role: "Founder & Chief Patron" },
  { id: 2, name: "Dr.Abburi Vidyasagar", role: "Founder & Chief Patron" },
  { id: 3, name: "Dr.Abburi Vidyasagar", role: "Founder & Chief Patron" },
  { id: 4, name: "Dr.Abburi Vidyasagar", role: "Founder & Chief Patron" },
  { id: 5, name: "Dr.Abburi Vidyasagar", role: "Founder & Chief Patron" },
];

export default function Leadership() {
  return (
    <section className="about-section">
      <div className="leadership-head">
        <div className="page-section-title about-section-title">
          <p className="page-eyebrow">Leadership</p>
          <h2>
            Leading the future
            <br />
            of compassionate care
          </h2>
        </div>
        <p className="page-section-note leadership-note">
          Our leadership team is committed to creating a healthcare experience
          built on compassionate care, modern medicine and a patient first
          approach.
        </p>
      </div>

      <ul className="leadership-list">
        {leaders.map((l) => (
          <li className="leadership-row" key={l.id}>
            <span className="leadership-name">{l.name}</span>
            <span className="leadership-role">{l.role}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
