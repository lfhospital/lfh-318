import React from "react";
import "./CancellationComplete.css";

import {
  Check,
  Phone,
  ArrowDownToLine,
  Clock,
} from "lucide-react";
import Navbar from "../../Navbar/Navbar";
import Footer from "../../Footer/DoctorFooter";

export default function CancellationComplete() {
  return (
    <>
      <Navbar />
      <div className="refund-page">
        {/* =====================================================
          PROGRESS INDICATOR
      ===================================================== */}

        <div className="refund-progress">
          <div className="refund-progress-line">
            <span className="refund-progress-dot refund-progress-active"></span>
            <span className="refund-progress-bar"></span>
            <span className="refund-progress-dot refund-progress-active"></span>
          </div>

          <div className="refund-progress-step refund-progress-step-one">
            <h4>Proceed with cancellation</h4>
            <p>This is a description.</p>
          </div>

          <div className="refund-progress-step refund-progress-step-two">
            <h4>Done</h4>
            <p>This is a description.</p>
          </div>
        </div>

        {/* =====================================================
          REFUND MAIN CARD
      ===================================================== */}

        <div className="refund-main-card">
          {/* Header */}
          <div className="refund-card-header">
            <h1>Refund initiated</h1>

            <span>3-5 working days</span>
          </div>

          <div className="refund-divider"></div>

          {/* Amount */}
          <div className="refund-amount-row">
            <span className="refund-amount-label">AMOUNT</span>

            <div className="refund-amount-value">
              <strong>₹841</strong>
              <span>Full refund</span>
            </div>
          </div>

          <div className="refund-divider refund-amount-divider"></div>

          {/* =================================================
            REFUND STATUS BOX
        ================================================= */}

          <div className="refund-status-box">
            {/* Cancellation Confirmed */}
            <div className="refund-status-row">
              <div className="refund-status-left">
                <div className="refund-status-icon refund-status-complete">
                  <Check size={10} strokeWidth={2.5} />
                </div>

                <div className="refund-status-content">
                  <strong>Cancellation confirmed</strong>
                  <span>Slot released to other patients</span>
                </div>
              </div>

              <span className="refund-status-time">Just now</span>
            </div>

            {/* Refund Initiated */}
            <div className="refund-status-row">
              <div className="refund-status-left">
                <div className="refund-status-icon refund-status-progress">
                </div>

                <div className="refund-status-content">
                  <strong>Refund initiated</strong>
                  <span>Sent to your bank for processing</span>
                </div>
              </div>

              <span className="refund-status-time">In progress</span>
            </div>

            {/* Refund Credited */}
            <div className="refund-status-row">
              <div className="refund-status-left">
                <div className="refund-status-icon refund-status-pending"></div>

                <div className="refund-status-content">
                  <strong>Refund credited</strong>
                  <span>Credited to source</span>
                </div>
              </div>

              <span className="refund-status-time">In 3–5 working days</span>
            </div>

            {/* =================================================
              TOTAL REFUND
          ================================================= */}

            <div className="refund-total-divider"></div>

            <div className="refund-total-row">
              <strong>You'll receive back</strong>

              <strong>₹841</strong>
            </div>

            {/* Refund Note */}

            <div className="refund-note">
              <span className="refund-note-star">★</span>

              <p>
                Refund will be processed to the source in 3–5 working days.
                We'll notify you the moment it lands.
              </p>
            </div>
          </div>
        </div>

        {/* =====================================================
          QUICK ACTIONS
      ===================================================== */}

        <div className="refund-quick-actions">
          {/* Book another visit */}
          <button className="refund-action-card">
            <div className="refund-action-icon">
              <Clock size={14} strokeWidth={1.8} />
            </div>

            <div className="refund-action-content">
              <strong>Book another visit</strong>

              <span>Need a description</span>
            </div>
          </button>

          {/* Download cancellation slip */}
          <button className="refund-action-card">
            <div className="refund-action-icon">
              <ArrowDownToLine size={14} strokeWidth={1.8} />
            </div>

            <div className="refund-action-content">
              <strong>Download cancellation slip</strong>

              <span>PDF receipt &amp; appointment slip for insurance.</span>
            </div>
          </button>

          {/* Talk to coordinator */}
          <button className="refund-action-card">
            <div className="refund-action-icon">
              <Phone size={14} strokeWidth={1.8} />
            </div>

            <div className="refund-action-content">
              <strong>Talk to a care coordinator</strong>

              <span>
                Get directions details on Lakshmee Foundation Hospital
              </span>
            </div>
          </button>
        </div>

        {/* =====================================================
          QUICK ACTION LABEL
      ===================================================== */}

        <div className="refund-quick-label">QUICK ACTIONS</div>

        {/* =====================================================
          BOTTOM BUTTONS
      ===================================================== */}

        <div className="refund-bottom-actions">
          <button className="refund-appointments-btn">
            Go to my appointments
          </button>

          <button className="refund-home-btn">Back to home</button>
        </div>
      </div>
      <Footer />
    </>
  );
}
