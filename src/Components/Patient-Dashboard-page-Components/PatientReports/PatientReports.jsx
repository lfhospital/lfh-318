import React, { useCallback, useMemo, useState } from "react";
import "../Appointments/Appointments.css";
import "./PatientReports.css";
import Navbar from "../../Home-page-Components/Navbar/Navbar";
import Footer from "../../Home-page-Components/Footer/HomeFooter";
import { Modal, Toast } from "../Appointments/Appointments";
import UploadDialog, { defaultUpload } from "../UploadDialog/UploadDialog";
import FilterMenu from "../FilterMenu/FilterMenu";
import { signOut } from "../../../auth";
import { navigateTo, patientPageFor } from "../../../navigation";
import { formatShortDate } from "../../../dates";

const DAY_MS = 24 * 60 * 60 * 1000;

export const SORT_OPTIONS = [
  { label: "All", value: "All" },
  { label: "Last 30 days", value: "30d" },
  { label: "Last 3 months", value: "3m" },
  ...[2026, 2025, 2024, 2023, 2022, 2021, 2020].map((year) => ({
    label: String(year),
    value: String(year),
  })),
];

// Report dates are display strings ("Today", "2 May 2026").
const reportDate = (report) =>
  report.date === "Today" ? new Date() : new Date(report.date);

function inDateRange(date, range) {
  const age = Date.now() - date.getTime();
  if (range === "30d") return age <= 30 * DAY_MS;
  if (range === "3m") return age <= 92 * DAY_MS;
  return String(date.getFullYear()) === range;
}

const Icon = ({ name, size = 20 }) => {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  const icons = {
    overview: (
      <>
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 10h18" />
      </>
    ),
    prescription: (
      <>
        <path d="M6 3h9l5 5v13H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
        <path d="M14 3v6h6M8 13h8M8 17h8" />
      </>
    ),
    reports: (
      <>
        <path d="M2 12h5l3-9 5 18 3-9h4" />
      </>
    ),
    check: (
      <>
        <rect x="4" y="4" width="16" height="16" rx="1.5" />
        <path d="m8 12 3 3 9-10" />
        <path d="M15 3h6v6" />
      </>
    ),
    payments: (
      <>
        <rect x="2.5" y="5" width="19" height="14" rx="2" />
        <path d="M3 10h18" />
      </>
    ),
    family: (
      <>
        <circle cx="9" cy="7" r="3.5" />
        <path d="M2 20v-2a7 7 0 0 1 14 0v2" />
        <path d="M16 4.2a3.5 3.5 0 0 1 0 6.6M19 14a5 5 0 0 1 3 4.5V20" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="m19.4 15 .1.1 1.4 1.1-1.5 2.6-1.8-.6a8 8 0 0 1-1.8 1l-.3 1.9h-3l-.3-1.9a8 8 0 0 1-1.8-1l-1.8.6-1.5-2.6 1.5-1.1a7 7 0 0 1 0-2l-1.5-1.1 1.5-2.6 1.8.6a8 8 0 0 1 1.8-1l.3-1.9h3l.3 1.9a8 8 0 0 1 1.8 1l1.8-.6 1.5 2.6-1.5 1.1a7 7 0 0 1 0 2Z" />
      </>
    ),
    signout: (
      <>
        <path d="M10 17l5-5-5-5M15 12H3" />
        <path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7" />
      </>
    ),
    sidebar: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="1" />
        <path d="M15 3v18" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m16 16 5 5" />
      </>
    ),
    upload: (
      <>
        <path d="M12 16V4" />
        <path d="m7 9 5-5 5 5" />
        <path d="M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5" />
      </>
    ),
    chevron: <path d="m6 9 6 6 6-6" />,
    user: (
      <>
        <circle cx="12" cy="8" r="3" />
        <path d="M5 21v-2a7 7 0 0 1 14 0v2" />
      </>
    ),
    refresh: (
      <>
        <path d="M20 7v5h-5" />
        <path d="M20 12a8 8 0 1 1-2.3-5.7L20 9" />
      </>
    ),
    eye: (
      <>
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
    download: (
      <>
        <path d="M12 3v12" />
        <path d="m7 10 5 5 5-5" />
        <path d="M4 17v4h16v-4" />
      </>
    ),
  };

  return <svg {...common}>{icons[name]}</svg>;
};

