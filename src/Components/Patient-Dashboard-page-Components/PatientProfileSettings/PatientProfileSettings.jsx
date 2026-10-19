import React, { useCallback, useEffect, useRef, useState } from "react";
import "../PatientAppointments/PatientAppointments.css";
import "../Appointments/Appointments.css";
import "./PatientProfileSettings.css";
import Navbar from "../../Home-page-Components/Navbar/Navbar";
import Footer from "../../Home-page-Components/Footer/HomeFooter";
import { Icon, Sidebar } from "../PatientAppointments/PatientAppointments";
import { Modal, Toast } from "../Appointments/Appointments";
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";
import photo from "../../../asserts/doctor-profile.jpg";
import aphoto from "../../../asserts/doctor-profile.jpg";

const PATIENT_ID = "LFH-P-88421";
const GENDERS = ["Male", "Female", "Other", "Prefer not to say"];
const BLOOD_GROUPS = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];
const RESEND_SECONDS = 30;

const initialProfile = {
  firstName: "Rohan",
  middleName: "",
  lastName: "Iyer",
  dob: "1989-03-14",
  gender: "Male",
  bloodGroup: "O+",
  mobile: "+91 98765 43210",
  email: "rohan.iyer@email.com",
  address: "14, Ring Road, Vijayawada 520008",
  mobileVerified: false,
  emailVerified: false,
  photo: {photo},
};

const PREFERENCES = [
  {
    key: "appointments",
    title: "Appointment reminders",
    text: "SMS & email, 2 hours before each visit",
  },
  {
    key: "reports",
    title: "Report & prescription alerts",
    text: "Notify me when new documents are ready",
  },
  {
    key: "offers",
    title: "Health tips & offers",
    text: "Occasional wellness content and package offers",
  },
];

const initialPreferences = { appointments: true, reports: true, offers: false };

const today = () => new Date().toISOString().slice(0, 10);
const digits = (value) => value.replace(/\D/g, "");
const isValidMobile = (value) => /^(91)?[6-9]\d{9}$/.test(digits(value));
const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

const sameValues = (a, b) => JSON.stringify(a) === JSON.stringify(b);

function validate(profile) {
  const errors = {};
  if (!profile.firstName.trim()) errors.firstName = "First name is required.";
  if (!profile.lastName.trim()) errors.lastName = "Last name is required.";
  if (!profile.dob) errors.dob = "Date of birth is required.";
  else if (profile.dob > today()) errors.dob = "Date of birth can't be in the future.";
  if (!isValidMobile(profile.mobile)) errors.mobile = "Enter a valid 10-digit mobile number.";
  if (!isValidEmail(profile.email)) errors.email = "Enter a valid email address.";
  if (!profile.address.trim()) errors.address = "Address is required.";
  return errors;
}

/* Inputs */

function Field({ label, error, children, badge, help, className = "" }) {
  return (
    <label className={`pps-field ${className}`}>
      <span className="pps-label-row">
        <span className="pps-label">{label}</span>
        {badge}
      </span>
      {children}
      {error ? (
        <span className="pps-error">{error}</span>
      ) : (
        help && <span className="pps-help">{help}</span>
      )}
    </label>
  );
}

function SelectInput({ value, onChange, options }) {
  return (
    <span className="pps-select">
      <select value={value} onChange={onChange}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <Icon name="chevron" size={20} />
    </span>
  );
}

function StatusBadge({ verified }) {
  return (
    <span className={`pps-badge ${verified ? "is-verified" : ""}`}>
      <span className="pps-badge-dot" />
      {verified ? "Verified" : "Pending"}
    </span>
  );
}

function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={`pps-toggle ${checked ? "is-on" : ""}`}
      onClick={() => onChange(!checked)}
    >
      <span />
    </button>
  );
}

/* Profile picture */

const PHOTO_TYPES = ["image/png", "image/jpeg"];
const PHOTO_MAX_BYTES = 5 * 1024 * 1024;

