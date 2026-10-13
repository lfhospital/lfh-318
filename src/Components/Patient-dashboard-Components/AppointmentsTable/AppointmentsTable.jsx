import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, X, Clock, CircleAlert, User, Users } from "lucide-react";
import "./AppointmentsTable.css";

export const STATUS = {
  upcoming: { label: "Upcoming", icon: Calendar },
  completed: { label: "Completed" },
  cancelledByHospital: { label: "Cancelled by hospital", icon: X },
  cancelled: { label: "Cancelled", icon: X },
  missed: { label: "Missed", icon: CircleAlert },
  pending: { label: "Awaiting update", icon: Clock },
};

export function StatusBadge({ status }) {
  const { label, icon: Icon } = STATUS[status];
  return (
    <span className={`dash-badge dash-badge-${status}`}>
      {Icon ? <Icon size={12} strokeWidth={1.5} /> : <span className="dash-badge-dot" />}
      {label}
    </span>
  );
}

function SkeletonRows() {
  return Array.from({ length: 4 }, (_, i) => (
    <tr key={i}>
      {Array.from({ length: 6 }, (_, j) => (
        <td key={j}>
          <span className="dash-skeleton" />
          {j !== 1 && j !== 5 && <span className="dash-skeleton short" />}
        </td>
      ))}
    </tr>
  ));
}

function MessageRow({ children }) {
  return (
    <tr>
      <td colSpan={6} className="dash-empty">
        {children}
      </td>
    </tr>
  );
}

export default function AppointmentsTable({
  appointments,
  loading,
  error,
  onRetry,
  emptyMessage = "You don't have any appointments yet.",
  noMatchMessage = "No appointments match your search.",
  isFiltered = false,
  typeLabel = "Appointment type",
  pageSize = 10,
}) {
  const navigate = useNavigate();
  const [showAll, setShowAll] = useState(false);

  const visible = showAll ? appointments : appointments.slice(0, pageSize);

  const handleAction = (e, a) => {
    e.preventDefault();
    if (a.action.rebook && a.doctorId) navigate(`/doctor-profile/${a.doctorId}`);
  };

  const renderBody = () => {
    if (loading) return <SkeletonRows />;
    if (error)
      return (
        <MessageRow>
          {error}{" "}
          <button type="button" className="dash-link-btn" onClick={onRetry}>
            Try again
          </button>
        </MessageRow>
      );
    if (!appointments.length)
      return isFiltered ? (
        <MessageRow>{noMatchMessage}</MessageRow>
      ) : (
        <MessageRow>
          {emptyMessage}{" "}
          <button type="button" className="dash-link-btn" onClick={() => navigate("/doctors")}>
            Book an appointment
          </button>
        </MessageRow>
      );

    return visible.map((a) => (
      <tr key={a.id}>
        <td>
          <span className="dash-cell-main dash-cell-strong" title={a.doctor}>
            {a.doctor}
          </span>
          <span className="dash-cell-sub">{a.specialty}</span>
        </td>
        <td>
          <span className="dash-cell-main dash-cell-muted">{a.type}</span>
        </td>
        <td>
          <span className="dash-cell-main">{a.date}</span>
          <span className="dash-cell-sub">{a.time}</span>
        </td>
        <td>
          <span className="dash-cell-main dash-cell-muted" title={a.patient}>
            {a.patient}
          </span>
          <span className="dash-cell-sub dash-relation">
            {a.relation === "Me" ? (
              <User size={10} strokeWidth={1.5} />
            ) : (
              <Users size={10} strokeWidth={1.5} />
            )}
            {a.relation}
          </span>
        </td>
        <td>
          <StatusBadge status={a.status} />
        </td>
        <td>
          <a href="#" className="dash-action" onClick={(e) => handleAction(e, a)}>
            {a.action.label}
          </a>
        </td>
      </tr>
    ));
  };

  return (
    <>
      <div className="dash-table-wrap" aria-busy={loading}>
        <table className="dash-table">
          <colgroup>
            <col />
            <col className="dash-col-type" />
            <col className="dash-col-date" />
            <col className="dash-col-patient" />
            <col />
            <col className="dash-col-actions" />
          </colgroup>
          <thead>
            <tr>
              <th>Doctor</th>
              <th>{typeLabel}</th>
              <th>Date</th>
              <th>Patient</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>{renderBody()}</tbody>
        </table>
      </div>

      {!loading && !error && appointments.length > pageSize && (
        <button type="button" className="dash-show-all" onClick={() => setShowAll((v) => !v)}>
          {showAll ? "Show fewer" : `Show all ${appointments.length} appointments`}
        </button>
      )}
    </>
  );
}
