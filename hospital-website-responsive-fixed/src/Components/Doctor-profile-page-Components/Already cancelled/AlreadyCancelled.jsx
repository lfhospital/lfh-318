import React from "react";
import "./AlreadyCancelled.css";

import doctorImg from "../../../asserts/doctor.png";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/DoctorFooter";
import { Check } from "lucide-react";

export default function AlreadyCancelled() {
  return (
    <>
      <Navbar />

      <div className="ac-already-cancelled-page">
        {/* ================= HEADER ================= */}
        <div className="ac-already-cancelled-header">
          <h1>This appointment is already cancelled.</h1>

          <p>No further action needed. Here's the latest on your refund.</p>
        </div>

        {/* ================= MAIN CONTENT ================= */}
        <div className="ac-already-cancelled-main">
          {/* ================= APPOINTMENT CARD ================= */}
          <div className="ac-cancelled-appointment-card">
            <div className="ac-cancelled-card-left">
              <div className="ac-cancelled-date">
                Cancelled · 2 May, 9:14 PM
              </div>

              <div className="ac-doctor-section">
                <img
                  src={doctorImg}
                  alt="Doctor"
                  className="ac-cancelled-doctor-image"
                />

                <div className="ac-doctor-details">
                  <h2>Dr. Ananya Menon</h2>
                  <p>Cardiologist · Interventional</p>
                </div>
              </div>

              <div className="ac-cancelled-divider"></div>

              <div className="ac-appointment-info">
                <div className="ac-info-row">
                  <span className="ac-info-label">Was</span>

                  <div className="ac-info-value ac-cancelled-old-date">
                    <span>Mon, 10 May 2026</span>
                    <span>5:30 PM</span>
                  </div>
                </div>

                <div className="ac-info-row">
                  <span className="ac-info-label">Reason</span>

                  <span className="ac-info-value">Schedule conflict</span>
                </div>

                <div className="ac-info-row">
                  <span className="ac-info-label">Cancellation ref</span>

                  <span className="ac-info-value">CXL-26-7741-A479</span>
                </div>
              </div>
            </div>

            {/* ================= STATUS ================= */}
            <div className="ac-cancelled-status">
              <div className="ac-status-label">STATUS</div>

              <div className="ac-status-title">Cancelled</div>

              <div className="ac-status-subtitle">refund processing</div>
            </div>
          </div>

          {/* ================= REFUND TIMELINE ================= */}
          <div className="ac-refund-timeline-card">
            <div className="ac-timeline-heading">REFUND TIMELINE</div>

            {/* Step 1 */}
            <div className="ac-timeline-step">
              <div className="ac-timeline-icon ac-completed"><Check size={14} /></div>

              <div className="ac-timeline-content">
                <div className="ac-timeline-title">Cancellation confirmed</div>

                <div className="ac-timeline-description">
                  Slot released to other patients
                </div>
              </div>

              <div className="ac-timeline-time">Just now</div>
            </div>

            {/* Step 2 */}
            <div className="ac-timeline-step">
              <div className="ac-timeline-icon ac-processing">
                <span></span>
              </div>

              <div className="ac-timeline-content">
                <div className="ac-timeline-title">Refund initiated</div>

                <div className="ac-timeline-description">
                  Sent to your bank for processing
                </div>
              </div>

              <div className="ac-timeline-time">In progress</div>
            </div>

            {/* Step 3 */}
            <div className="ac-timeline-step">
              <div className="ac-timeline-icon ac-pending"></div>

              <div className="ac-timeline-content">
                <div className="ac-timeline-title">Refund credited</div>

                <div className="ac-timeline-description">
                  Credited to source
                </div>
              </div>

              <div className="ac-timeline-time">in 3–5 working days</div>
            </div>

            <div className="ac-timeline-divider"></div>
          </div>
        </div>

        {/* ================= REFUND NOTICE ================= */}
        <div className="ac-refund-success-notice">
          <div className="ac-success-icon"><Check size={16}/></div>

          <span>
            Refund of ₹841 is on the way. You'll see it in your source account
            in 1–3 more working days.
          </span>
        </div>

        {/* ================= BOTTOM BUTTONS ================= */}
        <div className="ac-cancelled-actions">
          <button className="ac-new-visit-button">
            <span>Book a new visit</span>
            <span className="ac-new-visit-arrow">→</span>
          </button>

          <button className="ac-download-tip-button">
            Download cancellation tip
          </button>
        </div>
      </div>

      <Footer />
    </>
  );
}
