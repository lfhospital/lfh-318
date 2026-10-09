import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Calendar, X, Clock, CircleAlert, User, Users } from "lucide-react";
import "./DashboardOverview.css";
import { useAppointments } from "../appointments";

const PAGE_SIZE = 10;

const STATUS = {
  upcoming: { label: "Upcoming", icon: Calendar },
  completed: { label: "Completed" },
  cancelledByHospital: { label: "Cancelled by hospital", icon: X },
  cancelled: { label: "Cancelled", icon: X },
  missed: { label: "Missed", icon: CircleAlert },
  pending: { label: "Awaiting update", icon: Clock },
};

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function StatusBadge({ status }) {
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
    <tr key={i} className="dash-skeleton-row">
      {Array.from({ length: 6 }, (_, j) => (
        <td key={j}>
          <span className="dash-skeleton" />
          {j !== 1 && j !== 5 && <span className="dash-skeleton short" />}
        </td>
      ))}
    </tr>
  ));
}

export default function DashboardOverview({ firstName, patientId }) {
  const navigate = useNavigate();
  const { appointments, loading, error, retry } = useAppointments(patientId);
  const [query, setQuery] = useState("");
  const [showAll, setShowAll] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return appointments;
    return appointments.filter((a) =>
      [a.doctor, a.specialty, a.type, a.date, a.patient, STATUS[a.status].label]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [appointments, query]);

  const visible = showAll || query ? filtered : filtered.slice(0, PAGE_SIZE);

  const handleAction = (e, a) => {
    e.preventDefault();
    if (a.action.rebook && a.doctorId) navigate(`/doctor-profile/${a.doctorId}`);
  };

  const renderBody = () => {
    if (loading) return <SkeletonRows />;
    if (error)
      return (
        <tr>
          <td colSpan={6} className="dash-empty">
            {error}{" "}
            <button type="button" className="dash-link-btn" onClick={retry}>
              Try again
            </button>
          </td>
        </tr>
      );
    if (!appointments.length)
      return (
        <tr>
          <td colSpan={6} className="dash-empty">
            You don't have any appointments yet.{" "}
            <button type="button" className="dash-link-btn" onClick={() => navigate("/doctors")}>
              Book an appointment
            </button>
          </td>
        </tr>
      );
    if (!visible.length)
      return (
        <tr>
          <td colSpan={6} className="dash-empty">
            No appointments match “{query}”.
          </td>
        </tr>
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
    <div className="dash-overview">
      <h1 className="dash-greeting">
        {getGreeting()}
        {firstName ? `, ${firstName}.` : "."}
      </h1>

      <div className="dash-toolbar">
        <label className="dash-search">
          <input
            type="search"
            placeholder="Search for appointments, reports, prescriptions..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Search size={20} strokeWidth={1.5} />
        </label>

        <div className="dash-toolbar-actions">
          <button type="button" className="dash-outline-btn">
            View Reports
          </button>
          <button type="button" className="dash-outline-btn">
            View Prescriptions
          </button>
        </div>
      </div>

      <section className="dash-appointments" aria-busy={loading}>
        <h2>Upcoming &amp; recent</h2>

        <div className="dash-table-wrap">
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
                <th>Appointment type</th>
                <th>Date</th>
                <th>Patient</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>{renderBody()}</tbody>
          </table>
        </div>

        {!loading && !error && !query && filtered.length > PAGE_SIZE && (
          <button type="button" className="dash-show-all" onClick={() => setShowAll((v) => !v)}>
            {showAll ? "Show fewer" : `Show all ${filtered.length} appointments`}
          </button>
        )}
      </section>
    </div>
  );
}
