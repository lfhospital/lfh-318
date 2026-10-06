import React, { useState } from "react";
import "./AppointmentSlot.css";

import dock from "../../../../asserts/doctor.png";
import Footer from "../../Footer/DoctorFooter";
import Navbar from "../../Navbar/Navbar";
import { ChevronLeft, ChevronRight, User, Video } from "lucide-react";

export default function AppointmentSlot({ onContinue, onBack }) {
  const [selectedDate, setSelectedDate] = useState("27");
  const [selectedTime, setSelectedTime] = useState("6:00");
  const [selectedMode, setSelectedMode] = useState("In person");

  const dates = [
    { day: "TODAY", date: "27" },
    { day: "TUE", date: "28" },
    { day: "WED", date: "29" },
    { day: "THU", date: "30" },
    { day: "FRI", date: "01" },
  ];

  const morningTimes = ["2:00", "3:30", "4:15", "4:45"];
  const afternoonTimes = ["2:00", "3:30", "4:15", "4:45"];
  const eveningTimes = ["5:30", "6:00", "6:45", "6:45", "6:45", "7:30"];

  const unavailableTimes = ["2:00", "4:45"];

  const renderTimeSlot = (time, index, section) => {
    const disabled =
      (section === "morning" || section === "afternoon") &&
      unavailableTimes.includes(time);

    return (
      <button
        key={`${section}-${time}-${index}`}
        className={`as-time-slot ${
          selectedTime === time && !disabled ? "as-selected" : ""
        } ${disabled ? "as-disabled" : ""}`}
        onClick={() => !disabled && setSelectedTime(time)}
        disabled={disabled}
      >
        {time}
      </button>
    );
  };

  return (
    <>
      <Navbar />

      <div className="as-appointment-page">

        {/* ================= PROGRESS ================= */}
        <div className="as-booking-progress">

          <div className="as-progress-item as-active">
            <div className="as-progress-dot"></div>

            <div className="as-progress-line as-progress-line-one"></div>
            <div className="as-progress-line as-progress-line-two"></div>

            <h4>Patient Info</h4>

            <p>
              Let's begin with a few
              <br />
              details about you.
            </p>
          </div>

          <div className="as-progress-item">
            <div className="as-progress-dot"></div>

            <div className="as-progress-line"></div>

            <h4>Review</h4>

            <p>
              Please verify your
              <br />
              information before we
              <br />
              proceed.
            </p>
          </div>

          <div className="as-progress-item as-last">
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

        {/* ================= MAIN CONTENT ================= */}
        <div className="as-appointment-content">

          {/* ================= DATE / TIME CARD ================= */}
          <div className="as-date-card">

            <div className="as-date-header">
              <h2>Choose new date</h2>

              <div className="as-mode-toggle">

                <button
                  className={
                    selectedMode === "In person" ? "as-active" : ""
                  }
                  onClick={() => setSelectedMode("In person")}
                >
                  <span className="as-mode-icon">
                    <User size={16} />
                  </span>

                  In person
                </button>

                <button
                  className={
                    selectedMode === "Virtual" ? "as-active" : ""
                  }
                  onClick={() => setSelectedMode("Virtual")}
                >
                  <span className="as-mode-icon">
                    <Video size={16} />
                  </span>

                  Virtual
                </button>

              </div>
            </div>

            {/* ================= MONTH ================= */}
            <div className="as-month-row">
              <span>May 2026</span>

              <div className="as-month-arrows">
                <button>
                  <ChevronLeft size={16} />
                </button>

                <button>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* ================= DATES ================= */}
            <div className="as-date-selector">
              {dates.map((item) => (
                <button
                  key={item.date}
                  className={`as-date-box ${
                    selectedDate === item.date ? "as-selected" : ""
                  }`}
                  onClick={() => setSelectedDate(item.date)}
                >
                  <span>{item.day}</span>

                  <strong>{item.date}</strong>
                </button>
              ))}
            </div>

            {/* ================= MORNING ================= */}
            <div className="as-time-section">

              <div className="as-time-section-header">
                <span>MORNING</span>

                <small>3 AVAILABLE</small>
              </div>

              <div className="as-time-grid as-morning-grid">
                {morningTimes.map((time, index) =>
                  renderTimeSlot(time, index, "morning")
                )}
              </div>

            </div>

            {/* ================= AFTERNOON ================= */}
            <div className="as-time-section">

              <div className="as-time-section-header">
                <span>AFTERNOON</span>

                <small>3 AVAILABLE</small>
              </div>

              <div className="as-time-grid as-afternoon-grid">
                {afternoonTimes.map((time, index) =>
                  renderTimeSlot(time, index, "afternoon")
                )}
              </div>

            </div>

            {/* ================= EVENING ================= */}
            <div className="as-time-section">

              <div className="as-time-section-header">
                <span>EVENING</span>

                <small>6 AVAILABLE</small>
              </div>

              <div className="as-time-grid as-evening-grid">
                {eveningTimes.map((time, index) =>
                  renderTimeSlot(time, index, "evening")
                )}
              </div>

            </div>

            {/* ================= BOTTOM ACTIONS ================= */}
            <div className="as-date-card-footer">

              <button
                className="as-back-button"
                onClick={onBack}
              >
                <span>‹</span>

                <u>Back to appointment</u>
              </button>

              <button
                className="as-continue-button"
                onClick={onContinue}
              >
                Continue to confirm

                <span>→</span>
              </button>

            </div>

          </div>

          {/* ================= BOOKING CARD ================= */}
          <div className="as-booking-card">

            <div className="as-booking-label">
              BOOKING
            </div>

            {/* ================= DOCTOR ================= */}
            <div className="as-doctor-info">

              <img
                src={dock}
                alt="Dr. Ananya Menon"
                className="as-doctor-image"
              />

              <div className="as-doctor-details">

                <h3>Dr. Ananya Menon</h3>

                <p>
                  Cardiologist · Interventional
                </p>

              </div>

            </div>

            <div className="as-booking-divider"></div>

            {/* ================= CURRENT ================= */}
            <div className="as-booking-row">

              <span className="as-booking-title">
                Currently
              </span>

              <div className="as-booking-value as-current-value">

                <del>Sun 10 May</del>

                <del>5:30 PM</del>

              </div>

            </div>

            {/* ================= NEW SLOT ================= */}
            <div className="as-booking-row">

              <span className="as-booking-title">
                New Slot
              </span>

              <div className="as-booking-value as-new-slot">

                <span>Mon 11 May</span>

                <small>5:30 PM</small>

              </div>

            </div>

            {/* ================= VISIT TYPE ================= */}
            <div className="as-booking-row as-visit-row">

              <span className="as-booking-title">
                Visit type
              </span>

              <div className="as-booking-value">
                First consultation &nbsp; · &nbsp; 25–30 min
              </div>

            </div>

            {/* ================= REMINDER ================= */}
            <div className="as-booking-reminder">

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