import React, { useCallback, useEffect, useState } from "react";
import "../PatientAppointments/PatientAppointments.css";
import "../AppointmentsEmpty/AppointmentsEmpty.css";
import "./Appointments.css";
import Navbar from "../../Home-page-Components/Navbar/Navbar";
import Footer from "../../Home-page-Components/Footer/HomeFooter";
import {
  Icon,
  Sidebar,
  StatusBadge,
  APPOINTMENT_STATUS_OPTIONS,
  PATIENT_OPTIONS,
} from "../PatientAppointments/PatientAppointments";
import FilterMenu from "../FilterMenu/FilterMenu";
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";

const initialAppointments = [
  {
    id: 1,
    doctor: "Dr. A. Menon",
    department: "Cardiology",
    consultation: "In person",
    date: "Today",
    time: "5:30 PM",
    patient: "Rohan Iyer",
    relation: "Me",
    status: "Upcoming",
  },
  {
    id: 2,
    doctor: "Dr. A. Menon",
    department: "Cardiology",
    consultation: "Video",
    date: "2 May 2026",
    time: "5:30 PM",
    patient: "Rohan Iyer",
    relation: "Me",
    status: "Completed",
    prescriptionSeen: false,
  },
  {
    id: 3,
    doctor: "Dr. Reddy",
    department: "Cardiology",
    consultation: "Video",
    date: "2 May 2026",
    time: "5:30 PM",
    patient: "Shreya Iyer",
    relation: "Family",
    status: "Cancelled by hospital",
    refund: "₹841",
  },
  {
    id: 4,
    doctor: "Dr. A. Menon",
    department: "Cardiology",
    consultation: "In person",
    date: "8 May 2026",
    time: "5:30 PM",
    patient: "Shreya Iyer",
    relation: "Family",
    status: "Rescheduled",
  },
];

const liveConsultation = {
  id: "live",
  doctor: "Dr. A. Menon",
  department: "Cardiology",
  consultation: "Video",
  date: "Today",
  time: "11:00 AM",
  patient: "Rohan Iyer",
  relation: "Me",
  status: "In progress",
};

const prescription = {
  diagnosis: "Stable angina — follow-up in 4 weeks",
  medicines: [
    { name: "Aspirin 75 mg", dosage: "1 tablet after breakfast", days: "30 days" },
    { name: "Atorvastatin 20 mg", dosage: "1 tablet at night", days: "30 days" },
    { name: "Metoprolol 25 mg", dosage: "1 tablet twice daily", days: "30 days" },
  ],
};

export const rescheduleSlots = [
  { date: "14 May 2026", time: "10:00 AM" },
  { date: "15 May 2026", time: "4:30 PM" },
  { date: "18 May 2026", time: "11:15 AM" },
];

const UPCOMING_STATUSES = ["Upcoming", "Rescheduled"];

const firstName = (name) => name.split(" ")[0];

const actionLabel = (appointment) => {
  if (appointment.status === "Upcoming") return "View details";
  if (appointment.status === "Completed") return "View prescription";
  return "Manage";
};

