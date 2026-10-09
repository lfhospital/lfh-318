import React, { useEffect, useState } from "react";
import "./AppointmentConfirmation.css";
import Navbar from "../../Navbar/Navbar";
import Footer from "../../Footer/DoctorFooter";
import dock from "../../../../asserts/doctor.png";
import { ArrowDownToLine, Calendar, MapPin } from "lucide-react";

function calculateAge(isoDob) {
  if (!isoDob) return null;
  const dobDate = new Date(isoDob);
  if (Number.isNaN(dobDate.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - dobDate.getFullYear();
  const monthDiff = today.getMonth() - dobDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
    age--;
  }
  return age;
}

// Parses a DD/MM/YYYY string (as captured on the Patient Info step) into
// an ISO date, used only for age display.
function parseDobToIso(ddmmyyyy) {
  if (!ddmmyyyy) return null;
  const match = ddmmyyyy.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!match) return null;
  const [, dd, mm, yyyy] = match;
  return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
}

// Produces (and persists) a readable booking reference. If a Razorpay
// payment id is available we derive the id from it so it stays stable
// across refreshes; otherwise we generate one once and cache it.
function getBookingId(appointment) {
  const cached = localStorage.getItem("bookingId");
  if (cached) return cached;

  const year = new Date().getFullYear().toString().slice(-2);
  const paymentId = appointment?.payment?.paymentId;
  const suffixSource = paymentId
    ? paymentId.replace(/[^A-Za-z0-9]/g, "").slice(-8).toUpperCase()
    : Math.random().toString(36).slice(-8).toUpperCase();

  const part1 = suffixSource.slice(0, 4) || "0000";
  const part2 = suffixSource.slice(4, 8) || "0000";

  const bookingId = `LKM-${year}-${part1}-${part2}`;
  localStorage.setItem("bookingId", bookingId);
  return bookingId;
}

export default function AppointmentConfirmation({ onReschedule, onCancel }) {
  const [appointment, setAppointment] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("appointment");
    if (stored) {
      try {
        setAppointment(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse appointment from localStorage", e);
      }
    }
  }, []);

  // ---------- Derived display values ----------
  const doctorName = appointment?.doctorName || "Dr. Ananya Menon";
  const doctorSpecialty =
    appointment?.specialty || "Cardiologist · Interventional";
  const doctorImage = appointment?.doctorImage || dock;

  const visitMode =
    appointment?.selectedMode === "virtual" ? "Virtual" : "In-person";

  const patient = appointment?.patient;
  const patientName = patient?.fullName || "—";
  const patientPhone = patient?.mobileNumber || "";

  const bookingId = getBookingId(appointment);

  const selectedDateObj = appointment?.selectedDate
    ? new Date(appointment.selectedDate)
    : null;
  const validDate =
    selectedDateObj && !Number.isNaN(selectedDateObj.getTime())
      ? selectedDateObj
      : null;

  const formattedVisitDate = validDate
    ? validDate.toLocaleDateString("en-IN", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "Date not available";

  const visitDay = validDate ? validDate.getDate().toString() : "--";
  const visitMonthYear = validDate
    ? validDate.toLocaleDateString("en-IN", {
        month: "short",
        year: "numeric",
      })
    : "";
  const visitWeekday = validDate
    ? validDate.toLocaleDateString("en-IN", { weekday: "short" })
    : "";

  const visitTime = appointment?.selectedTime || "";

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

          <h1>Your appointment is confirmed.</h1>

          <p>A confirmation has been sent to your email and contact number.</p>

          <p>You'll get a reminder 2 hours before.</p>

          <div className="ac-booking-id">
            <span>Booking ID</span>

            <strong>{bookingId}</strong>
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
                <img
                  src={doctorImage}
                  alt={doctorName}
                  onError={(e) => {
                    e.target.src = dock;
                  }}
                />
              </div>

              <div className="ac-doctor-info">
                <h2>{doctorName}</h2>

                <p>{doctorSpecialty}</p>
              </div>
            </div>

            <div className="ac-appointment-divider"></div>

            <div className="ac-detail-row">
              <span>Booking ID</span>

              <strong>{bookingId}</strong>
            </div>

            <div className="ac-detail-row">
              <span>Visit</span>

              <div>
                <strong>{formattedVisitDate}</strong>

                <small>{visitTime}</small>
              </div>
            </div>

            <div className="ac-detail-row">
              <span>Visit type</span>

              <div>
                <strong>First consultation</strong>

                <small>{visitMode}</small>
              </div>
            </div>

            <div className="ac-detail-row">
              <span>Patient</span>

              <div>
                <strong>{patientName}</strong>

                <small>{patientPhone}</small>
              </div>
            </div>
          </div>

          {/* RIGHT VISIT CARD */}

          <div className="ac-visit-card">
            <span className="ac-visit-label">YOUR VISIT</span>

            <div className="ac-visit-date">
              <strong>{visitDay}</strong>

              <span>
                {visitMonthYear} {visitWeekday && `· ${visitWeekday}`}
              </span>
            </div>

            <div className="ac-visit-time">{visitTime}</div>

            <p className="ac-arrive-text">Arrive 15 minutes early</p>

            <span className="ac-quick-actions-label">QUICK ACTIONS</span>

            <button className="ac-visit-action" onClick={onReschedule}>Reschedule Appointment</button>

            <button className="ac-visit-action" onClick={onCancel}>Cancel Appointment</button>
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

            <h3>Add to calendar</h3>

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
