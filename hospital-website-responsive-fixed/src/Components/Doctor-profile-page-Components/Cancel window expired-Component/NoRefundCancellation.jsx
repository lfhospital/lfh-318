import React from "react";
import { Lock, LockKeyhole, Star } from "lucide-react";
import "./NoRefundCancellation.css";
import Footer from "../Footer/DoctorFooter";
import Navbar from "../Navbar/Navbar";

export default function NoRefundCancellation() {
  return (
    <>
      <Navbar />
      <div className="no-refund-page">
        {/* =====================================================
                PAGE HEADER
            ===================================================== */}

        <div className="no-refund-header">
          <h1>You can still cancel, but no refund applies.</h1>

          <p>
            It's less than 2 hours to your appointment. We've held this slot for
            you and prepared the OPD, so cancellations
            <br />
            now are non-refundable.
          </p>
        </div>

        {/* =====================================================
                MAIN CONTENT
            ===================================================== */}

        <div className="no-refund-content">
          {/* =================================================
                    LEFT CARD
                ================================================= */}

          <div className="no-refund-left-card">
            {/* No Refund Notice */}

            <div className="no-refund-notice">
              <div className="no-refund-notice-icon">
                <Lock  size={16} strokeWidth={1.8} />
              </div>

              <div className="no-refund-notice-content">
                <h3>No-refund window</h3>

                <p>
                  Per our cancellation policy, slots cancelled within 2 hours of
                  the visit are not refunded. We'll still release the slot if
                  you proceed.
                </p>
              </div>
            </div>

            {/* Visit Information */}

            <div className="no-refund-visit">
              VISIT IN 1 HR 22 MIN · 6:52 PM TODAY
            </div>

            {/* Payment Card */}

            <div className="no-refund-payment-card">
              <div className="no-refund-payment-row">
                <span>Original payment</span>
                <strong>₹841</strong>
              </div>

              <div className="no-refund-payment-row">
                <span>Refund eligible</span>
                <strong className="no-refund-zero">0%</strong>
              </div>

              <div className="no-refund-payment-divider"></div>

              <div className="no-refund-receive-row">
                <strong>You'll receive back</strong>
                <strong>₹0</strong>
              </div>

              <div className="no-refund-note">
                <Star size={14} fill="currentColor" strokeWidth={0} />

                <span>
                  If you reschedule instead, your full payment carries over to
                  the new slot.
                </span>
              </div>
            </div>
          </div>

          {/* =================================================
                    RIGHT POLICY CARD
                ================================================= */}

          <div className="no-refund-policy-card">
            <div className="no-refund-policy-title">REFUND POLICY</div>

            <div className="no-refund-policy-header">
              <span>CANCEL</span>
              <span>REFUND</span>
            </div>

            <div className="no-refund-policy-divider"></div>

            <div className="no-refund-policy-row">
              <span>&gt; 24 hrs ahead</span>
              <strong>100%</strong>
            </div>

            <div className="no-refund-policy-row">
              <span>2–24 hrs ahead</span>
              <strong>50%</strong>
            </div>

            <div className="no-refund-policy-row">
              <span>&lt; 2 hrs / after</span>
              <strong>No refund</strong>
            </div>
          </div>
        </div>

        {/* =====================================================
                ACTION BUTTONS
            ===================================================== */}

        <div className="no-refund-actions">
          <button className="no-refund-reschedule-btn">
            Reschedule instead
          </button>

          <button className="no-refund-cancel-btn">
            Cancel without refund
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}
