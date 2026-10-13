import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import "./DashboardOverview.css";
import { useAppointments } from "../appointments";
import AppointmentsTable, { STATUS } from "../AppointmentsTable/AppointmentsTable";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function DashboardOverview({ firstName, patientId }) {
  const navigate = useNavigate();
  const { appointments, loading, error, retry } = useAppointments(patientId);
  const [query, setQuery] = useState("");

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
          <button
            type="button"
            className="dash-outline-btn"
            onClick={() => navigate("/dashboard/prescriptions")}
          >
            View Prescriptions
          </button>
        </div>
      </div>

      <section className="dash-appointments">
        <h2>Upcoming &amp; recent</h2>
        <AppointmentsTable
          appointments={filtered}
          loading={loading}
          error={error}
          onRetry={retry}
          isFiltered={Boolean(query.trim())}
          noMatchMessage={`No appointments match “${query}”.`}
        />
      </section>
    </div>
  );
}
