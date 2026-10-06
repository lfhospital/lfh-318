import React from "react";
import { ArrowRight } from "lucide-react";
import "./DoubleBooking.css";

import doctor from "../../../asserts/doctor.png";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/DoctorFooter";

export default function DoubleBooking() {
  return (
    <>
      <Navbar />

      <main className="db-existing-visit-page">
        <div className="db-existing-visit-wrapper">
          {/* PAGE HEADER */}
          <header className="db-existing-visit-header">
            <h1>You already have a visit scheduled.</h1>

            <p>
              Looks like a duplicate. Manage your existing appointment, or book
              a different doctor for that slot.
            </p>
          </header>

          {/* BOOKING CARD */}
          <section className="db-existing-booking-card">
            {/* LEFT SIDE */}
            <div className="db-existing-booking-left">
              <div className="db-existing-booking-label">
                EXISTING BOOKING FOUND
              </div>

              {/* DOCTOR */}
              <div className="db-existing-doctor">
                <img
                  src={doctor}
                  alt="Dr. Ananya Menon"
                  className="db-existing-doctor-image"
                />

                <div className="db-existing-doctor-info">
                  <h2>Dr. Ananya Menon</h2>
                  <p>Cardiologist · Interventional</p>
                </div>
              </div>

              <div className="db-existing-divider"></div>

              {/* BOOKING ID */}
              <div className="db-existing-detail-row">
                <span>Booking ID</span>
                <strong>LKM-26-A479-2207</strong>
              </div>

              {/* DATE & TIME */}
              <div className="db-existing-detail-row">
                <span>Date &amp; time</span>

                <div className="db-existing-detail-value">
                  <strong>Mon, 11 May 2026</strong>
                  <small>5:30 PM · 25–30 min</small>
                </div>
              </div>

              {/* VISIT TYPE */}
              <div className="db-existing-detail-row">
                <span>Visit type</span>
                <strong>First consultation</strong>
              </div>

              {/* PATIENT */}
              <div className="db-existing-detail-row">
                <span>Patient</span>

                <div className="db-existing-detail-value">
                  <strong>Rohan Iyer</strong>
                  <small>+91 98765 43210</small>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="db-new-visit-panel">
              <div className="db-new-visit-label">YOUR NEW VISIT</div>

              <div className="db-new-visit-date">
                <span className="db-new-visit-day">11</span>

                <span className="db-new-visit-month">May 2026 · Mon</span>
              </div>

              <div className="db-new-visit-time">5:30 PM</div>

              <p className="db-new-visit-arrival">Arrive 15 minutes early</p>
            </div>
          </section>

          {/* QUICK ACTIONS */}
          <section className="db-quick-actions">
            <div className="db-quick-actions-label">QUICK ACTIONS</div>

            <div className="db-action-buttons">
              <button className="db-reschedule-button">
                <span>Reschedule</span>
                <ArrowRight size={20} strokeWidth={1.7} />
              </button>

              <button className="db-cancel-button">Cancel</button>

              <button className="db-appointments-button">
                Go to my appointments
              </button>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