function PictureField({ photo, initial, error, onChange, onError }) {
  const inputRef = useRef(null);

  const handleFile = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!PHOTO_TYPES.includes(file.type)) {
      onError("Please choose a PNG or JPEG image.");
      return;
    }
    if (file.size > PHOTO_MAX_BYTES) {
      onError("The image must be smaller than 5 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className="pps-picture">
      <span className="pps-label">Picture</span>
      <div className="pps-picture-row">
        <span className="pps-avatar">
          {photo ? (
            <img src={aphoto} alt="Your profile" />
          ) : (
            <span aria-hidden="true">{initial.toUpperCase()}</span>
          )}
        </span>
        <div className="pps-picture-controls">
          <div className="pps-picture-buttons">
            <button
              type="button"
              className="pps-upload"
              onClick={() => inputRef.current?.click()}
            >
              <Icon name="upload" size={14} />
              Upload
            </button>
            <button
              type="button"
              className="pps-photo-delete"
              onClick={() => onChange("")}
              disabled={!photo}
              aria-label="Remove profile picture"
              title="Remove picture"
            >
              <Icon name="trash" size={14} />
            </button>
          </div>
          {error ? (
            <span className="pps-error">{error}</span>
          ) : (
            <span className="pps-help">
              We support PNG/ JPEG formats (max size 5 MB)
            </span>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg"
          hidden
          onChange={handleFile}
        />
      </div>
    </div>
  );
}

/* OTP dialog */

function VerifyModal({ channel, target, onClose, onVerified }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [seconds, setSeconds] = useState(RESEND_SECONDS);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (seconds === 0) return undefined;
    const timer = setTimeout(() => setSeconds((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!/^\d{6}$/.test(code)) {
      setError("Enter the 6-digit code.");
      return;
    }
    onVerified();
  };

  return (
    <Modal
      title={channel === "mobile" ? "Verify mobile number" : "Verify email address"}
      onClose={onClose}
    >
      <form className="pps-otp" onSubmit={handleSubmit} noValidate>
        <p className="ap-modal-sub">
          We've sent a 6-digit code to <strong>{target}</strong>. It expires in
          10 minutes.
        </p>

        <input
          ref={inputRef}
          className="pps-otp-input"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          placeholder="••••••"
          value={code}
          onChange={(event) => {
            setCode(digits(event.target.value).slice(0, 6));
            setError("");
          }}
          aria-label="Verification code"
          aria-invalid={Boolean(error)}
        />
        {error && <span className="pps-error">{error}</span>}

        <p className="pps-resend">
          Didn't get it?{" "}
          {seconds > 0 ? (
            <span>Resend in {seconds}s</span>
          ) : (
            <button
              type="button"
              className="pa-action-link"
              onClick={() => {
                setSeconds(RESEND_SECONDS);
                setCode("");
              }}
            >
              Resend code
            </button>
          )}
        </p>

        <div className="ap-modal-actions">
          <button type="button" className="ap-outline-button" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="ap-primary-button">
            Verify
          </button>
        </div>
      </form>
    </Modal>
  );
}

/* Page */

export default function PatientProfileSettings() {
  const [saved, setSaved] = useState({
    profile: initialProfile,
    preferences: initialPreferences,
  });
  const [profile, setProfile] = useState(initialProfile);
  const [preferences, setPreferences] = useState(initialPreferences);
  const [errors, setErrors] = useState({});
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState("");
  const [deactivated, setDeactivated] = useState(false);

  const closeModal = useCallback(() => setModal(null), []);
  const closeToast = useCallback(() => setToast(""), []);

  const isDirty =
    !sameValues(profile, saved.profile) ||
    !sameValues(preferences, saved.preferences);

  // Warn before leaving the page with unsaved edits.
  useEffect(() => {
    if (!isDirty) return undefined;
    const warn = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [isDirty]);

  const update = (field) => (event) => {
    const { value } = event.target;
    setProfile((current) => {
      const next = { ...current, [field]: value };
      // Editing a verified contact means it has to be verified again.
      if (field === "mobile") {
        next.mobileVerified =
          digits(value) === digits(saved.profile.mobile) && saved.profile.mobileVerified;
      }
      if (field === "email") {
        next.emailVerified =
          value.trim() === saved.profile.email && saved.profile.emailVerified;
      }
      return next;
    });
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const startVerify = (channel) => {
    const value = channel === "mobile" ? profile.mobile : profile.email;
    const valid = channel === "mobile" ? isValidMobile(value) : isValidEmail(value);
    if (!valid) {
      setErrors((current) => ({
        ...current,
        [channel]:
          channel === "mobile"
            ? "Enter a valid 10-digit mobile number."
            : "Enter a valid email address.",
      }));
      return;
    }
    setModal({ type: "verify", channel, target: value.trim() });
  };

  const handleVerified = () => {
    const key = modal.channel === "mobile" ? "mobileVerified" : "emailVerified";
    // Verification applies to the value on screen, so store it as saved too.
    setProfile((current) => ({ ...current, [key]: true }));
    setSaved((current) => ({
      ...current,
      profile: {
        ...current.profile,
        [modal.channel]: profile[modal.channel],
        [key]: true,
      },
    }));
    setToast(
      modal.channel === "mobile" ? "Mobile number verified" : "Email address verified"
    );
    closeModal();
  };

  const handleSave = () => {
    const found = validate(profile);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setToast("Please fix the highlighted fields");
      return;
    }
    const cleaned = {
      ...profile,
      firstName: profile.firstName.trim(),
      middleName: profile.middleName.trim(),
      lastName: profile.lastName.trim(),
      email: profile.email.trim(),
      address: profile.address.trim(),
    };
    setProfile(cleaned);
    setSaved({ profile: cleaned, preferences });
    setToast("Saved changes");
  };

  const handleDiscard = () => {
    setProfile(saved.profile);
    setPreferences(saved.preferences);
    setErrors({});
    setToast("Changes discarded");
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(PATIENT_ID);
      setToast("Patient ID copied");
    } catch {
      setToast("Couldn't copy — select the ID to copy it manually");
    }
  };

  // Sidebar navigation: ask before leaving with unsaved edits.
  const handleNavigate = (label, proceed) => {
    if (!isDirty) {
      proceed();
      return;
    }
    setModal({ type: "leave", proceed });
  };

  const discardAndLeave = () => {
    const { proceed } = modal;
    setProfile(saved.profile);
    setPreferences(saved.preferences);
    setErrors({});
    closeModal();
    proceed();
  };

  const handleDeactivate = () => {
    setDeactivated(true);
    closeModal();
    setToast("Account deactivated");
  };

  return (
    <>
      <Navbar />
      <div className="patient-appointments ap-page pps-page">
        <Sidebar active="Profile & Settings" onNavigate={handleNavigate} />

        <main className="pa-main pps-main">
          <header className="pps-header">
            <div>
              <h1>Profile &amp; settings</h1>
              <p>Your details, contact info and preferences</p>
            </div>

            <div className="pps-patient-id">
              <div className="pps-patient-id-top">
                <span>Patient ID</span>
                <button
                  type="button"
                  onClick={handleCopy}
                  aria-label="Copy patient ID"
                  title="Copy patient ID"
                >
                  <Icon name="copy" size={16} />
                </button>
              </div>
              <strong>{PATIENT_ID}</strong>
            </div>
          </header>

          {deactivated && (
            <p className="pps-notice" role="status">
              Your account is deactivated. You can undo this within 30 days by
              signing back in. After that, your data will be permanently
              deleted.
            </p>
          )}

          <section className="pps-section">
            <h2>Personal information</h2>
            <PictureField
              photo={profile.photo}
              initial={profile.firstName.trim()[0] || "?"}
              error={errors.photo}
              onChange={(photo) => {
                setProfile((current) => ({ ...current, photo }));
                setErrors((current) => ({ ...current, photo: undefined }));
              }}
              onError={(message) =>
                setErrors((current) => ({ ...current, photo: message }))
              }
            />
            <div className="pps-grid pps-grid--3">
              <Field label="First name" error={errors.firstName}>
                <input
                  value={profile.firstName}
                  onChange={update("firstName")}
                  aria-invalid={Boolean(errors.firstName)}
                />
              </Field>
              <Field label="Middle name">
                <input
                  value={profile.middleName}
                  placeholder="Optional"
                  onChange={update("middleName")}
                />
              </Field>
              <Field label="Last name" error={errors.lastName}>
                <input
                  value={profile.lastName}
                  onChange={update("lastName")}
                  aria-invalid={Boolean(errors.lastName)}
                />
              </Field>
              <Field label="Date of birth" error={errors.dob}>
                <input
                  type="date"
                  value={profile.dob}
                  max={today()}
                  onChange={update("dob")}
                  aria-invalid={Boolean(errors.dob)}
                />
              </Field>
              <Field label="Gender">
                <SelectInput
                  value={profile.gender}
                  onChange={update("gender")}
                  options={GENDERS}
                />
              </Field>
              <Field label="Blood group">
                <SelectInput
                  value={profile.bloodGroup}
                  onChange={update("bloodGroup")}
                  options={BLOOD_GROUPS}
                />
              </Field>
            </div>
          </section>

          <section className="pps-section">
            <h2>Contact details</h2>
            <div className="pps-grid pps-grid--2">
              <Field
                label="Mobile number"
                badge={<StatusBadge verified={profile.mobileVerified} />}
                error={errors.mobile}
                help={
                  profile.mobileVerified
                    ? "You'll get reminders and OTPs on this number."
                    : "Reminders and OTPs pause until you verify the number."
                }
              >
                <span className="pps-verify-input">
                  <input
                    type="tel"
                    value={profile.mobile}
                    onChange={update("mobile")}
                    aria-invalid={Boolean(errors.mobile)}
                  />
                  {!profile.mobileVerified && (
                    <button
                      type="button"
                      className="pps-link"
                      onClick={() => startVerify("mobile")}
                    >
                      Verify
                    </button>
                  )}
                </span>
              </Field>

              <Field
                label="Email address"
                badge={<StatusBadge verified={profile.emailVerified} />}
                error={errors.email}
                help={
                  profile.emailVerified
                    ? "Reports and receipts are sent to this address."
                    : "Reports and receipts pause until you confirm the email address."
                }
              >
                <span className="pps-verify-input">
                  <input
                    type="email"
                    value={profile.email}
                    onChange={update("email")}
                    aria-invalid={Boolean(errors.email)}
                  />
                  {!profile.emailVerified && (
                    <button
                      type="button"
                      className="pps-link"
                      onClick={() => startVerify("email")}
                    >
                      Verify
                    </button>
                  )}
                </span>
              </Field>

              <Field label="Address" error={errors.address} className="pps-span-all">
                <input
                  value={profile.address}
                  onChange={update("address")}
                  aria-invalid={Boolean(errors.address)}
                />
              </Field>
            </div>
          </section>

          <section className="pps-section">
            <h2>Communication preferences</h2>
            <div className="pps-preferences">
              {PREFERENCES.map((item) => (
                <div className="pps-preference" key={item.key}>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                  <Toggle
                    label={item.title}
                    checked={preferences[item.key]}
                    onChange={(value) =>
                      setPreferences((current) => ({ ...current, [item.key]: value }))
                    }
                  />
                </div>
              ))}
            </div>
          </section>

          <footer className="pps-footer">
            <div className="pps-footer-left">
              <button
                type="button"
                className="pps-save"
                onClick={handleSave}
                disabled={!isDirty}
              >
                Save changes
              </button>
              <button
                type="button"
                className="pps-link pps-link--dark"
                onClick={handleDiscard}
                disabled={!isDirty}
              >
                Discard changes
              </button>
            </div>

            <button
              type="button"
              className="pps-link pps-link--danger"
              onClick={() => setModal({ type: "deactivate" })}
              disabled={deactivated}
            >
              {deactivated ? "Account deactivated" : "Deactivate account"}
            </button>
          </footer>
        </main>

        {modal?.type === "verify" && (
          <VerifyModal
            channel={modal.channel}
            target={modal.target}
            onClose={closeModal}
            onVerified={handleVerified}
          />
        )}

        {modal?.type === "deactivate" && (
          <ConfirmDialog
            title="Deactivate your account?"
            subtitle="You'll lose access to your appointments, reports and prescriptions."
            secondaryLabel="Cancel"
            primaryLabel="Deactivate"
            onSecondary={closeModal}
            onPrimary={handleDeactivate}
            onClose={closeModal}
          >
            <p>
              This can be undone within 30 days by signing back in. After that,
              your data will be permanently deleted.
            </p>
          </ConfirmDialog>
        )}

        {modal?.type === "leave" && (
          <ConfirmDialog
            title="Discard unsaved changes?"
            subtitle="You have unsaved changes. If you leave now, your changes won't be saved."
            secondaryLabel="Discard changes"
            primaryLabel="Keep editing"
            onSecondary={discardAndLeave}
            onPrimary={closeModal}
            onClose={closeModal}
            width={30.125}
          />
        )}

        <Toast message={toast} onClose={closeToast} />
      </div>
      <Footer />
    </>
  );
}
