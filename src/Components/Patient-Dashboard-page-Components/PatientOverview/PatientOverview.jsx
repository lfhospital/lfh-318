import { useState } from "react";
import {
  LayoutGrid,
  Calendar,
  FileText,
  Activity,
  CreditCard,
  Users,
  Settings,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
} from "lucide-react";
import "./PatientOverview.css";
import Navbar from "../../Home-page-Components/Navbar/Navbar";
import Footer from "../../Home-page-Components/Footer/HomeFooter";
import { getUser, signOut } from "../../../auth";
import { navigateTo, patientPageFor } from "../../../navigation";
import "../PatientAppointments/PatientAppointments.css";
import "../Appointments/Appointments.css";
import {
  AppointmentTable,
  Icon,
  Sidebar,
} from "../PatientAppointments/PatientAppointments";
import NotificationBell, {
  sampleNotifications,
} from "../NotificationBell/NotificationBell";

// Each item opens its page via patientPageFor(label) (see navigation.js).
const NAV_GROUPS = [
  {
    label: "Main",
    items: [{ id: "overview", label: "Overview", icon: LayoutGrid }],
  },
  {
    label: "My Care",
    items: [
      { id: "appointments", label: "Appointments", icon: Calendar },
      { id: "prescriptions", label: "Prescriptions", icon: FileText },
      { id: "reports", label: "Reports", icon: Activity },
    ],
  },
  {
    label: "Account",
    items: [
      { id: "payments", label: "Payments", icon: CreditCard },
      { id: "family", label: "Family Members", icon: Users },
      { id: "settings", label: "Profile & Settings", icon: Settings },
    ],
  },
];

const LABEL_BY_ID = Object.fromEntries(
  NAV_GROUPS.flatMap((group) => group.items).map((item) => [item.id, item.label])
);

const greetingFor = (date) => {
  const hour = date.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

const goTo = (page) => page && navigateTo(page);

// Returning patient's "Upcoming & recent" list (sample data).
export const sampleOverviewAppointments = [
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
    department: "Cardiology",
    consultation: "Video",
    date: "2 May 2026",
    time: "5:30 PM",
    patient: "Shreya Iyer",
    relation: "Family",
    status: "Cancelled by hospital",
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
  },
];

// Where each row's action leads.
const overviewAction = (appointment) => {
  if (appointment.status === "Completed") {
    return { label: "View prescription", page: "PrescriptionsList" };
  }
  if (appointment.status === "Cancelled by hospital") {
    return { label: "Manage", page: "CancelledByHospital" };
  }
  return { label: "Manage", page: "Appointments" };
};

