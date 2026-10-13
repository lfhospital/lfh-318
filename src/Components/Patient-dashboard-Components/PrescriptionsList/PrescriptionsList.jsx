import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Upload, User, Users } from "lucide-react";
import "./PrescriptionsList.css";
import { useAppointments, buildPatientOptions, matchesPatient } from "../appointments";
import { FilterSelect, SegmentedTabs } from "../DashboardControls";

const SOURCES = [
  ["all", "All"],
  ["hospital", "Issued by the hospital"],
  ["self", "Self uploaded"],
];

const EMPTY_COPY = {
  all: {
    title: "No prescriptions yet",
    text: "Prescriptions from your consultations will appear here, ready to download or share with any pharmacy.",
  },
  hospital: {
    title: "No prescriptions from the hospital yet",
    text: "Prescriptions your doctors write after a consultation will appear here.",
  },
  self: {
    title: "No uploaded prescriptions",
    text: "Prescriptions you upload from other doctors or clinics will appear here.",
  },
};

function SkeletonRows() {
  return Array.from({ length: 3 }, (_, i) => (
    <tr key={i}>
      {Array.from({ length: 5 }, (_, j) => (
        <td key={j}>
          <span className="dash-skeleton" />
          {j !== 1 && j !== 4 && <span className="dash-skeleton short" />}
        </td>
      ))}
    </tr>
  ));
}

export default function PrescriptionsList({ patientId }) {
  const navigate = useNavigate();
  const { appointments, loading, error, retry } = useAppointments(patientId);
  const [source, setSource] = useState("all");
  const [patient, setPatient] = useState("me");
  const [query, setQuery] = useState("");

  // Hospital prescriptions come from completed consultations flagged with one.
  // TODO: add self-uploaded prescriptions once there's an API for them.
  const prescriptions = useMemo(() => appointments.filter((a) => a.hasPrescription), [appointments]);

  const patientOptions = useMemo(() => buildPatientOptions(appointments), [appointments]);

  const filtered = useMemo(() => {
    if (source === "self") return [];
    const q = query.trim().toLowerCase();
    return prescriptions.filter(
      (p) =>
        matchesPatient(p, patient) &&
        (!q || `${p.doctor} ${p.specialty} ${p.patient}`.toLowerCase().includes(q))
    );
  }, [prescriptions, source, patient, query]);

  const isFiltered = Boolean(query.trim()) || patient !== "all";
  const showEmptyState = !loading && !error && filtered.length === 0;
  const empty = EMPTY_COPY[source];

  return (
    <div className="rx-page">
      <div className="rx-toolbar">
        <label className="dash-search rx-search">
          <input
            type="search"
            placeholder="Search by medicine, doctor or patient name"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Search size={20} strokeWidth={1.5} />
        </label>

        <div className="rx-toolbar-actions">
          {/* TODO: enable once there's an upload endpoint */}
          <button type="button" className="rx-upload-btn" disabled title="Uploading isn't available yet">
            <Upload size={16} strokeWidth={1.5} />
            Upload prescription
          </button>
          <FilterSelect
            label="Patient"
            value={patient}
            options={patientOptions}
            onChange={setPatient}
            alwaysShowValue
          />
        </div>
      </div>

      <SegmentedTabs
        className="rx-tabs"
        label="Prescription source"
        options={SOURCES}
        value={source}
        onChange={setSource}
      />

      {error && (
        <p className="dash-empty rx-error">
          We couldn't load your prescriptions right now.{" "}
          <button type="button" className="dash-link-btn" onClick={retry}>
            Try again
          </button>
        </p>
      )}

      {showEmptyState &&
        (prescriptions.length && source !== "self" && isFiltered ? (
          <div className="rx-empty">
            <h2>No prescriptions match</h2>
            <p>Try a different search or choose another patient.</p>
          </div>
        ) : (
          <div className="rx-empty">
            <h2>{empty.title}</h2>
            <p>{empty.text}</p>
            <button type="button" className="rx-empty-btn" onClick={() => navigate("/doctors")}>
              Book a consultation
            </button>
          </div>
        ))}

      {(loading || filtered.length > 0) && (
        <div className="dash-table-wrap rx-table-wrap" aria-busy={loading}>
          <table className="dash-table">
            <colgroup>
              <col />
              <col className="dash-col-type" />
              <col className="dash-col-date" />
              <col />
              <col className="dash-col-actions" />
            </colgroup>
            <thead>
              <tr>
                <th>Prescribed by</th>
                <th>Consultation</th>
                <th>Date</th>
                <th>Patient</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <SkeletonRows />
              ) : (
                filtered.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <span className="dash-cell-main dash-cell-strong">{p.doctor}</span>
                      <span className="dash-cell-sub">{p.specialty}</span>
                    </td>
                    <td>
                      <span className="dash-cell-main dash-cell-muted">{p.type}</span>
                    </td>
                    <td>
                      <span className="dash-cell-main">{p.date}</span>
                      <span className="dash-cell-sub">{p.time}</span>
                    </td>
                    <td>
                      <span className="dash-cell-main dash-cell-muted">{p.patient}</span>
                      <span className="dash-cell-sub dash-relation">
                        {p.relation === "Me" ? (
                          <User size={10} strokeWidth={1.5} />
                        ) : (
                          <Users size={10} strokeWidth={1.5} />
                        )}
                        {p.relation}
                      </span>
                    </td>
                    <td>
                      {/* TODO: open the prescription document once there's an endpoint for it */}
                      <a href="#" className="dash-action" onClick={(e) => e.preventDefault()}>
                        View prescription
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
