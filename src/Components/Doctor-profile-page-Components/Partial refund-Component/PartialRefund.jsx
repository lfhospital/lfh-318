import React from "react";
import "./PartialRefund.css";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/DoctorFooter";
import { Check, ChevronLeft } from "lucide-react";

export default function PartialRefund() {
  return (
    <>
      <Navbar />

      <div className="p-refund-page">
        <div className="p-refund-header">
          <h1>Partial refund will apply.</h1>

          <p>
            You're 14 hours from your visit, within our 50% refund window.
            Here's the exact breakdown.
          </p>
        </div>

        <div className="p-refund-container">
          <div className="p-visit-time">
            VISIT IN 1 HR 22 MIN · 6:52 PM TODAY
          </div>

          <div className="p-refund-card">
            <div className="p-refund-row">
              <span>Original payment</span>
              <span>₹841</span>
            </div>

            <div className="p-refund-row">
              <span>Cancellation fee · 2-24 hrs</span>
              <span className="p-fee">- ₹421 (50%)</span>
            </div>

            <div className="p-refund-row">
              <span>Booking platform fee</span>
              <span>Non-refundable</span>
            </div>

            <div className="p-refund-divider"></div>

            <div className="p-refund-total">
              <span>You'll receive back</span>
              <strong>₹420</strong>
            </div>

            <div className="p-refund-note">
              <span className="p-star">★</span>

              <span>
                Refund will be initiated within 3–5 working days to source
              </span>
            </div>
          </div>

          <div className="p-reschedule-tip">
            <div className="p-tip-icon"><Check size={20} /></div>

            <div>
              <span>Tip:</span> Reschedule instead and we'll carry forward your
              full ₹841 to the new slot, no fee.
            </div>
          </div>
        </div>

        <div className="p-refund-actions">
          <button className="p-keep-appointment">
            <span className="p-back-arrow"><ChevronLeft size={16}  /></span>
            <span>Keep my appointment</span>
          </button>

          <div className="p-right-actions">
            <button className="p-reschedule-button">Reschedule instead</button>

            <button className="p-cancel-button">Cancel without refund</button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