export function downloadSlip(appointment) {
  const slip = [
    "LAKSHMEE FOUNDATION HOSPITAL",
    "Appointment slip",
    "",
    `Doctor:        ${appointment.doctor} (${appointment.department})`,
    `Patient:       ${appointment.patient}`,
    `Type:          ${appointment.consultation}`,
    `Date & time:   ${appointment.date}, ${appointment.time}`,
    `Status:        ${appointment.status}`,
    "",
    "Please arrive 15 minutes early. Emergency: 1800-123-1234",
  ].join("\n");

  const url = URL.createObjectURL(new Blob([slip], { type: "text/plain" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `appointment-slip-${appointment.id}.txt`;
  link.click();
  URL.revokeObjectURL(url);
}

// "Today" / "14 May 2026" + "5:30 PM" -> Date (local time).
function appointmentStart(appointment) {
  const base =
    appointment.date === "Today" ? new Date() : new Date(appointment.date);
  const [, hh, mm, ampm] = appointment.time.match(/(\d+):(\d+)\s*(AM|PM)/i) || [];
  if (hh) {
    let hours = Number(hh) % 12;
    if (ampm.toUpperCase() === "PM") hours += 12;
    base.setHours(hours, Number(mm), 0, 0);
  }
  return base;
}

const icsStamp = (date) =>
  date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

// Calendar file (.ics) for "Add to calendar".
export function downloadCalendarEvent(appointment) {
  const start = appointmentStart(appointment);
  const end = new Date(start.getTime() + 30 * 60 * 1000);
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Lakshmee Foundation Hospital//Patient Portal//EN",
    "BEGIN:VEVENT",
    `UID:appointment-${appointment.id}@lakshmee.org`,
    `DTSTAMP:${icsStamp(new Date())}`,
    `DTSTART:${icsStamp(start)}`,
    `DTEND:${icsStamp(end)}`,
    `SUMMARY:${appointment.department} appointment with ${appointment.doctor}`,
    `DESCRIPTION:${appointment.consultation} consultation for ${appointment.patient}. Please arrive 15 minutes early.`,
    "LOCATION:Lakshmee Foundation Hospital",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `appointment-${appointment.id}.ics`;
  link.click();
  URL.revokeObjectURL(url);
}

/* Toolbar */

function Toolbar({
  activeTab,
  setActiveTab,
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  patientFilter,
  setPatientFilter,
}) {
  return (
    <div className="ap-toolbar">
      <div className="pa-tabs ap-tabs" role="tablist">
        {["Upcoming", "Past"].map((tab) => (
          <button
            key={tab}
            role="tab"
            aria-selected={activeTab === tab}
            className={activeTab === tab ? "is-active" : ""}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <label className="pa-search ap-search">
        <input
          type="text"
          placeholder="Search doctor or department"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          aria-label="Search doctor or department"
        />
        <Icon name="search" size={20} />
      </label>

      <FilterMenu
        label="Status"
        value={statusFilter}
        onChange={setStatusFilter}
        options={APPOINTMENT_STATUS_OPTIONS}
        hideAllValue
      />

      <FilterMenu
        label="Patient"
        value={patientFilter}
        onChange={setPatientFilter}
        options={PATIENT_OPTIONS}
        align="right"
      />
    </div>
  );
}

/* Table */

function AppointmentTable({ appointments, onAction }) {
  return (
    <div className="pa-table-wrapper">
      <table className="pa-table ap-table">
        <thead>
          <tr>
            <th>DOCTOR</th>
            <th>APPOINTMENT TYPE</th>
            <th>DATE</th>
            <th>PATIENT</th>
            <th>STATUS</th>
            <th>ACTIONS</th>
          </tr>
        </thead>

        <tbody>
          {appointments.map((appointment) => (
            <tr key={appointment.id}>
              <td>
                <div className="pa-doctor-cell">
                  <span className="pa-cell-primary">{appointment.doctor}</span>
                  <span className="pa-cell-secondary">
                    {appointment.department}
                  </span>
                </div>
              </td>

              <td>
                <span className="pa-consultation-type">
                  {appointment.consultation}
                </span>
              </td>

              <td>
                <div className="pa-date-cell">
                  <span className="pa-cell-primary">{appointment.date}</span>
                  <span className="pa-cell-secondary">{appointment.time}</span>
                </div>
              </td>

              <td>
                <div className="pa-patient-cell">
                  <span className="pa-patient-name">{appointment.patient}</span>
                  <span
                    className={`pa-patient-relation ${
                      appointment.relation === "Family" ? "is-family" : ""
                    }`}
                  >
                    <Icon
                      name={appointment.relation === "Family" ? "family" : "user"}
                      size={11}
                    />
                    {appointment.relation}
                  </span>
                </div>
              </td>

              <td>
                <StatusBadge status={appointment.status} />
              </td>

              <td>
                <button
                  className="pa-action-link"
                  onClick={() => onAction(appointment)}
                >
                  {actionLabel(appointment)}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* Empty state */

function EmptyState({ activeTab, hasFilters, onClearFilters, onFindDoctor }) {
  if (hasFilters) {
    return (
      <section className="ae-empty ap-empty">
        <h2 className="ae-empty-title">No appointments match your filters</h2>
        <p className="ae-empty-text">
          Try a different doctor, department or status.
        </p>
        <button type="button" className="ae-empty-button" onClick={onClearFilters}>
          Clear filters
        </button>
      </section>
    );
  }

  return (
    <section className="ae-empty ap-empty">
      <h2 className="ae-empty-title">
        {activeTab === "Upcoming"
          ? "No upcoming appointments"
          : "No past appointments"}
      </h2>
      <p className="ae-empty-text">
        You're all caught up. Book a visit with a specialist whenever you need,
        it only takes a minute.
      </p>
      <button type="button" className="ae-empty-button" onClick={onFindDoctor}>
        Find a doctor
      </button>
    </section>
  );
}

/* Right panel */

function SidePanel({ todos, onJoinCall, onViewLive }) {
  return (
    <aside className="ap-panel">
      <div className="ap-live-card">
        <div className="ap-live-doctor">
          <h3>{liveConsultation.doctor}</h3>
          <p>{liveConsultation.department}</p>
        </div>

        <div className="ap-live-meta">
          <p>
            Video consultation · {liveConsultation.date},{" "}
            {liveConsultation.time}
          </p>
          <span className="ap-progress-badge">
            <span className="ap-progress-dot" />
            In progress
          </span>
        </div>

        <div className="ap-live-actions">
          <button className="ap-primary-button" onClick={onJoinCall}>
            Join video call
          </button>
          <button className="pa-action-link" onClick={onViewLive}>
            View details
          </button>
        </div>
      </div>

      <div className="ap-todo">
        <p className="ap-todo-heading">To do</p>

        {todos.length === 0 && (
          <p className="ap-todo-text">You're all caught up.</p>
        )}

        {todos.map((todo) => (
          <div className="ap-todo-item" key={todo.key}>
            {todo.badge && (
              <span className="ap-todo-badge">
                <Icon name="close" size={12} />
                {todo.badge}
              </span>
            )}
            <h4 className="ap-todo-title">{todo.title}</h4>
            <p className="ap-todo-text">{todo.text}</p>
            <button className="ap-outline-button" onClick={todo.onClick}>
              {todo.cta}
            </button>
          </div>
        ))}
      </div>
    </aside>
  );
}

/* Toast */

export function Toast({ message, onClose }) {
  useEffect(() => {
    if (!message) return undefined;
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="ap-toast" role="status" aria-live="polite">
      <span className="ap-toast-icon">
        <Icon name="checkCircle" size={18} />
      </span>
      <p>{message}</p>
      <button className="ap-toast-close" onClick={onClose} aria-label="Dismiss">
        <Icon name="close" size={16} />
      </button>
    </div>
  );
}

/* Modal */

export function Modal({ title, onClose, children }) {
  useEffect(() => {
    const onKey = (event) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="ap-overlay" onClick={onClose}>
      <div
        className="ap-modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="ap-modal-header">
          <h2>{title}</h2>
          <button className="ap-modal-close" onClick={onClose} aria-label="Close">
            <Icon name="close" size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function DetailsList({ appointment }) {
  const rows = [
    ["Doctor", `${appointment.doctor} · ${appointment.department}`],
    ["Patient", `${appointment.patient} (${appointment.relation})`],
    ["Type", appointment.consultation],
    ["Date & time", `${appointment.date}, ${appointment.time}`],
  ];

  return (
    <dl className="ap-details">
      {rows.map(([label, value]) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
      <div>
        <dt>Status</dt>
        <dd>
          {appointment.status === "In progress" ? (
            <span className="ap-progress-badge">
              <span className="ap-progress-dot" />
              In progress
            </span>
          ) : (
            <StatusBadge status={appointment.status} />
          )}
        </dd>
      </div>
    </dl>
  );
}

export function AppointmentModal({
  appointment,
  view,
  setView,
  onClose,
  onDownload,
  onReschedule,
  onCancel,
  onRebook,
  onJoinCall,
}) {
  const [slot, setSlot] = useState(null);
  const isActive = UPCOMING_STATUSES.includes(appointment.status);
  const isCancelled = appointment.status.startsWith("Cancelled");
  const isRefunded = appointment.status === "Refunded";

  if (view === "prescription") {
    return (
      <Modal title="Prescription" onClose={onClose}>
        <p className="ap-modal-sub">
          {appointment.doctor} · {appointment.date} · for {appointment.patient}
        </p>
        <p className="ap-rx-diagnosis">{prescription.diagnosis}</p>
        <ul className="ap-rx-list">
          {prescription.medicines.map((medicine) => (
            <li key={medicine.name}>
              <span className="pa-cell-primary">{medicine.name}</span>
              <span className="pa-cell-secondary">
                {medicine.dosage} · {medicine.days}
              </span>
            </li>
          ))}
        </ul>
        <div className="ap-modal-actions">
          <button
            className="ap-primary-button"
            onClick={() => onDownload(appointment, "Prescription downloaded")}
          >
            <Icon name="download" size={16} />
            Download prescription
          </button>
        </div>
      </Modal>
    );
  }

  if (view === "reschedule") {
    return (
      <Modal title="Reschedule appointment" onClose={onClose}>
        <p className="ap-modal-sub">
          Pick a new slot with {appointment.doctor}.
        </p>
        <div className="ap-slots">
          {rescheduleSlots.map((option) => (
            <button
              key={option.date + option.time}
              className={`ap-slot ${slot === option ? "is-selected" : ""}`}
              onClick={() => setSlot(option)}
            >
              <span className="pa-cell-primary">{option.date}</span>
              <span className="pa-cell-secondary">{option.time}</span>
            </button>
          ))}
        </div>
        <div className="ap-modal-actions">
          <button className="ap-outline-button" onClick={() => setView("details")}>
            Back
          </button>
          <button
            className="ap-primary-button"
            disabled={!slot}
            onClick={() => onReschedule(appointment, slot)}
          >
            Confirm new slot
          </button>
        </div>
      </Modal>
    );
  }

  if (view === "cancel") {
    return (
      <Modal title="Cancel appointment?" onClose={onClose}>
        <p className="ap-modal-sub">
          Your visit with {appointment.doctor} on {appointment.date},{" "}
          {appointment.time} will be cancelled. Refunds reach your original
          payment method in 5–7 working days.
        </p>
        <div className="ap-modal-actions">
          <button className="ap-outline-button" onClick={() => setView("details")}>
            Keep appointment
          </button>
          <button className="ap-danger-button" onClick={() => onCancel(appointment)}>
            Cancel appointment
          </button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal title="Appointment details" onClose={onClose}>
      <DetailsList appointment={appointment} />

      {appointment.status === "Cancelled by hospital" && (
        <p className="ap-modal-note">
          {appointment.doctor} had an emergency. {appointment.refund} was
          refunded to source.
        </p>
      )}

      <div className="ap-modal-actions">
        {appointment.status === "In progress" && (
          <button className="ap-primary-button" onClick={onJoinCall}>
            Join video call
          </button>
        )}

        {appointment.status === "Completed" && (
          <button className="ap-primary-button" onClick={() => setView("prescription")}>
            View prescription
          </button>
        )}

        {isCancelled && (
          <button className="ap-primary-button" onClick={() => onRebook(appointment)}>
            {appointment.status === "Cancelled by hospital"
              ? "Rebook for free"
              : "Book again"}
          </button>
        )}

        {isActive && (
          <>
            <button className="ap-outline-button" onClick={() => setView("cancel")}>
              Cancel
            </button>
            <button className="ap-outline-button" onClick={() => setView("reschedule")}>
              Reschedule
            </button>
          </>
        )}

        {!isCancelled && !isRefunded && (
          <button
            className={isActive ? "ap-primary-button" : "ap-outline-button"}
            onClick={() => onDownload(appointment, "Appointment slip downloaded")}
          >
            <Icon name="download" size={16} />
            Download slip
          </button>
        )}
      </div>
    </Modal>
  );
}

/* Page */

export default function Appointments({ onFindDoctor }) {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [activeTab, setActiveTab] = useState("Upcoming");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [patientFilter, setPatientFilter] = useState("All");
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState("");

  const closeModal = () => setModal(null);
  const closeToast = useCallback(() => setToast(""), []);

  const filteredAppointments = appointments.filter((appointment) => {
    const query = search.trim().toLowerCase();
    const isUpcoming = UPCOMING_STATUSES.includes(appointment.status);

    return (
      (activeTab === "Upcoming" ? isUpcoming : !isUpcoming) &&
      (statusFilter === "All" || appointment.status === statusFilter) &&
      (patientFilter === "All" || appointment.relation === patientFilter) &&
      (!query ||
        appointment.doctor.toLowerCase().includes(query) ||
        appointment.department.toLowerCase().includes(query) ||
        appointment.patient.toLowerCase().includes(query))
    );
  });

  const hasFilters =
    search.trim() !== "" || statusFilter !== "All" || patientFilter !== "All";

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setPatientFilter("All");
  };

  const updateAppointment = (id, changes) =>
    setAppointments((list) =>
      list.map((item) => (item.id === id ? { ...item, ...changes } : item))
    );

  const openPrescription = (appointment) => {
    updateAppointment(appointment.id, { prescriptionSeen: true });
    setModal({ appointment, view: "prescription" });
  };

  const handleAction = (appointment) => {
    if (appointment.status === "Completed") {
      openPrescription(appointment);
      return;
    }
    // Upcoming visits open the slip / calendar dialog from the design.
    setModal({
      appointment,
      view: appointment.status === "Upcoming" ? "slip" : "details",
    });
  };

  const handleDownload = (appointment, message) => {
    downloadSlip(appointment);
    closeModal();
    setToast(message);
  };

  const handleReschedule = (appointment, slot) => {
    updateAppointment(appointment.id, {
      date: slot.date,
      time: slot.time,
      status: "Rescheduled",
    });
    closeModal();
    setToast(`Rescheduled to ${slot.date}, ${slot.time}`);
  };

  const handleCancel = (appointment) => {
    updateAppointment(appointment.id, { status: "Cancelled" });
    closeModal();
    setToast("Appointment cancelled");
  };

  const handleRebook = (appointment) => {
    const slot = rescheduleSlots[0];
    setAppointments((list) => [
      {
        ...appointment,
        id: Math.max(...list.map((item) => item.id)) + 1,
        date: slot.date,
        time: slot.time,
        status: "Upcoming",
        refund: undefined,
      },
      ...list.map((item) =>
        item.id === appointment.id ? { ...item, rebooked: true } : item
      ),
    ]);
    closeModal();
    setActiveTab("Upcoming");
    setToast(`${firstName(appointment.patient)}'s visit rebooked for ${slot.date}`);
  };

  const handleJoinCall = () => {
    closeModal();
    setToast(`Connecting you to ${liveConsultation.doctor}…`);
  };

  const todos = [
    ...appointments
      .filter((item) => item.status === "Cancelled by hospital" && !item.rebooked)
      .map((item) => ({
        key: `rebook-${item.id}`,
        badge: "Cancelled by hospital",
        title: `Rebook ${firstName(item.patient)}’s ${item.department.toLowerCase()} visit`,
        text: `${item.doctor} had an emergency. Refunded ${item.refund} to source`,
        cta: "Rebook for free",
        onClick: () => handleRebook(item),
      })),
    ...appointments
      .filter((item) => item.status === "Completed" && !item.prescriptionSeen)
      .map((item) => ({
        key: `prx-${item.id}`,
        title: "Prescription ready",
        text: `${item.doctor} has provided your prescription`,
        cta: "View Prescription",
        onClick: () => openPrescription(item),
      })),
  ];

  return (
    <>
      <Navbar />
      <div className="patient-appointments ap-page">
        <Sidebar />

        <main className="pa-main ap-main">
          <div className="ap-content">
            <Toolbar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              search={search}
              setSearch={setSearch}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              patientFilter={patientFilter}
              setPatientFilter={setPatientFilter}
            />

            {filteredAppointments.length > 0 ? (
              <AppointmentTable
                appointments={filteredAppointments}
                onAction={handleAction}
              />
            ) : (
              <EmptyState
                activeTab={activeTab}
                hasFilters={hasFilters}
                onClearFilters={clearFilters}
                onFindDoctor={onFindDoctor}
              />
            )}
          </div>

          <SidePanel
            todos={todos}
            onJoinCall={handleJoinCall}
            onViewLive={() =>
              setModal({ appointment: liveConsultation, view: "details" })
            }
          />
        </main>

        {modal?.view === "slip" && (
          <ConfirmDialog
            title="Appointment details"
            subtitle={`${modal.appointment.doctor} · ${modal.appointment.date} · ${modal.appointment.time}`}
            secondaryLabel="Add to calendar"
            primaryLabel="Download slip"
            onSecondary={() => {
              downloadCalendarEvent(modal.appointment);
              closeModal();
              setToast("Added to your calendar");
            }}
            onPrimary={() =>
              handleDownload(modal.appointment, "Appointment slip downloaded")
            }
            onClose={closeModal}
          >
            <p>
              Download your appointment slip with directions, OPD location and
              prep instructions, or add it to your calendar.
            </p>
            <p className="ap-slip-manage">
              Need to reschedule or cancel?{" "}
              <button
                type="button"
                onClick={() => setModal({ appointment: modal.appointment, view: "details" })}
              >
                Manage appointment
              </button>
            </p>
          </ConfirmDialog>
        )}

        {modal && modal.view !== "slip" && (
          <AppointmentModal
            key={`${modal.appointment.id}-${modal.view}`}
            appointment={
              appointments.find((item) => item.id === modal.appointment.id) ||
              modal.appointment
            }
            view={modal.view}
            setView={(view) => setModal({ ...modal, view })}
            onClose={closeModal}
            onDownload={handleDownload}
            onReschedule={handleReschedule}
            onCancel={handleCancel}
            onRebook={handleRebook}
            onJoinCall={handleJoinCall}
          />
        )}

        <Toast message={toast} onClose={closeToast} />
      </div>
      <Footer />
    </>
  );
}
