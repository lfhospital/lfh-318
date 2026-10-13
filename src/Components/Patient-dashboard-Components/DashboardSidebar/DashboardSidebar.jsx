import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  Calendar,
  FileText,
  Activity,
  CreditCard,
  Users,
  Settings,
  SquareCheckBig,
  Share,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import "./DashboardSidebar.css";
import { clearPatientSession } from "../../../utils/patientSession";
import { clearAppointmentsCache } from "../appointments";

const sections = [
  { title: "Main", items: [{ label: "Overview", icon: LayoutGrid, to: "/dashboard" }] },
  {
    title: "My Care",
    items: [
      { label: "Appointments", icon: Calendar, to: "/dashboard/appointments" },
      { label: "Prescriptions", icon: FileText, to: "/dashboard/prescriptions" },
      { label: "Reports", icon: Activity },
      { label: "Second opinion", icon: SquareCheckBig },
    ],
  },
  {
    title: "Account",
    items: [
      { label: "Payments", icon: CreditCard },
      { label: "Family Members", icon: Users },
      { label: "Profile & Settings", icon: Settings },
    ],
  },
];

export default function DashboardSidebar({ active = "Overview" }) {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleSignout = () => {
    clearPatientSession();
    clearAppointmentsCache();
    navigate("/login");
  };

  const ToggleIcon = collapsed ? PanelLeftOpen : PanelLeftClose;

  return (
    <aside className={`dash-sidebar ${collapsed ? "collapsed" : ""}`}>
      <button
        type="button"
        className="dash-sidebar-toggle"
        onClick={() => setCollapsed(!collapsed)}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <ToggleIcon size={20} strokeWidth={1.5} />
      </button>

      <nav className="dash-sidebar-inner">
        <div className="dash-sidebar-sections">
          {sections.map((section) => (
            <div className="dash-sidebar-section" key={section.title}>
              <p className="dash-sidebar-heading">{section.title}</p>
              <ul>
                {section.items.map(({ label, icon: Icon, to }) => (
                  <li key={label}>
                    {/* Items without a page yet stay inert */}
                    <Link
                      to={to || "#"}
                      className={`dash-sidebar-item ${active === label ? "active" : ""}`}
                      onClick={to ? undefined : (e) => e.preventDefault()}
                      aria-current={active === label ? "page" : undefined}
                      title={collapsed ? label : undefined}
                    >
                      <Icon size={20} strokeWidth={1.5} />
                      <span>{label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="dash-sidebar-signout"
          onClick={handleSignout}
          title={collapsed ? "Signout" : undefined}
        >
          <Share size={20} strokeWidth={1.5} className="dash-signout-icon" />
          <span>Signout</span>
        </button>
      </nav>
    </aside>
  );
}
