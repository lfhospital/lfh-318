import React from "react";
import "./RescheduleConfirm.css";

import doctorImg from "../../../../asserts/doctor.png";
import Footer from "../../Footer/DoctorFooter";
import Navbar from "../../Navbar/Navbar";
import { ArrowRight, ChevronLeft } from "lucide-react";

export default function RescheduleConfirm({ onConfirm, onBack }) {
  return (
    <>
      <Navbar />

      <div className="rs-page">
        {/* ================= HEADER ================= */}
        <div className="rs-header">
          <h1>That slot just got taken.</h1>
          <p>
            Another patient locked it before you. Pick one of these they're the
            closest to what you wanted.
          </p>
        </div>

        {/* ================= MAIN CONTENT ================= */}
        <div className="rs-main">
          {/* ================= NEW VISIT CARD ================= */}
          <div className="rs-new-visit-card">
            <div className="rs-card-heading">
              <h2>Your new visit</h2>
              <span>Same booking ID will be retained</span>
            </div>

            <div className="rs-visit-comparison">
              {/* ORIGINAL */}
              <div className="rs-visit-box rs-original">
                <div className="rs-box-top">
                  <span>ORIGINAL</span>
                  <strong>CANCELLED</strong>
                </div>

                <div className="rs-date-number">
                  <del>10</del>
                </div>

                <del className="rs-date-text">May 2026 · Sun</del>

                <del className="rs-time-text">5:30 PM</del>
              </div>

              {/* ARROW */}
              <div className="rs-comparison-arrow"><ArrowRight size={30} /></div>

              {/* NEW VISIT */}
              <div className="rs-visit-box rs-new">
                <div className="rs-box-top">
                  <span>NEW VISIT</span>
                  <strong>CONFIRMED</strong>
                </div>

                <div className="rs-date-number">11</div>

                <div className="rs-date-text">May 2026 · Sun</div>

                <div className="rs-time-text">5:30 PM</div>
              </div>
            </div>

            {/* PRICE NOTICE */}
            <div className="rs-price-notice">
              <h3>No price difference</h3>
              <p>Same visit type at the same fee, first reschedule is on us.</p>
            </div>

            {/* RELEASE NOTICE */}
            <div className="rs-release-notice">
              <span className="rs-info-icon">!</span>
              <span>
                Your original 10 May slot will be released the moment you
                confirm.
              </span>
            </div>

            {/* ACTIONS */}
            <div className="rs-actions">
              <button className="rs-back-button" onClick={onBack}>
                <span><ChevronLeft size={16} /></span>
                <u>Pick a different slot</u>
              </button>

              <button className="rs-confirm-button" onClick={onConfirm}>
                Confirm reschedule
                <span><ArrowRight size={16} /></span>
              </button>
            </div>
          </div>

          {/* ================= BOOKING CARD ================= */}
          <div className="rs-booking-card">
            <div className="rs-booking-label">BOOKING</div>

            {/* DOCTOR */}
            <div className="rs-doctor">
              <img
                src={doctorImg}
                alt="Dr. Ananya Menon"
                className="rs-doctor-image"
              />

              <div className="rs-doctor-details">
                <h2>Dr. Ananya Menon</h2>
                <p>Cardiologist · Interventional</p>
              </div>
            </div>

            <div className="rs-booking-divider"></div>

            {/* FROM */}
            <div className="rs-booking-row">
              <span>From</span>

              <div className="rs-booking-value rs-from">
                <del>Sun 10 May</del>
                <del>5:30 PM</del>
              </div>
            </div>

            {/* TO */}
            <div className="rs-booking-row">
              <span>To</span>

              <div className="rs-booking-value rs-to">
                <strong>Mon 11 May</strong>
                <span>5:30 PM</span>
              </div>
            </div>

            {/* VISIT TYPE */}
            <div className="rs-booking-row rs-visit-type-row">
              <span>Visit type</span>

              <div className="rs-booking-value">
                First consultation&nbsp; · &nbsp;25–30 min
              </div>
            </div>

            {/* BOOKING ID */}
            <div className="rs-booking-reminder">
              <span>★</span>
              Booking ID stays the same
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
