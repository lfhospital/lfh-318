import React from "react";
import image from "../../../asserts/doctor.png";
import "./DoctorsSection.css";

export default function DoctorsHelpSection() {
  const doctors = [
    {
      id: 1,
      name: "Dr. Ananya Menon",
      specialization: "Cardiologist · Interventional",
      qualification: "MBBS, MD — Cardiology, DM (AIIMS)",
      rating: "4.9",
      reviews: "412 REVIEWS",
      experience: "18+",
      consults: "6,200+",
      fee: "800",
    },
    {
      id: 2,
      name: "Dr. Ananya Menon",
      specialization: "Cardiologist · Interventional",
      qualification: "MBBS, MD — Cardiology, DM (AIIMS)",
      rating: "4.9",
      reviews: "412 REVIEWS",
      experience: "18+",
      consults: "6,200+",
      fee: "800",
    },
    {
      id: 3,
      name: "Dr. Ananya Menon",
      specialization: "Cardiologist · Interventional",
      qualification: "MBBS, MD — Cardiology, DM (AIIMS)",
      rating: "4.9",
      reviews: "412 REVIEWS",
      experience: "18+",
      consults: "6,200+",
      fee: "800",
    },
  ];

  return (
    <section className="doctors-help-section">
      <div className="doctors-header">
        <div className="doctors-content">
          <span className="section-label">04 · OUR DOCTORS</span>

          <h1>
            Consultants you can
            <br />
            actually reach.
          </h1>

          <p>
            Every doctor on our panel is fellowship-trained,
            board-certified and committed to continuity of care
            across your in-person and follow-up visits.
          </p>
        </div>

        <button className="speview-all-btn">View all</button>
      </div>

      <div className="doctors-grid">
        {doctors.map((doctor) => (
          <div className="specdoctor-card" key={doctor.id}>
            <div className="doctor-top">
              <img src={image} alt={doctor.name} />

              <div className="doctor-info">
                <h2>{doctor.name}</h2>

                <h4 className="spc">{doctor.specialization}</h4>

                <span>{doctor.qualification}</span>
              </div>
            </div>

            <div className="stats-section">
              <div className="stat-item">
                <h3><span>★</span> {doctor.rating}</h3>
                <p>({doctor.reviews})</p>
              </div>

              <div className="stat-item">
                <h3>{doctor.experience}</h3>
                <p>YEARS EXP.</p>
              </div>

              <div className="stat-item">
                <h3>{doctor.consults}</h3>
                <p>CONSULTS</p>
              </div>
            </div>

            <div className="card-footer">
              <div className="fee-box">
                <span className="docprice">₹ {doctor.fee}</span>
                <span className="visit-text"> / visit</span>
              </div>

              <div className="action-buttons">
                <button className="profile-btn">Profile</button>
                <button className="dockbook-btn">Book</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="help-section">
        <div className="help-left">
          <h2>Got questions about booking?</h2>

          <p>
            Booking guidance, insurance, second opinion.
            All in one place.
          </p>
        </div>

        <button className="help-link">
          <span className="help-link-text">
            Visit help centre
          </span>

          <span>→</span>
        </button>
      </div>
    </section>
  );
}