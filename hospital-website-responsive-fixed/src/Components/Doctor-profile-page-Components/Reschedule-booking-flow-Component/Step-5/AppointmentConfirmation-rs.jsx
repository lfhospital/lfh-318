import React from "react";
import "./AppointmentConfirmation-rs.css";

import doctorImg from "../../../../asserts/doctor.png";
import Navbar from "../../Navbar/Navbar";
import Footer from "../../Footer/DoctorFooter";

export default function AppointmentConfirmation_rs({ onConfirm, onBack }) {
  return (
    <>
      <Navbar />

      <div className="as-reschedule-page">
        {/* =====================================================
            PROGRESS
        ===================================================== */}

        <div className="as-progress-wrapper">
          <div className="as-progress-line as-progress-line-two"></div>
          <div className="as-progress-line as-progress-line-one"></div>

          <div className="as-progress-step as-active">
            <div className="as-progress-dot"></div>

            <h4>Patient Info</h4>

            <p>
              Let's begin with a few
              <br />
              details about you.
            </p>
          </div>

          <div className="as-progress-step as-active as-review-step">
            <div className="as-progress-dot"></div>

            <h4>Review</h4>

            <p>
              Please verify your
              <br />
              information before we
              <br />
              proceed.
            </p>
          </div>

          <div className="as-progress-step as-done-step">
            <div className="as-progress-dot"></div>

            <h4>Done</h4>

            <p>
              You're all set. Your
              <br />
              appointment has been
              <br />
              successfully booked.
            </p>
          </div>
        </div>

        {/* =====================================================
            MAIN CONTENT
        ===================================================== */}

        <div className="as-confirmation-content">
          {/* =================================================
              LEFT CARD
          ================================================= */}

          <section className="as-visit-card">
            <div className="as-visit-header">
              <h1>Your new visit</h1>

              <span>Same booking ID will be retained</span>
            </div>

            {/* =============================================
                OLD / NEW APPOINTMENT
            ============================================= */}

            <div className="as-appointment-comparison">
              {/* ORIGINAL */}

              <div className="as-appointment-box as-original-box">
                <div className="as-appointment-box-header">
                  <span>ORIGINAL</span>

                  <span>CANCELLED</span>
                </div>

                <div className="as-appointment-date">10</div>

                <div className="as-appointment-month">May 2026 · Sun</div>

                <div className="as-appointment-time">5:30 PM</div>
              </div>

              {/* ARROW */}

              <div className="as-change-arrow">→</div>

              {/* NEW */}

              <div className="as-appointment-box as-new-box">
                <div className="as-appointment-box-header">
                  <span>NEW VISIT</span>

                  <span className="as-confirmed">CONFIRMED</span>
                </div>

                <div className="as-appointment-date as-new-date">11</div>

                <div className="as-appointment-month">May 2026 · Sun</div>

                <div className="as-appointment-time as-new-time">5:30 PM</div>
              </div>
            </div>

            {/* =============================================
                PRICE INFORMATION
            ============================================= */}

            <div className="as-price-information">
              <strong>No price difference</strong>

              <span>
                Same visit type at the same fee, first reschedule is on us.
              </span>
            </div>

            {/* =============================================
                RELEASE INFORMATION
            ============================================= */}

            <div className="as-release-information">
              <span className="as-info-icon">i</span>

              <p>
                Your original 10 May slot will be released the moment you
                confirm.
              </p>
            </div>

            {/* =============================================
                CARD FOOTER
            ============================================= */}

            <div className="as-visit-footer">
              <button className="as-different-slot-button" onClick={onBack}>
                <span className="as-back-arrow">‹</span>

                <span className="as-underlined">Pick a different slot</span>
              </button>

              <button className="as-confirm-button" onClick={onConfirm}>
                <span>Confirm reschedule</span>

                <span className="as-button-arrow">→</span>
              </button>
            </div>
          </section>

          {/* =================================================
              RIGHT BOOKING CARD
          ================================================= */}

          <aside className="as-booking-card">
            <div className="as-booking-title">BOOKING</div>

            {/* =============================================
                DOCTOR
            ============================================= */}

            <div className="as-doctor-section">
              <img
                src={doctorImg}
                alt="Dr. Ananya Menon"
                className="as-doctor-image"
              />

              <div className="as-doctor-details">
                <h2>Dr. Ananya Menon</h2>

                <p>Cardiologist · Interventional</p>
              </div>
            </div>

            <div className="as-booking-divider"></div>

            {/* =============================================
                CURRENT / FROM
            ============================================= */}

            <div className="as-booking-detail-row">
              <span className="as-detail-label">From</span>

              <div className="as-detail-value as-old-value">
                <del>Sun 10 May</del>

                <del>5:30 PM</del>
              </div>
            </div>

            {/* =============================================
                NEW / TO
            ============================================= */}

            <div className="as-booking-detail-row">
              <span className="as-detail-label">To</span>

              <div className="as-detail-value">
                <span className="as-new-value">Mon 11 May</span>

                <span>5:30 PM</span>
              </div>
            </div>

            {/* =============================================
                VISIT TYPE
            ============================================= */}

            <div className="as-booking-detail-row as-visit-type-row">
              <span className="as-detail-label">Visit type</span>

              <div className="as-detail-value as-visit-value">
                First consultation · 25–30 min
              </div>
            </div>

            {/* =============================================
                BOOKING ID
            ============================================= */}

            <div className="as-booking-id">
              <span className="as-star-icon">★</span>

              <span>Booking ID stays the same</span>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </>
  );
}
