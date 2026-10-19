import React, { useState } from "react";
import "./PatientAppointments.css";
import Navbar from "../../Home-page-Components/Navbar/Navbar";
import Footer from "../../Home-page-Components/Footer/HomeFooter";
import { signOut } from "../../../auth";
import FilterMenu from "../FilterMenu/FilterMenu";
import { navigateTo, patientPageFor } from "../../../navigation";

const appointmentsData = [
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
    action: "Manage",
    period: "Upcoming",
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
    action: "View prescription",
    period: "Past",
  },
  {
    id: 3,
    doctor: "Dr. A. Menon",
    department: "Cardiology",
    consultation: "Video",
    date: "2 May 2026",
    time: "5:30 PM",
    patient: "Shreya Iyer",
    relation: "Family",
    status: "Cancelled by hospital",
    action: "Manage",
    period: "Past",
  },
  {
    id: 4,
    doctor: "Dr. A. Menon",
    department: "Cardiology",
    consultation: "In person",
    date: "2 May 2026",
    time: "5:30 PM",
    patient: "Shreya Iyer",
    relation: "Family",
    status: "Rescheduled",
    action: "Manage",
    period: "Past",
  },
];

export const Icon = ({ name, size = 20 }) => {
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
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m16 16 5 5" />
      </>
    ),
    chevron: <path d="m6 9 6 6 6-6" />,
    user: (
      <>
        <circle cx="12" cy="8" r="3" />
        <path d="M5 21v-2a7 7 0 0 1 14 0v2" />
      </>
    ),
    live: <circle cx="12" cy="12" r="4" fill="currentColor" stroke="none" />,
    refresh: (
      <>
        <path d="M20 7v5h-5" />
        <path d="M20 12a8 8 0 1 1-2.3-5.7L20 9" />
      </>
    ),
    video: (
      <>
        <rect x="3" y="6" width="13" height="12" rx="2" />
        <path d="m16 10 5-3v10l-5-3" />
      </>
    ),
    sidebar: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="1" />
        <path d="M15 3v18" />
      </>
    ),
    close: <path d="M18 6 6 18M6 6l12 12" />,
    edit: (
      <>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
      </>
    ),
    copy: (
      <>
        <rect x="9" y="9" width="12" height="12" rx="2" />
        <path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />
      </>
    ),
    upload: (
      <>
        <path d="M12 16V4" />
        <path d="m7 9 5-5 5 5" />
        <path d="M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5" />
      </>
    ),
    eye: (
      <>
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
    trash: (
      <>
        <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" />
      </>
    ),
    download: (
      <>
        <path d="M12 3v12" />
        <path d="m7 10 5 5 5-5" />
        <path d="M4 17v4h16v-4" />
      </>
    ),
    checkCircle: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m8 12 3 3 5-6" />
      </>
    ),
  };

  return <svg {...common}>{icons[name]}</svg>;
};

