import React, { useCallback, useState } from "react";
import "../PatientAppointments/PatientAppointments.css";
import "../PatientReports/PatientReports.css";
import "../AppointmentsEmpty/AppointmentsEmpty.css";
import "../Appointments/Appointments.css";
import "./Reports.css";
import Navbar from "../../Home-page-Components/Navbar/Navbar";
import Footer from "../../Home-page-Components/Footer/HomeFooter";
import { Icon, Sidebar } from "../PatientAppointments/PatientAppointments";
import { ReportsTable } from "../PatientReports/PatientReports";
import { Toast } from "../Appointments/Appointments";

const SORT_OPTIONS = [
  { value: "All", label: "All" },
  { value: "Newest", label: "Newest" },
  { value: "Oldest", label: "Oldest" },
  { value: "Name", label: "Name (A–Z)" },
];

// Report dates are display strings ("Today", "2 May 2026").
const toTime = (date) =>
  date === "Today" ? Date.now() : new Date(date).getTime() || 0;

const sortReports = (reports, sort) => {
  const list = [...reports];
  if (sort === "Newest") return list.sort((a, b) => toTime(b.date) - toTime(a.date));
  if (sort === "Oldest") return list.sort((a, b) => toTime(a.date) - toTime(b.date));
  if (sort === "Name") return list.sort((a, b) => a.name.localeCompare(b.name));
  return list;
};

function SortDropdown({ value, onChange }) {
  return (
    <label className="pa-select-wrap rp-sort">
      <span className="rp-sort-label">Sort by:</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label="Sort reports"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <Icon name="chevron" size={18} />
    </label>
  );
}

export default function Reports({ initialReports = [], onBookCheckup }) {
  const [sort, setSort] = useState("All");
  const [toast, setToast] = useState("");
  const closeToast = useCallback(() => setToast(""), []);

  const reports = sortReports(initialReports, sort);

  const handleView = (report) => {
    if (report.status !== "Ready") {
      setToast(`${report.name} is still processing`);
      return;
    }
    setToast(`Opening ${report.name}…`);
  };

  const handleDownload = (report) => {
    if (report.status !== "Ready") {
      setToast(`${report.name} will be downloadable once ready`);
      return;
    }
    setToast(`${report.name} downloaded`);
  };

  return (
    <>
      <Navbar />
      <div className="patient-appointments ap-page rp-page">
        <Sidebar active="Reports" />

        <main className="pa-main rp-main">
          <div className="rp-header">
            {reports.length === 0 ? (
              <section className="ae-empty rp-empty">
                <h1 className="ae-empty-title">No reports yet</h1>
                <p className="ae-empty-text">
                  When your lab tests and diagnostics are ready, they'll appear
                  here, secure, searchable and downloadable.
                </p>
                <button
                  type="button"
                  className="ae-empty-button"
                  onClick={onBookCheckup}
                >
                  Book a health checkup
                </button>
              </section>
            ) : (
              <h1 className="ae-empty-title rp-title">Reports</h1>
            )}

            <SortDropdown value={sort} onChange={setSort} />
          </div>

          {reports.length > 0 && (
            <ReportsTable
              reports={reports}
              onView={handleView}
              onDownload={handleDownload}
            />
          )}
        </main>

        <Toast message={toast} onClose={closeToast} />
      </div>
      <Footer />
    </>
  );
}
