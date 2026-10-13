import React, { useMemo, useState } from "react";
import { Search } from "lucide-react";
import "./AppointmentsList.css";
import { useAppointments, isLive, buildPatientOptions, matchesPatient } from "../appointments";
import AppointmentsTable, { STATUS, StatusBadge } from "../AppointmentsTable/AppointmentsTable";
import { FilterSelect, SegmentedTabs } from "../DashboardControls";

const BANNER_LABELS = {
  video: "Video consultation",
  hospital: "In-person visit",
  call: "Phone consultation",
};

function NextAppointmentBanner({ appointment: a }) {
  const live = isLive(a);
  return (
    <section className="appt-banner" aria-label={live ? "Appointment in progress" : "Next appointment"}>
      <div className="appt-banner-info">
        <div className="appt-banner-doctor">
          <p className="appt-banner-name">{a.doctor}</p>
          <p className="appt-banner-sub">{a.specialty}</p>
        </div>
        <div className="appt-banner-when">
          <p className="appt-banner-label">
            {BANNER_LABELS[a.consultationType] || a.type}
          </p>
          <p className="appt-banner-time">
            {a.date}, {a.time}
          </p>
        </div>
      </div>

      <div className="appt-banner-actions">
        {live ? (
          <span className="appt-live">
            <span className="appt-live-dot" />
            Live
          </span>
        ) : (
          <StatusBadge status="upcoming" />
        )}
        {live && a.consultationType === "video" && (
          // TODO: connect to the video-call join flow (meetId / patient meet token)
          <button type="button" className="appt-join-btn" disabled title="Video calls aren't connected yet">
            Join video call
          </button>
        )}
      </div>
    </section>
  );
}

export default function AppointmentsList({ patientId }) {
  const { appointments, loading, error, retry } = useAppointments(patientId);
  const [tab, setTab] = useState("upcoming");
  const [status, setStatus] = useState("all");
  const [patient, setPatient] = useState("me");
  const [query, setQuery] = useState("");

  const nextAppointment = useMemo(
    () => appointments.find((a) => isLive(a)) || appointments.find((a) => a.status === "upcoming"),
    [appointments]
  );

  const inTab = useMemo(
    () =>
      appointments.filter((a) =>
        tab === "upcoming" ? a.status === "upcoming" : a.status !== "upcoming"
      ),
    [appointments, tab]
  );

  const statusOptions = useMemo(() => {
    const present = [...new Set(inTab.map((a) => a.status))];
    return [
      { value: "all", label: "All" },
      ...present.map((s) => ({ value: s, label: STATUS[s].label })),
    ];
  }, [inTab]);

  const patientOptions = useMemo(() => buildPatientOptions(appointments), [appointments]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return inTab.filter((a) => {
      if (status !== "all" && a.status !== status) return false;
      if (!matchesPatient(a, patient)) return false;
      return !q || `${a.doctor} ${a.specialty}`.toLowerCase().includes(q);
    });
  }, [inTab, status, patient, query]);

  const switchTab = (next) => {
    setTab(next);
    setStatus("all");
  };

  const isFiltered = Boolean(query.trim()) || status !== "all" || patient !== "all";

  return (
    <div className="appt-page">
      {!loading && nextAppointment && <NextAppointmentBanner appointment={nextAppointment} />}

      <div className="appt-toolbar">
        <label className="dash-search appt-search">
          <input
            type="search"
            placeholder="Search doctor or department"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Search size={20} strokeWidth={1.5} />
        </label>

        <div className="appt-toolbar-filters">
          <FilterSelect label="Status" value={status} options={statusOptions} onChange={setStatus} />
          <FilterSelect
            label="Patient"
            value={patient}
            options={patientOptions}
            onChange={setPatient}
            alwaysShowValue
          />

          <SegmentedTabs
            className="appt-tabs"
            label="Appointment period"
            options={[
              ["upcoming", "Upcoming"],
              ["past", "Past"],
            ]}
            value={tab}
            onChange={switchTab}
          />
        </div>
      </div>

      <AppointmentsTable
        key={tab}
        appointments={filtered}
        loading={loading}
        error={error}
        onRetry={retry}
        typeLabel="Consultation"
        isFiltered={isFiltered && inTab.length > 0}
        emptyMessage={
          tab === "upcoming"
            ? "You have no upcoming appointments."
            : "You have no past appointments."
        }
        noMatchMessage="No appointments match these filters."
      />
    </div>
  );
}
