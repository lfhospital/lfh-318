import React, { useCallback, useEffect, useState } from "react";
import "../PatientAppointments/PatientAppointments.css";
import "../Appointments/Appointments.css";
import "./CancelledByHospital.css";
import Navbar from "../../Home-page-Components/Navbar/Navbar";
import Footer from "../../Home-page-Components/Footer/HomeFooter";
import {
  AppointmentTable,
  AppointmentToolbar,
  ConsultationBanner,
  Icon,
  Sidebar,
} from "../PatientAppointments/PatientAppointments";
import {
  AppointmentModal,
  Toast,
  downloadSlip,
  rescheduleSlots,
} from "../Appointments/Appointments";

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
  },
  {
    id: 3,
    doctor: "Dr. A. Menon",
    doctorFullName: "Dr. Ananya Menon",
    department: "Cardiology",
    consultation: "Video",
    date: "10 May 2026",
    day: "Sun, 10 May",
    time: "5:30 PM",
    patient: "Shreya Iyer",
    relation: "Family",
    status: "Cancelled by hospital",
    amount: "₹841",
  },
  {
    id: 4,
    doctor: "Dr. A. Menon",
    department: "Cardiology",
    consultation: "In person",
    date: "12 May 2026",
    time: "5:30 PM",
    patient: "Shreya Iyer",
    relation: "Family",
    status: "Rescheduled",
  },
];

const PAST_STATUSES = ["Completed", "Refunded", "Cancelled"];

const actionLabel = (status) => {
  if (status === "Completed") return "View prescription";
  if (status === "Refunded") return "View details";
  return "Manage";
};

/* Cancelled-by-hospital dialog: notice → refund / rebook */

