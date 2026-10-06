import React from "react";
import "./RAppointmentConfirmation.css";
import Navbar from "../../Navbar/Navbar";
import Footer from "../../Footer/DoctorFooter";
import dock from "../../../../asserts/doctor.png";
import { ArrowDownToLine, Calendar, MapPin } from "lucide-react";

export default function RAppointmentConfirmation() {
  return (
    <>
      <Navbar />

      <section className="ac-appointment-confirmation">
        {/* ================================
            PROGRESS STEPPER
        ================================= */}

        <div className="ac-appointment-progress">
          <div className="ac-progress-line progress-line-one"></div>
          <div className="ac-progress-line progress-line-two"></div>
          <div className="ac-progress-step ">
            <div className="ac-progress-circle"></div>

            <h4>Patient Info</h4>

            <p>
              Let's begin with a few
              <br />
              details about you.
            </p>
          </div>

          <div className="ac-progress-step">
            <div className="ac-progress-circle"></div>

            <h4>Review</h4>

            <p>
              Please verify your
              <br />
              information before we
              <br />
              proceed.
            </p>
          </div>

          <div className="ac-progress-step ">
            <div className="ac-progress-circle"></div>

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

        {/* ================================
            CONFIRMATION
        ================================= */}

        <div className="ac-confirmation-header">
          <div className="ac-confirmation-icon">
            <svg viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M14 27L22 35L39 17"
                fill="none"
                stroke="#ffffff"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h1>Your appointment is rescheduled.</h1>

          <p>An updated confirmation has been sent to
            <br />
             email and contact number.</p>

          <p> Your booking ID stays the same.</p>

          <div className="ac-booking-id">
            <span>Booking ID</span>

            <strong>LKM-26-A479-2207</strong>
          </div>
        </div>

        {/* ================================
            APPOINTMENT DETAILS
        ================================= */}

        <div className="ac-appointment-layout">
          {/* LEFT DETAILS CARD */}

          <div className="ac-appointment-details">
            <div className="ac-doctor-header">
              <div className="ac-doctor-image">
                <img src={dock} alt="Dr. Ananya Menon" />
              </div>

              <div className="ac-doctor-info">
                <h2>Dr. Ananya Menon</h2>

                <p>Cardiologist · Interventional</p>
              </div>
            </div>

            <div className="ac-appointment-divider"></div>

            <div className="ac-detail-row">
              <span>Booking ID</span>

              <strong>LKM-26-4479-2207</strong>
            </div>

            <div className="ac-detail-row">
              <span>Updated visit</span>

              <div>
                <strong>Mon, 11 May 2026</strong>

                <small>5:30 PM · 25-30 min</small>
              </div>
            </div>

            <div className="ac-detail-row ac-was-row">
              <span>Was</span>

              <div>
                <strong className="ac-old-date">Mon, 10-May-2026</strong>

                <small className="ac-old-time">5:30 PM</small>
              </div>
            </div>

            <div className="ac-detail-row">
              <span>Visit type</span>

              <div>
                <strong>First consultation</strong>

                <small>In-person</small>
              </div>
            </div>

            <div className="ac-detail-row">
              <span>Patient</span>

              <div>
                <strong>Rohan Iyer</strong>

                <small>+91 98765 43210</small>
              </div>
            </div>
          </div>

          {/* RIGHT VISIT CARD */}

          <div className="ac-visit-card">
            <span className="ac-visit-label">YOUR VISIT</span>

            <div className="ac-visit-date">
              <strong>11</strong>

              <span>May 2026 · Mon</span>
            </div>

            <div className="ac-visit-time">5:30 PM</div>

            <p className="ac-arrive-text">Arrive 15 minutes early</p>
          </div>
        </div>

        {/* ================================
            BOTTOM ACTIONS
        ================================= */}

        <div className="ac-appointment-actions">
          <div className="ac-action-card">
            <div className="ac-action-icon">
              <Calendar size={16} />
            </div>

            <h3>Update calendar</h3>

            <p>Apple · Google · Outlook, with reminders set.</p>
          </div>

          <div className="ac-action-card">
            <div className="ac-action-icon">
              <ArrowDownToLine size={16} />
            </div>

            <h3>Download receipt</h3>

            <p>PDF receipt & appointment slip for insurance.</p>
          </div>

          <div className="ac-action-card">
            <div className="ac-action-icon">
              <MapPin size={16} />
            </div>

            <h3>Get Directions</h3>

            <p>
              Get directions details on Lakshmee Foundation
              <br />
              Hospital
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
