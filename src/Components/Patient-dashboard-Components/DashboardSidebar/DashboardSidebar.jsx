import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  Calendar,
  FileText,
  Activity,
  CreditCard,
  Users,
  Settings,
  Share,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import "./DashboardSidebar.css";
import { clearPatientSession } from "../../../utils/patientSession";

const sections = [
  { title: "Main", items: [{ label: "Overview", icon: LayoutGrid }] },
  {
    title: "My Care",
    items: [
      { label: "Appointments", icon: Calendar },
      { label: "Prescriptions", icon: FileText },
      { label: "Reports", icon: Activity },
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
                {section.items.map(({ label, icon: Icon }) => (
                  <li key={label}>
                    <a
                      href="#"
                      className={`dash-sidebar-item ${active === label ? "active" : ""}`}
                      onClick={(e) => e.preventDefault()}
                      title={collapsed ? label : undefined}
                    >
                      <Icon size={20} strokeWidth={1.5} />
                      <span>{label}</span>
                    </a>
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
