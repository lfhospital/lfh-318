import React, { useState } from "react";
import "./SlotTaken.css";
import Navbar from "../../Navbar/Navbar";
import Footer from "../../Footer/DoctorFooter";
import { ArrowRight, ChevronLeft, ChevronRight, CircleAlert } from "lucide-react";

export default function SlotTaken() {
  const [selectedAlternative, setSelectedAlternative] = useState(0);
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedTime, setSelectedTime] = useState("6:00");

  const alternatives = [
    { time: "5:45", date: "MON 11 MAY" },
    { time: "6:30", date: "MON 11 MAY" },
    { time: "6:45", date: "MON 11 MAY" },
    { time: "7:00", date: "MON 11 MAY" },
    { time: "7:30", date: "MON 11 MAY" },
  ];

  const dates = [
    { day: "TODAY", date: "27" },
    { day: "TUE", date: "28" },
    { day: "WED", date: "29" },
    { day: "THU", date: "30" },
    { day: "FRI", date: "01", disabled: true },
  ];

  const timeSlots = {
    morning: [
      { time: "2:00", disabled: true },
      { time: "3:30" },
      { time: "4:15" },
      { time: "4:45", disabled: true },
    ],
    afternoon: [
      { time: "2:00", disabled: true },
      { time: "3:30" },
      { time: "4:15" },
      { time: "4:45", disabled: true },
    ],
    evening: [
      { time: "5:30" },
      { time: "6:00" },
      { time: "6:45" },
      { time: "6:45" },
      { time: "7:00" },
    ],
  };

  return (
    <>
      <Navbar />
      <div className="slot-taken-page">
        {/* ================= HEADER ================= */}
        <div className="slot-taken-header">
          <h1>That slot just got taken.</h1>

          <p>
            Another patient locked it before you. Pick one of these they're the
            closest to what you wanted.
          </p>
        </div>

        {/* ================= MAIN CARD ================= */}
        <div className="slot-taken-card">
          {/* ================= ALERT ================= */}
          <div className="slot-alert">
            <div className="slot-alert-icon"><CircleAlert size={25} /></div>

            <div className="slot-alert-content">
              <div className="slot-alert-title">
                5:30 PM on Mon 11 May is no longer available
              </div>

              <div className="slot-alert-description">
                No charge has been made. Pick a nearby alternative below — we've
                sorted them by proximity to your original choice.
              </div>
            </div>
          </div>

          {/* ================= CLOSEST ALTERNATIVES ================= */}
          <div className="alternative-section">
            <div className="section-title-row">
              <span>Closest alternatives</span>

              <div className="navigation-buttons">
                <button aria-label="Previous"><ChevronLeft size={16} /></button>
                <button aria-label="Next"><ChevronRight size={16} /></button>
              </div>
            </div>

            <div className="alternative-grid">
              {alternatives.map((item, index) => (
                <button
                  key={`${item.time}-${index}`}
                  className={`alternative-slot ${
                    selectedAlternative === index ? "selected" : ""
                  }`}
                  onClick={() => setSelectedAlternative(index)}
                >
                  <span>{item.time}</span>
                  <small>{item.date}</small>
                </button>
              ))}
            </div>
          </div>

          {/* ================= DATE ================= */}
          <div className="date-section">
            <div className="date-heading-row">
              <span>Pick a Different date</span>
            </div>

            <div className="month-row">
              <span>May 2026</span>

              <div className="navigation-buttons">
                <button aria-label="Previous month"><ChevronLeft size={16} /></button>
                <button aria-label="Next month">›</button>
              </div>
            </div>

            <div className="date-grid">
              {dates.map((item, index) => (
                <button
                  key={item.date}
                  disabled={item.disabled}
                  className={`date-option ${
                    selectedDate === index ? "selected" : ""
                  } ${item.disabled ? "disabled" : ""}`}
                  onClick={() => setSelectedDate(index)}
                >
                  <span>{item.day}</span>
                  <strong>{item.date}</strong>
                </button>
              ))}
            </div>
          </div>

          {/* ================= TIME SLOTS ================= */}
          <div className="time-section">
            {/* MORNING */}
            <div className="time-group">
              <div className="time-group-header">
                <span>MORNING</span>
                <span>3 AVAILABLE</span>
              </div>

              <div className="time-grid four-columns">
                {timeSlots.morning.map((slot, index) => (
                  <button
                    key={`morning-${index}`}
                    disabled={slot.disabled}
                    className={`time-slot ${
                      selectedTime === `morning-${index}` ? "selected" : ""
                    } ${slot.disabled ? "disabled" : ""}`}
                    onClick={() => setSelectedTime(`morning-${index}`)}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            </div>

            {/* AFTERNOON */}
            <div className="time-group">
              <div className="time-group-header">
                <span>AFTERNOON</span>
                <span>3 AVAILABLE</span>
              </div>

              <div className="time-grid four-columns">
                {timeSlots.afternoon.map((slot, index) => (
                  <button
                    key={`afternoon-${index}`}
                    disabled={slot.disabled}
                    className={`time-slot ${
                      selectedTime === `afternoon-${index}` ? "selected" : ""
                    } ${slot.disabled ? "disabled" : ""}`}
                    onClick={() => setSelectedTime(`afternoon-${index}`)}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            </div>

            {/* EVENING */}
            <div className="time-group evening-group">
              <div className="time-group-header">
                <span>EVENING</span>
                <span>6 AVAILABLE</span>
              </div>

              <div className="time-grid five-columns">
                {timeSlots.evening.map((slot, index) => (
                  <button
                    key={`evening-${index}`}
                    className={`time-slot ${
                      selectedTime === "6:00" && index === 1 ? "selected" : ""
                    }`}
                    onClick={() => setSelectedTime(slot.time)}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ================= BOTTOM ACTIONS ================= */}
          <div className="slot-actions">
            <button className="slot-back-button">
              <span><ChevronLeft size={16} /></span>
              <u>Back</u>
            </button>

            <button className="continue-confirm-button">
              <span>Continue to confirm</span>
              <span className="continue-arrow"><ArrowRight size={16} /></span>
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
