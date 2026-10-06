import React from "react";
import "./PaymentFailed.css";
import { ChevronLeft, AlertCircle, Star } from "lucide-react";

import doctor from "../../../asserts/doctor.png";
import Footer from "../Footer/DoctorFooter";
import Navbar from "../Navbar/Navbar";

export default function PaymentFailed() {
  return (
    <>
      <Navbar />
      <section className="dc-payment-failed-page">
        <div className="dc-payment-failed-container">
          {/* LEFT SECTION */}
          <div className="dc-payment-failed-left">
            <div className="dc-payment-failed-header">
              <h1>Your payment didn't go through.</h1>

              <p>
                No money has left your account. Your slot is held for 9 minutes,
                pick a different method or try again.
              </p>
            </div>

            {/* ERROR MESSAGE */}
            <div className="dc-payment-error-box">
              <div className="dc-payment-error-icon">
                <AlertCircle size={36} strokeWidth={2} />
              </div>

              <div className="dc-payment-error-content">
                <h3>User declined the payment</h3>

                <p>Try another method below, your slot is still locked.</p>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="dc-payment-action-buttons">
              <button className="dc-payment-back-button">
                <ChevronLeft size={19} strokeWidth={1.5} />

                <span>Back</span>
              </button>

              <button className="dc-payment-try-button">Try again</button>
            </div>
          </div>

          {/* RIGHT BOOKING CARD */}
          <div className="dc-booking-hold-card">
            <div className="dc-booking-hold-title">BOOKING ON HOLD</div>

            {/* DOCTOR */}
            <div className="dc-booking-doctor">
              <img
                src={doctor}
                alt="Doctor"
                className="dc-booking-doctor-image"
              />

              <div className="dc-booking-doctor-details">
                <h2>Dr. Ananya Menon</h2>

                <p>Cardiologist · Interventional</p>
              </div>
            </div>

            {/* DIVIDER */}
            <div className="dc-booking-card-divider"></div>

            {/* TOTAL */}
            <div className="dc-booking-total-row">
              <span>Total</span>

              <strong>₹841</strong>
            </div>

            {/* NOTICE */}
            <div className="dc-booking-notice">
              <Star size={12} fill="currentColor" strokeWidth={1} />

              <p>
                No money left your account. The slot stays held for 9 more
                minutes.
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