const navigationGroups = [
  {
    label: "MY CARE",
    items: [
      { label: "Overview", icon: "overview", count: "10" },
      { label: "Appointments", icon: "calendar", active: true },
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

// Each item opens its patient-dashboard page (see navigation.js).
// onNavigate(label, proceed) lets a page intercept that, e.g. to confirm
// unsaved changes; it must call proceed() to continue.
export function Sidebar({ active = "Appointments", onNavigate }) {
  const [activeItem, setActiveItem] = useState(active);
  // Collapsed: icons only.
  const [collapsed, setCollapsed] = useState(false);
  const navigate = (label, proceed) => {
    const go = () => {
      proceed();
      if (label === "Signout") {
        signOut();
        navigateTo("LoginPage");
        return;
      }
      const page = patientPageFor(label);
      if (page) navigateTo(page);
    };
    return onNavigate ? onNavigate(label, go) : go();
  };

  return (
    <aside className={`pa-sidebar${collapsed ? " is-collapsed" : ""}`}>
      <div className="pa-sidebar-top">
        <div className="pa-sidebar-heading">
          <span className="pa-sidebar-brand">MY CARE</span>
          <button
            className="pa-sidebar-toggle"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!collapsed}
            onClick={() => setCollapsed(!collapsed)}
          >
            <Icon name="sidebar" size={17} />
          </button>
        </div>

        <nav className="pa-navigation">
          {navigationGroups.map((group, index) => (
            <div className="pa-nav-group" key={group.label}>
              {index > 0 && <p className="pa-nav-heading">{group.label}</p>}

              <div className="pa-nav-items">
                {group.items.map((item) => (
                  <button
                    key={item.label}
                    className={`pa-nav-item ${
                      activeItem === item.label ? "is-active" : ""
                    }`}
                    onClick={() =>
                      navigate(item.label, () => setActiveItem(item.label))
                    }
                  >
                    <span className="pa-nav-icon">
                      <Icon name={item.icon} size={20} />
                    </span>

                    <span>{item.label}</span>

                    {item.count && (
                      <span className="pa-nav-count">{item.count}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>

      <button
        className="pa-signout"
        onClick={() => navigate("Signout", () => {})}
      >
        <Icon name="signout" size={18} />
        <span>Signout</span>
      </button>
    </aside>
  );
}

export function ConsultationBanner({ onJoin }) {
  return (
    <section className="pa-consultation-banner">
      <div className="pa-doctor-info">
        <h2>Dr. A. Menon</h2>
        <p>Cardiology</p>
      </div>

      <div className="pa-video-info">
        <span className="pa-video-label">VIDEO CONSULTATION</span>
        <span className="pa-video-time">Today, 11:00 AM</span>
      </div>

      <div className="pa-banner-actions">
        <span className="pa-live-badge">
          <Icon name="live" size={10} />
          Live
        </span>

        <button className="pa-join-button" onClick={onJoin}>
          Join video call
        </button>
      </div>
    </section>
  );
}

export const APPOINTMENT_STATUS_OPTIONS = [
  { value: "All", label: "All" },
  { value: "Upcoming", label: "Upcoming" },
  { value: "Completed", label: "Completed" },
  { value: "Cancelled", label: "Cancelled by you" },
  { value: "Rescheduled", label: "Rescheduled" },
  { value: "Cancelled by hospital", label: "Cancelled by hospital" },
];

export const PATIENT_OPTIONS = [
  { value: "All", label: "All" },
  { value: "Me", label: "Me" },
  { value: "Family", label: "Family" },
];

export function AppointmentToolbar({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  patientFilter,
  setPatientFilter,
  activeTab,
  setActiveTab,
}) {
  return (
    <div className="pa-toolbar">
      <label className="pa-search">
        <input
          type="text"
          placeholder="Search doctor or department"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          aria-label="Search doctor or department"
        />
        <Icon name="search" size={21} />
      </label>

      <div className="pa-toolbar-right">
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
        />

        <div className="pa-tabs">
          <button
            className={activeTab === "Upcoming" ? "is-active" : ""}
            onClick={() => setActiveTab("Upcoming")}
          >
            Upcoming
          </button>

          <button
            className={activeTab === "Past" ? "is-active" : ""}
            onClick={() => setActiveTab("Past")}
          >
            Past
          </button>
        </div>
      </div>
    </div>
  );
}

export function StatusBadge({ status }) {
  const statusClass = status.toLowerCase().replaceAll(" ", "-");

  return (
    <span className={`pa-status pa-status--${statusClass}`}>
      {status === "Upcoming" && <Icon name="calendar" size={13} />}

      {status === "Completed" && <Icon name="live" size={10} />}

      {status === "Rescheduled" && <Icon name="refresh" size={13} />}

      <span>{status}</span>
    </span>
  );
}

export function AppointmentTable({ appointments, onAction, typeLabel = "CONSULTATION" }) {
  return (
    <div className="pa-table-wrapper">
      <table className="pa-table">
        <thead>
          <tr>
            <th>DOCTOR</th>
            <th>{typeLabel}</th>
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

                  <span className="pa-patient-relation">
                    <Icon name="user" size={11} />
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
                  {appointment.action}
                </button>
              </td>
            </tr>
          ))}

          {appointments.length === 0 && (
            <tr>
              <td colSpan="6" className="pa-empty-state">
                No appointments found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default function PatientAppointments() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [patientFilter, setPatientFilter] = useState("All");
  const [activeTab, setActiveTab] = useState("Upcoming");

  const filteredAppointments = appointmentsData.filter((appointment) => {
    const query = search.trim().toLowerCase();

    const matchesSearch =
      appointment.doctor.toLowerCase().includes(query) ||
      appointment.department.toLowerCase().includes(query) ||
      appointment.patient.toLowerCase().includes(query);

    const matchesStatus =
      statusFilter === "All" || appointment.status === statusFilter;

    const matchesPatient =
      patientFilter === "All" || appointment.relation === patientFilter;

    const matchesTab = appointment.period === activeTab;

    return matchesSearch && matchesStatus && matchesPatient && matchesTab;
  });

  const handleAppointmentAction = (appointment) => {
    if (appointment.action === "View prescription") {
      alert(`Opening prescription for ${appointment.patient}`);
      return;
    }

    alert(`Managing appointment #${appointment.id}`);
  };

  return (
    <>
      <Navbar />
      <div className="patient-appointments">
        <Sidebar />

        <main className="pa-main">
          <ConsultationBanner />

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
            appointments={filteredAppointments}
            onAction={handleAppointmentAction}
          />
        </main>
      </div>
      <Footer />
    </>
  );
}
