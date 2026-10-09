import React from "react";
import "./VisitUs.css";
import mapImage from "../../../asserts/contact/hospital-map.png";

const ADDRESS =
  "First Floor, GM57+PR, Ring Rd, opposite Novotel Hotel, Venkateswara Nagar, Veterinary Colony, Vijayawada, Andhra Pradesh 520008";

const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `Lakshmee Foundation Hospital, ${ADDRESS}`
)}`;

export default function VisitUs() {
  return (
    <section className="visit-us">
      <div className="visit-us-head">
        <p className="page-eyebrow">Visit us</p>
        <div className="page-section-head">
          <h2 className="visit-us-title">
            Find your way
            <br />
            to the hospital.
          </h2>
          <p className="page-section-note">
            Our flagship campus on Marine Drive, with valet and multi-level
            parking for over 600 vehicles.
          </p>
        </div>
      </div>

      <div className="visit-us-card">
        <div className="visit-us-info">
          <div className="visit-us-block">
            <p className="visit-us-label">Address</p>
            <h3>Lakshmee Foundation Hospital</h3>
            <address>{ADDRESS}</address>
          </div>

          <div className="visit-us-block">
            <p className="visit-us-label">Parking</p>
            <p>
              Multi-level parking (P1–P3) with 600+ spaces. Complimentary valet
              at the main entrance. Dedicated ambulance &amp; accessible bays at
              Gate 2.
            </p>
          </div>

          <div className="visit-us-block">
            <p className="visit-us-label">Nearest landmarks</p>
            <p>2 min from Churchgate Station · Opposite Marine Drive promenade</p>
          </div>

          <div className="visit-us-hours">
            <span>Mon - sun</span>
            <span>7:00 AM - 8:00 PM</span>
          </div>
        </div>

        <a
          href={MAPS_URL}
          target="_blank"
          rel="noreferrer"
          className="visit-us-map"
          aria-label="Open hospital location in Google Maps"
        >
          <img src={mapImage} alt="Map of Andhra Pradesh showing the hospital region" />
          <span className="visit-us-map-cta">Open in Google Maps</span>
        </a>
      </div>
    </section>
  );
}