function HospitalCancelledModal({ appointment, onClose, onRefund, onRebook }) {
  const [step, setStep] = useState("notice");
  const [slot, setSlot] = useState(null);
  const doctor = appointment.doctorFullName || appointment.doctor;
  const when = `${appointment.day || appointment.date} · ${appointment.time}`;

  useEffect(() => {
    const onKey = (event) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const content = {
    notice: {
      title: "Your appointment was cancelled by the hospital",
      body: (
        <p className="cbh-text">
          We're sorry, your assigned doctor is no longer available for this
          slot. You can reschedule for free or request a full refund.
        </p>
      ),
      secondary: { label: "Refund amount", onClick: () => setStep("refund") },
      primary: { label: "Rebook free", onClick: () => setStep("rebook") },
    },
    refund: {
      title: "Request a full refund",
      body: (
        <>
          <dl className="cbh-refund">
            <div>
              <dt>Consultation fee</dt>
              <dd>{appointment.amount}</dd>
            </div>
            <div>
              <dt>Cancellation charges</dt>
              <dd>₹0</dd>
            </div>
            <div className="cbh-refund-total">
              <dt>Refund amount</dt>
              <dd>{appointment.amount}</dd>
            </div>
          </dl>
          <p className="cbh-text">
            The full amount goes back to your original payment method within
            5–7 working days.
          </p>
        </>
      ),
      secondary: { label: "Back", onClick: () => setStep("notice") },
      primary: {
        label: "Confirm refund",
        onClick: () => onRefund(appointment),
      },
    },
    rebook: {
      title: "Rebook for free",
      body: (
        <>
          <p className="cbh-text">
            Pick a new slot for {appointment.patient}. There's no extra charge.
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
        </>
      ),
      secondary: { label: "Back", onClick: () => setStep("notice") },
      primary: {
        label: "Confirm rebooking",
        disabled: !slot,
        onClick: () => onRebook(appointment, slot),
      },
    },
  }[step];

  return (
    <div className="cbh-overlay" onClick={onClose}>
      <div
        className="cbh-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cbh-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="cbh-content">
          <div className="cbh-heading">
            <div className="cbh-title-row">
              <h2 id="cbh-title">{content.title}</h2>
              <button className="cbh-close" onClick={onClose} aria-label="Close">
                <Icon name="close" size={14} />
              </button>
            </div>
            <p className="cbh-meta">
              {doctor} · {when}
            </p>
          </div>
          {content.body}
        </div>

        <div className="cbh-actions">
          <button className="cbh-button cbh-button--outline" onClick={content.secondary.onClick}>
            {content.secondary.label}
          </button>
          <button
            className="cbh-button cbh-button--primary"
            onClick={content.primary.onClick}
            disabled={content.primary.disabled}
          >
            {content.primary.label}
          </button>
        </div>
      </div>
    </div>
  );
}

/* Page */

export default function CancelledByHospital() {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [patientFilter, setPatientFilter] = useState("All");
  const [activeTab, setActiveTab] = useState("Upcoming");
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState("");

  const closeModal = useCallback(() => setModal(null), []);
  const closeToast = useCallback(() => setToast(""), []);

  const updateAppointment = (id, changes) =>
    setAppointments((list) =>
      list.map((item) => (item.id === id ? { ...item, ...changes } : item))
    );

  const visibleAppointments = appointments
    .filter((appointment) => {
      const query = search.trim().toLowerCase();
      const isPast = PAST_STATUSES.includes(appointment.status);

      return (
        (activeTab === "Past" ? isPast : !isPast) &&
        (statusFilter === "All" || appointment.status === statusFilter) &&
        (patientFilter === "All" || appointment.relation === patientFilter) &&
        (!query ||
          appointment.doctor.toLowerCase().includes(query) ||
          appointment.department.toLowerCase().includes(query) ||
          appointment.patient.toLowerCase().includes(query))
      );
    })
    .map((appointment) => ({
      ...appointment,
      action: actionLabel(appointment.status),
    }));

  const handleAction = (appointment) => {
    if (appointment.status === "Cancelled by hospital") {
      setModal({ type: "hospital", id: appointment.id });
      return;
    }
    setModal({
      type: "details",
      id: appointment.id,
      view: appointment.status === "Completed" ? "prescription" : "details",
    });
  };

  const handleRefund = (appointment) => {
    updateAppointment(appointment.id, { status: "Refunded" });
    closeModal();
    setToast(`Refund of ${appointment.amount} initiated`);
  };

  const handleRebook = (appointment, slot) => {
    updateAppointment(appointment.id, {
      date: slot.date,
      day: undefined,
      time: slot.time,
      status: "Upcoming",
    });
    closeModal();
    setToast(`Rebooked for free on ${slot.date}, ${slot.time}`);
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

  const handleDownload = (appointment, message) => {
    downloadSlip(appointment);
    closeModal();
    setToast(message);
  };

  const handleJoinCall = () => {
    closeModal();
    setToast("Connecting you to Dr. A. Menon…");
  };

  const selected = modal && appointments.find((item) => item.id === modal.id);

  return (
    <>
      <Navbar />
      <div className="patient-appointments ap-page cbh-page">
        <Sidebar />

        <main className="pa-main">
          <ConsultationBanner onJoin={handleJoinCall} />

          <AppointmentToolbar
            search={search}
            setSearch={setSearch}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            patientFilter={patientFilter}
            setPatientFilter={setPatientFilter}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          <AppointmentTable
            appointments={visibleAppointments}
            onAction={handleAction}
          />
        </main>

        {selected && modal.type === "hospital" && (
          <HospitalCancelledModal
            appointment={selected}
            onClose={closeModal}
            onRefund={handleRefund}
            onRebook={handleRebook}
          />
        )}

        {selected && modal.type === "details" && (
          <AppointmentModal
            key={`${selected.id}-${modal.view}`}
            appointment={selected}
            view={modal.view}
            setView={(view) => setModal({ ...modal, view })}
            onClose={closeModal}
            onDownload={handleDownload}
            onReschedule={handleReschedule}
            onCancel={handleCancel}
            onRebook={(appointment) => handleRebook(appointment, rescheduleSlots[0])}
            onJoinCall={handleJoinCall}
          />
        )}

        <Toast message={toast} onClose={closeToast} />
      </div>
      <Footer />
    </>
  );
}
