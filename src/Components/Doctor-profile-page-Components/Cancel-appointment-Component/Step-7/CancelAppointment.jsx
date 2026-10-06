import React, { useState } from "react";
import "./CancelAppointment.css";

import doctorImg from "../../../../asserts/doctor.png";
import Navbar from "../../Navbar/Navbar";
import Footer from "../../Footer/DoctorFooter";

import {
  ArrowRight,
  Calendar,
  ChevronLeft,
  CircleEllipsis,
  CircleOff,
  Heart,
  X,
} from "lucide-react";

export default function CancelAppointment({ onCancellationComplete }) {
  const [selectedReason, setSelectedReason] = useState("Scheduled conflict");

  // =========================
  // CANCEL DIALOG STATE
  // =========================
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const reasons = [
    {
      title: "Scheduled conflict",
      subtitle: "Not available at this time",
      icon: <Calendar size={16} />,
    },
    {
      title: "Booked by mistake",
      subtitle: "Wrong doctor or date",
      icon: <CircleOff size={16} />,
    },
    {
      title: "Feeling better",
      subtitle: "Symptoms have resolved",
      icon: <Heart size={16} />,
    },
    {
      title: "Other",
      subtitle: "Wrong doctor or date",
      icon: <CircleEllipsis size={16} />,
    },
  ];

  // =========================
  // OPEN CANCEL DIALOG
  // =========================
  const handleConfirmCancellation = () => {
    setShowCancelDialog(true);
  };

  // =========================
  // CLOSE CANCEL DIALOG
  // =========================
  const handleCloseCancelDialog = () => {
    setShowCancelDialog(false);
  };

  // =========================
  // FINAL CANCELLATION
  // =========================
  const handleFinalCancellation = () => {
    setShowCancelDialog(false);

    // Move to Step 8 after the cancellation is confirmed.
    if (onCancellationComplete) {
      onCancellationComplete();
    }
  };

  return (
    <>
      <Navbar />

      <div className="cancel-page">
        {/* ================= TOP PROGRESS ================= */}
        <div className="cancel-progress">
          <div className="cancel-progress-line">
            <span className="cancel-progress-dot cancel-active-dot"></span>
            <span className="cancel-progress-dot cancel-done-dot"></span>
          </div>

          <div className="cancel-progress-step cancel-step-one">
            <h4>Proceed with cancellation</h4>
            <p>This is a description.</p>
          </div>

          <div className="cancel-progress-step cancel-step-two">
            <h4>Done</h4>
            <p>This is a description.</p>
          </div>
        </div>

        {/* ================= MAIN CONTENT ================= */}
        <div className="cancel-main-wrapper">
          {/* ================= LEFT CARD ================= */}
          <div className="cancel-left-card">
            {/* Back */}
            <button className="cancel-back-btn">
              <ChevronLeft size={18} />
              Back
            </button>

            {/* Heading */}
            <h1 className="cancel-title">
              Are you sure you want to cancel this visit?
            </h1>

            <div className="cancel-subtitle-block">
              <p className="cancel-release-text">This will release your slot</p>

              <p className="cancel-info-text">
                Other patients may book it within minutes. Try{" "}
                <span>rescheduling</span> if your time has changed, it keeps the
                doctor reserved for you.
              </p>
            </div>

            {/* ================= REASON SECTION ================= */}
            <div className="cancel-section">
              <div className="cancel-section-header">
                <h2>Reason for cancelling</h2>
                <span>Optional - helps us improve</span>
              </div>

              <div className="cancel-divider"></div>

              <div className="cancel-reasons-grid">
                {reasons.map((reason) => (
                  <button
                    key={reason.title}
                    className={`cancel-reason-card ${
                      selectedReason === reason.title ? "cancel-selected" : ""
                    }`}
                    onClick={() => setSelectedReason(reason.title)}
                  >
                    <div className="cancel-reason-icon">{reason.icon}</div>

                    <div className="cancel-reason-content">
                      <strong>{reason.title}</strong>
                      <span>{reason.subtitle}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* ================= REFUND SECTION ================= */}
            <div className="cancel-section cancel-refund-section">
              <div className="cancel-section-header">
                <h2>Refund summary</h2>
                <span>As per cancellation policy</span>
              </div>

              <div className="cancel-divider"></div>

              <div className="cancel-refund-box">
                <div className="cancel-refund-row">
                  <span>Original payment</span>
                  <strong>₹841</strong>
                </div>

                <div className="cancel-refund-row">
                  <span>Cancellation policy</span>
                  <strong className="cancel-green">100% refundable</strong>
                </div>

                <div className="cancel-refund-row">
                  <span>Booking platform fee</span>
                  <strong>₹49 (refunded)</strong>
                </div>

                <div className="cancel-refund-divider"></div>

                <div className="cancel-total-row">
                  <strong>You'll receive back</strong>
                  <strong>₹841</strong>
                </div>

                <div className="cancel-refund-note">
                  <span>★</span>
                  Refund will be processed to the source in 3-5 working days.
                  We'll notify you the moment it lands.
                </div>
              </div>
            </div>

            {/* ================= BOTTOM ACTIONS ================= */}
            <div className="cancel-bottom-actions">
              <button className="cancel-keep-btn">
                <ChevronLeft size={15} />
                Keep my appointment
              </button>

              {/* IMPORTANT:
                  This now opens the confirmation dialog
              */}
              <button
                className="cancel-confirm-btn"
                onClick={handleConfirmCancellation}
              >
                Confirm cancellation
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* ================= RIGHT CARD ================= */}
          <div className="cancel-right-card">
            <p className="cancel-right-label">YOU'RE CANCELLING</p>

            {/* Doctor */}
            <div className="cancel-doctor">
              <img
                src={doctorImg}
                alt="Dr. Ananya Menon"
                className="cancel-doctor-image"
              />

              <div className="cancel-doctor-info">
                <h2>Dr. Ananya Menon</h2>
                <p>Cardiologist · Interventional</p>
              </div>
            </div>

            <div className="cancel-right-divider"></div>

            {/* Appointment Details */}
            <div className="cancel-detail-row">
              <span>Date &amp; time</span>

              <div>
                <strong>Sun 10 May</strong>
                <strong>5:30 PM</strong>
              </div>
            </div>

            <div className="cancel-detail-row">
              <span>Visit type</span>

              <strong>First consultation · 25-30 min</strong>
            </div>

            <div className="cancel-detail-row">
              <span>Booking ID</span>

              <strong>LKM-26-A479-2207</strong>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* =====================================================
          CANCEL CONFIRMATION DIALOG
      ===================================================== */}

      {showCancelDialog && (
        <div className="cancel-modal-overlay" onClick={handleCloseCancelDialog}>
          <div
            className="cancel-modal"
            onClick={(event) => event.stopPropagation()}
          >
            {/* ================= MODAL HEADER ================= */}
            <div className="cancel-modal-header">
              <h2>Cancel this appointment?</h2>

              <button
                className="cancel-modal-close"
                onClick={handleCloseCancelDialog}
                aria-label="Close"
              >
                <X size={14} strokeWidth={1.5} />
              </button>
            </div>

            {/* ================= MODAL SUBTITLE ================= */}
            <p className="cancel-modal-subtitle">
              This can't be undone but you can re-book any time.
            </p>

            {/* ================= MODAL MESSAGE ================= */}
            <p className="cancel-modal-message">
              Your slot will be released to other patients. A full refund of
              ₹841 will be initiated to the source immediately.
            </p>

            {/* ================= MODAL ACTIONS ================= */}
            <div className="cancel-modal-actions">
              <button
                className="cancel-modal-keep"
                onClick={handleCloseCancelDialog}
              >
                Keep Appointment
              </button>

              <button
                className="cancel-modal-confirm"
                onClick={handleFinalCancellation}
              >
                Yes, cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
