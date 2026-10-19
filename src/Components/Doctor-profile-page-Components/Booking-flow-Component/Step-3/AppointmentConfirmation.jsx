import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AppointmentConfirmation.css";
import Navbar from "../../Navbar/Navbar";
import Footer from "../../Footer/DoctorFooter";
import dock from "../../../../asserts/doctor.png";
import { ArrowDownToLine, Calendar, MapPin } from "lucide-react";
import {
  HOSPITAL_ADDRESS,
  HOSPITAL_DIRECTIONS_URL,
  HOSPITAL_NAME,
} from "../../../../hospital";

const VISIT_MINUTES = 20;

// selectedDate "YYYY-MM-DD" + selectedTime "HH:MM" (or "h:mm AM") → local Date
function visitStart(appointment) {
  const date = appointment?.selectedDate;
  const time = appointment?.selectedTime;
  if (!date || !time) return null;
  const match = String(time).trim().match(/^(\d{1,2}):(\d{2})\s*([AaPp][Mm])?$/);
  if (!match) return null;
  let hours = Number(match[1]);
  const meridiem = match[3]?.toUpperCase();
  if (meridiem === "PM" && hours < 12) hours += 12;
  if (meridiem === "AM" && hours === 12) hours = 0;
  const start = new Date(`${String(date).slice(0, 10)}T00:00:00`);
  if (Number.isNaN(start.getTime())) return null;
  start.setHours(hours, Number(match[2]), 0, 0);
  return start;
}

// 20260419T103000Z
const toCalendarStamp = (date) =>
  date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

const escapeIcs = (text) => String(text).replace(/([,;\\])/g, "\\$1").replace(/\n/g, "\\n");

function calendarEvent(appointment, bookingId) {
  const start = visitStart(appointment);
  if (!start) return null;
  const end = new Date(start.getTime() + VISIT_MINUTES * 60000);
  const virtual = appointment.selectedMode === "virtual";
  return {
    start,
    end,
    title: `Consultation with ${appointment.doctorName || "your doctor"}`,
    location: virtual ? "Video consultation" : `${HOSPITAL_NAME}, ${HOSPITAL_ADDRESS}`,
    details: `Booking ID: ${bookingId}\n${virtual ? "Video consultation" : "Please arrive 15 minutes early."}`,
  };
}