function ReturningOverview({ firstName, greeting, appointments, notifications }) {
  const [search, setSearch] = useState("");
  const query = search.trim().toLowerCase();
  const rows = appointments
    .filter(
      (item) =>
        !query ||
        [item.doctor, item.department, item.patient, item.consultation, item.status]
          .some((value) => value.toLowerCase().includes(query))
    )
    .map((item) => ({ ...item, action: overviewAction(item).label }));

  return (
    <>
      <Navbar />
      <div className="patient-appointments ap-page ov-page">
        <Sidebar active="Overview" />

        <main className="pa-main ov-main">
          <header className="ov-header">
            <h1 className="ov-greeting">
              {greeting}, {firstName}.
            </h1>
            <NotificationBell initialNotifications={notifications} />
          </header>

          <label className="pa-search ov-search">
            <input
              type="text"
              placeholder="Search for appointments, reports, prescriptions..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search for appointments, reports, prescriptions"
            />
            <Icon name="search" size={20} />
          </label>

          <section className="ov-section" aria-labelledby="ov-recent">
            <h2 className="ov-section-title" id="ov-recent">
              Upcoming &amp; recent
            </h2>
            {rows.length > 0 ? (
              <AppointmentTable
                appointments={rows}
                typeLabel="APPOINTMENT TYPE"
                onAction={(item) => navigateTo(overviewAction(item).page)}
              />
            ) : (
              <p className="ov-empty">No appointments match “{search}”.</p>
            )}
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
}

// appointments: pass the patient's visits to show the returning-patient
// dashboard; without them the new-patient "set up your care" view shows.
export default function PatientOverview({
  patientName,
  patientId,
  greeting,
  showPatientId,
  appointments,
  notifications = sampleNotifications,
  onNavigate = (id) => goTo(patientPageFor(LABEL_BY_ID[id])),
  onBookVisit = () => goTo("allDoctors"),
  onAddFamilyMember = () => goTo("FamilyMembers"),
  onSignOut = () => {
    signOut();
    goTo("LoginPage");
  },
  onToggleSidebar = () => {},
}) {
  const user = getUser();
  const firstName = patientName || user?.firstName || "Rohan";
  const id = patientId || user?.patientId || "LFH-P-88421";
  // A freshly created account shows its new Patient ID (sign-up design).
  const showId = showPatientId ?? Boolean(user?.isNew);
  const hello = greeting || greetingFor(new Date());

  const [active, setActive] = useState("overview");
  const [collapsed, setCollapsed] = useState(false);

  if (appointments?.length) {
    return (
      <ReturningOverview
        firstName={firstName}
        greeting={hello}
        appointments={appointments}
        notifications={notifications}
      />
    );
  }

  const handleNav = (id) => {
    setActive(id);
    onNavigate(id);
  };

  const toggleSidebar = () => {
    setCollapsed((value) => !value);
    onToggleSidebar(!collapsed);
  };

  const CollapseIcon = collapsed ? PanelLeftOpen : PanelLeftClose;

  return (
    <>
      <Navbar />
      <div className="patientdashboard">
        {/* ---------- Sidebar ---------- */}
        <aside
          className={`patientdashboard-sidebar${collapsed ? " is-collapsed" : ""}`}
          aria-label="Patient portal"
        >
          <button
            type="button"
            className="patientdashboard-sidebar__collapse"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!collapsed}
            onClick={toggleSidebar}
          >
            <CollapseIcon size={20} strokeWidth={1.5} />
          </button>

          <div className="patientdashboard-sidebar__inner">
            <nav className="patientdashboard-nav">
              {NAV_GROUPS.map((group) => (
                <div className="patientdashboard-nav__group" key={group.label}>
                  <p className="patientdashboard-nav__label">{group.label}</p>
                  <ul className="patientdashboard-nav__list">
                    {group.items.map(({ id, label, icon: Icon }) => (
                      <li key={id}>
                        <button
                          type="button"
                          className={`patientdashboard-nav__item${active === id ? " is-active" : ""}`}
                          aria-current={active === id ? "page" : undefined}
                          aria-label={collapsed ? label : undefined}
                          title={collapsed ? label : undefined}
                          onClick={() => handleNav(id)}
                        >
                          <Icon
                            className="patientdashboard-nav__icon"
                            strokeWidth={1.5}
                            aria-hidden="true"
                          />
                          <span className="patientdashboard-nav__text">{label}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>

            <button
              type="button"
              className="patientdashboard-signout"
              aria-label={collapsed ? "Signout" : undefined}
              title={collapsed ? "Signout" : undefined}
              onClick={onSignOut}
            >
              <LogOut size={20} strokeWidth={1.5} aria-hidden="true" />
              <span className="patientdashboard-nav__text">Signout</span>
            </button>
          </div>
        </aside>

        {/* ---------- Main content ---------- */}
        <main className="patientdashboard-main">
          <header className="patientdashboard-greeting">
            <h1 className="patientdashboard-greeting__title">
              {hello}, {firstName}.
            </h1>
            {showId && (
              <p className="patientdashboard-greeting__meta">Patient ID · {id}</p>
            )}
          </header>

          <section
            className="patientdashboard-setup"
            aria-labelledby="patientdashboard-setup-title"
          >
            <div className="patientdashboard-setup__body">
              <div className="patientdashboard-setup__head">
                <h2
                  className="patientdashboard-setup__title"
                  id="patientdashboard-setup-title"
                >
                  Let&apos;s set up your care.
                </h2>
                <p className="patientdashboard-setup__subtitle">
                  Complete these steps to get the most from your portal.
                </p>
              </div>

              <button
                type="button"
                className="patientdashboard-step"
                onClick={onBookVisit}
              >
                <span className="patientdashboard-step__icon">
                  <Plus size={18} strokeWidth={1.5} aria-hidden="true" />
                </span>
                <span className="patientdashboard-step__text">
                  <span className="patientdashboard-step__title">
                    Book your first visit
                  </span>
                  <span className="patientdashboard-step__desc">
                    Find a specialist and reserve a slot
                  </span>
                </span>
              </button>

              <button
                type="button"
                className="patientdashboard-link"
                onClick={onAddFamilyMember}
              >
                <span className="patientdashboard-link__label">
                  Add family member
                </span>
              </button>
            </div>

            <p className="patientdashboard-setup__hint">
              Your visits, report and prescriptions will appear here once
              you&apos;ve booked an appointment
            </p>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
}
