import React, { useRef, useState } from "react";
import "./ProfileSettings.css";
import Navbar from "../../Home-page-Components/Navbar/Navbar";
import Footer from "../../Home-page-Components/Footer/HomeFooter";
import { signOut } from "../../../auth";
import { navigateTo, patientPageFor } from "../../../navigation";

const initialProfile = {
  firstName: "Rohan",
  middleName: "",
  lastName: "Iyer",
  dob: "14 / 03 / 1989",
  gender: "Male",
  bloodGroup: "O+",
  mobile: "+91 98765 43210",
  email: "rohan.iyer@email.com",
  address: "14, Ring Road, Vijayawada 520008",
};

const initialPreferences = {
  appointments: true,
  reports: true,
  offers: false,
};

function Icon({ name, size = 18 }) {
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
    reports: <path d="M2 12h5l3-9 5 18 3-9h4" />,
    check: (
      <>
        <rect x="4" y="4" width="16" height="16" rx="1.5" />
        <path d="m8 12 3 3 9-10" />
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
    upload: (
      <>
        <path d="M12 16V4m-5 5 5-5 5 5" />
        <path d="M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5" />
      </>
    ),
    trash: (
      <>
        <path d="M3 6h18M8 6V4h8v2m3 0-1 14H6L5 6" />
        <path d="M10 10v6m4-6v6" />
      </>
    ),
    copy: (
      <>
        <rect x="8" y="8" width="12" height="12" rx="1.5" />
        <path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" />
      </>
    ),
    chevron: <path d="m6 9 6 6 6-6" />,
  };

  return <svg {...common}>{icons[name]}</svg>;
}