/* Sidebar navigation */

const navigationGroups = [
  {
    label: "MY CARE",
    items: [
      { label: "Overview", icon: "overview", count: "10" },
      { label: "Appointments", icon: "calendar" },
      { label: "Prescriptions", icon: "prescription" },
      { label: "Reports", icon: "reports" },
      { label: "Second opinion", icon: "check" },
    ],
  },
  {
    label: "ACCOUNT",
    items: [
      { label: "Payments", icon: "payments" },
      { label: "Family Members", icon: "family" },
      { label: "Profile & Settings", icon: "settings" },
    ],
  },
];

function Sidebar() {
  const [activeItem, setActiveItem] = useState("Reports");
  // Collapsed: icons only.
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`pr-sidebar${collapsed ? " is-collapsed" : ""}`}>
      <div>
        <div className="pr-sidebar-heading">
          <span className="pr-brand">MY CARE</span>

          <button
            className="pr-sidebar-toggle"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!collapsed}
            onClick={() => setCollapsed(!collapsed)}
          >
            <Icon name="sidebar" size={17} />
          </button>
        </div>

        <nav className="pr-navigation">
          {navigationGroups.map((group) => (
            <div className="pr-nav-group" key={group.label}>
              <div className="pr-nav-items">
                {group.items.map((item) => (
                  <button
                    key={item.label}
                    className={`pr-nav-item ${
                      activeItem === item.label ? "is-active" : ""
                    }`}
                    onClick={() => {
                      setActiveItem(item.label);
                      const page = patientPageFor(item.label);
                      if (page) navigateTo(page);
                    }}
                  >
                    <span className="pr-nav-icon">
                      <Icon name={item.icon} size={20} />
                    </span>

                    <span>{item.label}</span>

                    {item.count && (
                      <span className="pr-nav-count">{item.count}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>

      <button
        className="pr-signout"
        onClick={() => {
          signOut();
          navigateTo("LoginPage");
        }}
      >
        <Icon name="signout" size={18} />
        <span>Signout</span>
      </button>
    </aside>
  );
}

/* Tabs */

function ReportTabs({ activeTab, setActiveTab }) {
  return (
    <div className="pr-tabs">
      {["Issued", "Uploaded"].map((tab) => (
        <button
          key={tab}
          className={activeTab === tab ? "is-active" : ""}
          onClick={() => setActiveTab(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

/* Toolbar */

function ReportsToolbar({
  activeTab,
  setActiveTab,
  search,
  setSearch,
  status,
  setStatus,
  patient,
  setPatient,
  sort,
  setSort,
  onUpload,
}) {
  return (
    <div className="pr-toolbar">
      <ReportTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <label className="pr-search">
        <input
          type="text"
          placeholder="Search by medicine, doctor or patient name"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          aria-label="Search reports"
        />

        <Icon name="search" size={21} />
      </label>

      <button className="pr-upload-button" onClick={onUpload}>
        <Icon name="upload" size={16} />
        <span>Upload reports</span>
      </button>

      <FilterMenu
        label="Status"
        value={status}
        onChange={setStatus}
        hideAllValue
        options={[
          { label: "All", value: "All" },
          { label: "Processing", value: "Processing" },
          { label: "Ready", value: "Ready" },
        ]}
      />

      <FilterMenu
        label="Patient"
        value={patient}
        onChange={setPatient}
        options={[
          { label: "All", value: "All" },
          { label: "Me", value: "Me" },
          { label: "Family", value: "Family" },
        ]}
      />

      <FilterMenu
        label="Sort"
        value={sort}
        onChange={setSort}
        align="right"
        options={SORT_OPTIONS}
      />
    </div>
  );
}

/* Status badge */

function ReportStatus({ status }) {
  return (
    <span className={`pr-status pr-status--${status.toLowerCase()}`}>
      {status === "Processing" ? (
        <Icon name="refresh" size={12} />
      ) : (
        <span className="pr-status-dot" />
      )}

      {status}
    </span>
  );
}

/* Reports table */

export function ReportsTable({ reports, onView, onDownload }) {
  return (
    <div className="pr-table-wrapper">
      <table className="pr-table">
        <thead>
          <tr>
            <th>REPORTS</th>
            <th>ORDERED BY</th>
            <th>DATE</th>
            <th>PATIENT</th>
            <th>STATUS</th>
            <th>ACTIONS</th>
          </tr>
        </thead>

        <tbody>
          {reports.map((report) => (
            <tr key={report.id}>
              <td>
                <div className="pr-report-cell">
                  <span className="pr-primary-text">{report.name}</span>

                  <span className="pr-secondary-text">{report.category}</span>
                </div>
              </td>

              <td>
                <div className="pr-doctor-cell">
                  <span className="pr-primary-text">{report.doctor}</span>

                  <span className="pr-secondary-text">{report.department}</span>
                </div>
              </td>

              <td>
                <span className="pr-date-text">{report.date}</span>
              </td>

              <td>
                <div className="pr-patient-cell">
                  <span className="pr-patient-name">{report.patient}</span>

                  <span className="pr-patient-relation">
                    <Icon name="user" size={11} />
                    {report.relation}
                  </span>
                </div>
              </td>

              <td>
                <ReportStatus status={report.status} />
              </td>

              <td>
                <div className="pr-action-buttons">
                  <button
                    className="pr-icon-button"
                    aria-label={`View ${report.name}`}
                    title={report.status === "Ready" ? "View report" : "Available once ready"}
                    disabled={report.status !== "Ready"}
                    onClick={() => onView(report)}
                  >
                    <Icon name="eye" size={15} />
                  </button>

                  <button
                    className="pr-icon-button"
                    aria-label={`Download ${report.name}`}
                    title={report.status === "Ready" ? "Download report" : "Available once ready"}
                    disabled={report.status !== "Ready"}
                    onClick={() => onDownload(report)}
                  >
                    <Icon name="download" size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {reports.length === 0 && (
            <tr>
              <td colSpan="6" className="pr-empty-state">
                No reports found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

/* Main component */

export const initialReports = [
  {
    id: 1,
    name: "Lipid Profile",
    category: "Blood · Fasting",
    doctor: "Dr. A. Menon",
    department: "Cardiology",
    date: "Today",
    patient: "Rohan Iyer",
    relation: "Me",
    status: "Processing",
    type: "Issued",
  },
  {
    id: 2,
    name: "2D Echocardiogram",
    category: "Imaging",
    doctor: "Dr. A. Menon",
    department: "Cardiology",
    date: "2 May 2026",
    patient: "Rohan Iyer",
    relation: "Me",
    status: "Ready",
    type: "Issued",
  },
  {
    id: 3,
    name: "TMT Stress Test",
    category: "Cardiac",
    doctor: "Dr. A. Menon",
    department: "Cardiology",
    date: "2 May 2026",
    patient: "Shreya Iyer",
    relation: "Family",
    status: "Processing",
    type: "Issued",
  },
];

function downloadReportSummary(report) {
  const summary = [
    "LAKSHMEE FOUNDATION HOSPITAL",
    `Report · ${report.name} (${report.category})`,
    "",
    `Ordered by: ${report.doctor} (${report.department})`,
    `Patient:    ${report.patient}`,
    `Date:       ${report.date}`,
    `Status:     ${report.status}`,
  ].join("\n");
  const url = URL.createObjectURL(new Blob([summary], { type: "text/plain" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `${report.name.replace(/\s+/g, "-").toLowerCase()}.txt`;
  link.click();
  URL.revokeObjectURL(url);
}

export default function PatientReports({ uploadReport = defaultUpload, onGoogleDrive }) {
  const [activeTab, setActiveTab] = useState("Issued");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [patient, setPatient] = useState("All");
  const [sort, setSort] = useState("All");
  const [reports, setReports] = useState(initialReports);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState("");

  const closeModal = useCallback(() => setModal(null), []);
  const closeToast = useCallback(() => setToast(""), []);

  const filteredReports = useMemo(() => {
    let result = reports.filter((report) => {
      const query = search.trim().toLowerCase();

      const matchesSearch = [
        report.name,
        report.category,
        report.doctor,
        report.department,
        report.patient,
      ].some((value) => value.toLowerCase().includes(query));

      const matchesStatus = status === "All" || report.status === status;

      const matchesPatient = patient === "All" || report.relation === patient;

      const matchesTab = report.type === activeTab;

      return matchesSearch && matchesStatus && matchesPatient && matchesTab;
    });

    // Sort limits the list to a date range (design: Last 30 days, a year…),
    // newest first.
    if (sort !== "All") {
      result = result.filter((report) => inDateRange(reportDate(report), sort));
    }
    result.sort((a, b) => reportDate(b) - reportDate(a));

    return result;
  }, [reports, search, status, patient, sort, activeTab]);

  const handleUploaded = (file) => {
    setReports((previous) => [
      ...previous,
      {
        id: Date.now(),
        name: file.name.replace(/\.[^/.]+$/, ""),
        category: "Uploaded document",
        doctor: "—",
        department: "Self uploaded",
        date: formatShortDate(new Date()),
        patient: "Rohan Iyer",
        relation: "Me",
        status: "Ready",
        type: "Uploaded",
        file,
      },
    ]);
    setActiveTab("Uploaded");
    closeModal();
    setToast("Report uploaded");
  };

  const handleView = (report) => {
    if (report.file) {
      const url = URL.createObjectURL(report.file);
      window.open(url, "_blank", "noopener,noreferrer");
      return;
    }
    setModal({ type: "view", report });
  };

  const handleDownload = (report) => {
    if (report.file) {
      const url = URL.createObjectURL(report.file);
      const link = document.createElement("a");
      link.href = url;
      link.download = report.file.name;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } else {
      downloadReportSummary(report);
    }
    setToast(`${report.name} downloaded`);
  };

  return (
    <>
      <Navbar />
      <div className="patient-reports ap-page">
        <Sidebar />

        <main className="pr-main">
          <ReportsToolbar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            search={search}
            setSearch={setSearch}
            status={status}
            setStatus={setStatus}
            patient={patient}
            setPatient={setPatient}
            sort={sort}
            setSort={setSort}
            onUpload={() => setModal({ type: "upload" })}
          />

          <ReportsTable
            reports={filteredReports}
            onView={handleView}
            onDownload={handleDownload}
          />
        </main>

        {modal?.type === "upload" && (
          <UploadDialog
            title="Upload your medical reports"
            subtitle="Upload, organize, and access your reports whenever you need them."
            onClose={closeModal}
            onUploaded={handleUploaded}
            upload={uploadReport}
            onGoogleDrive={onGoogleDrive}
          />
        )}

        {modal?.type === "view" && (
          <Modal title={modal.report.name} onClose={closeModal}>
            <dl className="ap-details">
              {[
                ["Type", modal.report.category],
                ["Ordered by", `${modal.report.doctor} · ${modal.report.department}`],
                ["Date", modal.report.date],
                ["Patient", `${modal.report.patient} (${modal.report.relation})`],
                ["Status", modal.report.status],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
            <div className="ap-modal-actions">
              <button
                className="ap-primary-button"
                onClick={() => handleDownload(modal.report)}
              >
                <Icon name="download" size={16} />
                Download report
              </button>
            </div>
          </Modal>
        )}

        <Toast message={toast} onClose={closeToast} />
      </div>
      <Footer />
    </>
  );
}