function googleCalendarUrl(event) {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${toCalendarStamp(event.start)}/${toCalendarStamp(event.end)}`,
    details: event.details,
    location: event.location,
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

// .ics file for Apple Calendar / Outlook, with a 1-hour reminder
function downloadIcs(event, bookingId) {
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Lakshmee Foundation Hospital//Booking//EN",
    "BEGIN:VEVENT",
    `UID:${bookingId}@lakshmeefoundation`,
    `DTSTAMP:${toCalendarStamp(new Date())}`,
    `DTSTART:${toCalendarStamp(event.start)}`,
    `DTEND:${toCalendarStamp(event.end)}`,
    `SUMMARY:${escapeIcs(event.title)}`,
    `LOCATION:${escapeIcs(event.location)}`,
    `DESCRIPTION:${escapeIcs(event.details)}`,
    "BEGIN:VALARM",
    "TRIGGER:-PT1H",
    "ACTION:DISPLAY",
    "DESCRIPTION:Appointment reminder",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `Appointment-${bookingId}.ics`;
  link.click();
  URL.revokeObjectURL(url);
}

const escapeHtml = (text) =>
  String(text ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const rupees = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

// Same breakdown as the review step
function feeBreakdown(appointment) {
  const fee = Number(String(appointment?.consultationFee ?? "").replace(/[^\d.]/g, "")) || 0;
  const platformFee = Number(appointment?.platformFee) || 0;
  const discount = Number(appointment?.discount) || 0;
  const gst = Math.round((fee + platformFee) * (Number(appointment?.gstRate) || 0));
  const paid = appointment?.payment?.amount
    ? appointment.payment.amount / 100 // Razorpay amounts are in paise
    : fee + platformFee + gst - discount;
  return { fee, platformFee, discount, gst, paid };
}

// Prints a receipt from a hidden frame (no pop-up needed); the print
// dialog's "Save as PDF" gives the patient a PDF copy
function printReceipt(appointment, details) {
  const { fee, platformFee, discount, gst, paid } = feeBreakdown(appointment);
  const rows = [
    ["Booking ID", details.bookingId],
    ["Patient", details.patientName],
    ["Mobile", details.patientPhone],
    ["Doctor", details.doctorName],
    ["Speciality", details.doctorSpecialty],
    ["Visit", `${details.formattedVisitDate} · ${details.visitTime}`],
    ["Visit type", details.visitMode],
    ["Payment ID", appointment?.payment?.paymentId || "—"],
  ];
  const charges = [
    ["Consultation fee", rupees(fee)],
    ["Booking platform fee", rupees(platformFee)],
    [`GST (${Math.round((Number(appointment?.gstRate) || 0) * 100)}%)`, rupees(gst)],
    ...(discount > 0 ? [[`Coupon ${appointment.coupon || ""}`.trim(), `−${rupees(discount)}`]] : []),
  ];
  const tableRows = (list) =>
    list.map(([label, value]) => `<tr><th>${escapeHtml(label)}</th><td>${escapeHtml(value)}</td></tr>`).join("");

  document.getElementById("ac-receipt-frame")?.remove();
  const frame = document.createElement("iframe");
  frame.id = "ac-receipt-frame";
  frame.title = "Receipt";
  frame.style.cssText = "position:fixed;width:0;height:0;border:0;visibility:hidden";
  document.body.appendChild(frame);
  const doc = frame.contentDocument;
  doc.open();
  doc.write(`<!doctype html><html><head><meta charset="utf-8">
<title>Receipt ${escapeHtml(details.bookingId)}</title>
<style>
  body { font-family: Inter, Arial, sans-serif; color: #26384a; max-width: 40rem; margin: 2rem auto; padding: 0 1rem; }
  h1 { font-size: 1.3rem; margin: 0 0 .2rem; }
  p { margin: 0 0 1.5rem; color: #666; font-size: .85rem; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 1.5rem; font-size: .9rem; }
  th, td { padding: .5rem 0; border-bottom: 1px solid #e5e5e5; text-align: left; }
  td { text-align: right; }
  .total th, .total td { font-weight: 700; border-bottom: 2px solid #26384a; }
</style></head><body>
<h1>${escapeHtml(HOSPITAL_NAME)}</h1>
<p>${escapeHtml(HOSPITAL_ADDRESS)}</p>
<h2 style="font-size:1rem">Appointment receipt</h2>
<table>${tableRows(rows)}</table>
<table>${tableRows(charges)}<tr class="total"><th>Total paid</th><td>${escapeHtml(rupees(paid))}</td></tr></table>
<p>Issued ${escapeHtml(new Date().toLocaleString("en-IN"))}</p>
</body></html>`);
  doc.close();
  frame.contentWindow.focus();
  frame.contentWindow.print();
}

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
  if (appointment?.bookingId) return appointment.bookingId;
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
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("appointment");
    if (stored) {
      try {
        setAppointment(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse appointment from localStorage", e);
      }
    }
    setLoaded(true);
  }, []);

  // ---------- Derived display values ----------
  const doctorName = appointment?.doctorName || "Your doctor";
  const doctorSpecialty = appointment?.specialty || "";
  const doctorImage = appointment?.doctorImage || dock;

  const visitMode =
    appointment?.selectedMode === "virtual" ? "Virtual" : "In-person";

  const patient = appointment?.patient;
  const patientName = patient?.fullName || "—";
  const patientPhone = patient?.mobileNumber || "";

  const bookingId = appointment ? getBookingId(appointment) : "";

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
  const event = appointment ? calendarEvent(appointment, bookingId) : null;

  const handleReschedule = onReschedule || (() => navigate("/reschedule-slot"));
  const handleCancel = onCancel || (() => navigate("/cancel-appointment"));

  const handleReceipt = () => {
    printReceipt(appointment, {
      bookingId,
      patientName,
      patientPhone,
      doctorName,
      doctorSpecialty,
      formattedVisitDate,
      visitTime,
      visitMode,
    });
  };

  if (loaded && !appointment) {
    return (
      <>
        <Navbar />
        <section className="ac-appointment-confirmation ac-empty">
          <h1>No recent booking found</h1>
          <p>Book an appointment with one of our doctors to see its confirmation here.</p>
          <Link to="/doctors" className="ac-visit-action">Find a doctor</Link>
        </section>
        <Footer />
      </>
    );
  }

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
                <strong>Consultation</strong>

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

            <p className="ac-arrive-text">
              {visitMode === "Virtual"
                ? "Join a few minutes before your slot"
                : "Arrive 15 minutes early"}
            </p>

            <span className="ac-quick-actions-label">QUICK ACTIONS</span>

            <button className="ac-visit-action" onClick={handleReschedule}>Reschedule Appointment</button>

            <button className="ac-visit-action" onClick={handleCancel}>Cancel Appointment</button>
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

            {event ? (
              <p className="ac-action-links">
                <a href={googleCalendarUrl(event)} target="_blank" rel="noopener noreferrer">
                  Google
                </a>
                {" · "}
                <button type="button" onClick={() => downloadIcs(event, bookingId)}>
                  Apple / Outlook (.ics)
                </button>
              </p>
            ) : (
              <p>Visit time not available.</p>
            )}
          </div>

          <button type="button" className="ac-action-card" onClick={handleReceipt}>
            <div className="ac-action-icon">
              <ArrowDownToLine size={16} />
            </div>

            <h3>Download receipt</h3>

            <p>PDF receipt & appointment slip for insurance.</p>
          </button>

          <a
            className="ac-action-card"
            href={HOSPITAL_DIRECTIONS_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="ac-action-icon">
              <MapPin size={16} />
            </div>

            <h3>Get Directions</h3>

            <p>Open directions to {HOSPITAL_NAME} in Google Maps.</p>
          </a>
        </div>
      </section>

      <Footer />
    </>
  );
}