/* ---------------- Sidebar ---------------- */

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
  const [activeItem, setActiveItem] = useState("Profile & Settings");
  // Collapsed: icons only.
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`ps-sidebar${collapsed ? " is-collapsed" : ""}`}>
      <div>
        <div className="ps-sidebar-heading">
          <span className="ps-brand">MY CARE</span>

          <button
            className="ps-sidebar-toggle"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!collapsed}
            onClick={() => setCollapsed(!collapsed)}
          >
            <Icon name="sidebar" size={15} />
          </button>
        </div>

        <nav className="ps-navigation">
          {navigationGroups.map((group) => (
            <div className="ps-nav-group" key={group.label}>
              <div className="ps-nav-items">
                {group.items.map((item) => (
                  <button
                    key={item.label}
                    className={`ps-nav-item ${
                      activeItem === item.label ? "is-active" : ""
                    }`}
                    onClick={() => {
                      setActiveItem(item.label);
                      const page = patientPageFor(item.label);
                      if (page) navigateTo(page);
                    }}
                  >
                    <span className="ps-nav-icon">
                      <Icon name={item.icon} size={17} />
                    </span>

                    <span>{item.label}</span>

                    {item.count && (
                      <span className="ps-nav-count">{item.count}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>

      <button
        className="ps-signout"
        onClick={() => {
          signOut();
          navigateTo("LoginPage");
        }}
      >
        <Icon name="signout" size={15} />
        <span>Signout</span>
      </button>
    </aside>
  );
}

/* ---------------- Reusable form field ---------------- */

function FormField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  options,
  className = "",
}) {
  return (
    <label className={`ps-field ${className}`}>
      <span className="ps-field-label">{label}</span>

      {options ? (
        <div className="ps-select-box">
          <select value={value} onChange={onChange}>
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <Icon name="chevron" size={14} />
        </div>
      ) : (
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
        />
      )}
    </label>
  );
}

/* ---------------- Verification field ---------------- */

function VerificationField({ label, value, onChange, onVerify, helpText }) {
  return (
    <div className="ps-verification-field">
      <div className="ps-verification-heading">
        <span className="ps-field-label">{label}</span>

        <span className="ps-pending-badge">
          <span />
          Pending
        </span>
      </div>

      <div className="ps-verification-input">
        <input value={value} onChange={onChange} />

        <button onClick={onVerify}>Verify</button>
      </div>

      <p className="ps-help-text">{helpText}</p>
    </div>
  );
}

/* ---------------- Toggle switch ---------------- */

function ToggleSwitch({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={`ps-toggle ${checked ? "is-on" : ""}`}
      onClick={() => onChange(!checked)}
    >
      <span />
    </button>
  );
}

/* ---------------- Main component ---------------- */

export default function ProfileSettings() {
  const [profile, setProfile] = useState(initialProfile);
  const [savedProfile, setSavedProfile] = useState(initialProfile);

  const [preferences, setPreferences] = useState(initialPreferences);
  const [savedPreferences, setSavedPreferences] = useState(initialPreferences);

  const [photo, setPhoto] = useState(null);
  const [message, setMessage] = useState("");
  const fileInputRef = useRef(null);

  const updateField = (field, value) => {
    setProfile((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const updatePreference = (field, value) => {
    setPreferences((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setMessage("Please select a PNG or JPEG image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage("The image must be smaller than 5 MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setPhoto(reader.result);
      setMessage("");
    };

    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const handleSave = () => {
    setSavedProfile({ ...profile });
    setSavedPreferences({ ...preferences });
    setMessage("Changes saved successfully.");
  };

  const handleDiscard = () => {
    setProfile({ ...savedProfile });
    setPreferences({ ...savedPreferences });
    setMessage("Unsaved changes discarded.");
  };

  const handleVerify = (type) => {
    setMessage(
      `${type} verification requires integration with your verification service.`,
    );
  };

  const handleDeactivate = () => {
    const confirmed = window.confirm(
      "Are you sure you want to deactivate your account?",
    );

    if (confirmed) {
      setMessage("Account deactivation must be completed by your application.");
    }
  };

  const handleCopyPatientId = async () => {
    try {
      await navigator.clipboard.writeText("LFH-P-88421");
      setMessage("Patient ID copied.");
    } catch {
      setMessage("Unable to copy the Patient ID.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="profile-settings">
        <Sidebar />

        <main className="ps-main">
          <header className="ps-page-header">
            <div>
              <h1>Profile &amp; settings</h1>
              <p>Your details, contact info and preferences</p>
            </div>

            <button
              className="ps-patient-id"
              onClick={handleCopyPatientId}
              title="Copy patient ID"
            >
              <span className="ps-patient-id-label">PATIENT ID</span>

              <span className="ps-patient-id-value">
                LFH-P-88421
                <Icon name="copy" size={13} />
              </span>
            </button>
          </header>

          {/* Personal information */}

          <section className="ps-section ps-personal-section">
            <h2 className="ps-section-title">Personal information</h2>

            <div className="ps-picture-section">
              <span className="ps-field-label">PICTURE</span>

              <div className="ps-picture-row">
                <div className="ps-avatar">
                  {photo ? (
                    <img src={photo} alt="Profile" />
                  ) : (
                    <div className="ps-avatar-placeholder">
                      <span>R</span>
                    </div>
                  )}
                </div>

                <div className="ps-picture-controls">
                  <div className="ps-picture-buttons">
                    <button
                      className="ps-upload-button"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Icon name="upload" size={14} />
                      Upload
                    </button>

                    <button
                      className="ps-delete-button"
                      aria-label="Delete profile picture"
                      onClick={() => setPhoto(null)}
                    >
                      <Icon name="trash" size={14} />
                    </button>
                  </div>

                  <p>We support PNG/ JPEG formats (max size 5 MB)</p>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg"
                  hidden
                  onChange={handlePhotoUpload}
                />
              </div>
            </div>

            <div className="ps-personal-grid">
              <FormField
                label="FIRST NAME"
                value={profile.firstName}
                onChange={(e) => updateField("firstName", e.target.value)}
              />

              <FormField
                label="MIDDLE NAME"
                value={profile.middleName}
                placeholder="Optional"
                onChange={(e) => updateField("middleName", e.target.value)}
              />

              <FormField
                label="LAST NAME"
                value={profile.lastName}
                onChange={(e) => updateField("lastName", e.target.value)}
              />

              <FormField
                label="DATE OF BIRTH"
                value={profile.dob}
                onChange={(e) => updateField("dob", e.target.value)}
              />

              <FormField
                label="GENDER"
                value={profile.gender}
                options={["Male", "Female", "Other", "Prefer not to say"]}
                onChange={(e) => updateField("gender", e.target.value)}
              />

              <FormField
                label="BLOOD GROUP"
                value={profile.bloodGroup}
                options={["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"]}
                onChange={(e) => updateField("bloodGroup", e.target.value)}
              />
            </div>
          </section>

          {/* Contact details */}

          <section className="ps-section ps-contact-section">
            <h2 className="ps-section-title">Contact details</h2>

            <div className="ps-contact-grid">
              <VerificationField
                label="MOBILE NUMBER"
                value={profile.mobile}
                onChange={(e) => updateField("mobile", e.target.value)}
                onVerify={() => handleVerify("Mobile")}
                helpText="Reminders and OTPs pauses until you verify the number."
              />

              <VerificationField
                label="EMAIL ADDRESS"
                value={profile.email}
                onChange={(e) => updateField("email", e.target.value)}
                onVerify={() => handleVerify("Email")}
                helpText="Reports and receipts pause until you confirm the email address."
              />
            </div>

            <div className="ps-address-field">
              <FormField
                label="ADDRESS"
                value={profile.address}
                onChange={(e) => updateField("address", e.target.value)}
              />
            </div>
          </section>

          {/* Communication preferences */}

          <section className="ps-section ps-communication-section">
            <h2 className="ps-section-title">Communication preferences</h2>

            <div className="ps-preference-list">
              <div className="ps-preference-row">
                <div>
                  <h3>Appointment reminders</h3>
                  <p>SMS &amp; email, 2 hours before each visit</p>
                </div>

                <ToggleSwitch
                  label="Appointment reminders"
                  checked={preferences.appointments}
                  onChange={(value) => updatePreference("appointments", value)}
                />
              </div>

              <div className="ps-preference-row">
                <div>
                  <h3>Report &amp; prescription alerts</h3>
                  <p>Notify me when new documents are ready</p>
                </div>

                <ToggleSwitch
                  label="Report and prescription alerts"
                  checked={preferences.reports}
                  onChange={(value) => updatePreference("reports", value)}
                />
              </div>

              <div className="ps-preference-row">
                <div>
                  <h3>Health tips &amp; offers</h3>
                  <p>Occasional wellness content and package offers</p>
                </div>

                <ToggleSwitch
                  label="Health tips and offers"
                  checked={preferences.offers}
                  onChange={(value) => updatePreference("offers", value)}
                />
              </div>
            </div>
          </section>

          {/* Footer actions */}

          <footer className="ps-footer">
            <div className="ps-footer-left">
              <button className="ps-save-button" onClick={handleSave}>
                Save changes
              </button>

              <button className="ps-discard-button" onClick={handleDiscard}>
                Discard changes
              </button>
            </div>

            <button className="ps-deactivate-button" onClick={handleDeactivate}>
              Deactivate account
            </button>
          </footer>

          {message && (
            <div className="ps-feedback" role="status">
              <span>{message}</span>
              <button
                onClick={() => setMessage("")}
                aria-label="Dismiss message"
              >
                ×
              </button>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
}
