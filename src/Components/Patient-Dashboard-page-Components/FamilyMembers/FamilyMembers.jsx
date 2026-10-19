import React, { useCallback, useEffect, useState } from "react";
import "../PatientAppointments/PatientAppointments.css";
import "../AppointmentsEmpty/AppointmentsEmpty.css";
import "../Appointments/Appointments.css";
import "../Prescriptions/Prescriptions.css";
import "./FamilyMembers.css";
import Navbar from "../../Home-page-Components/Navbar/Navbar";
import Footer from "../../Home-page-Components/Footer/HomeFooter";
import { Icon, Sidebar } from "../PatientAppointments/PatientAppointments";
import { Toast } from "../Appointments/Appointments";
import { navigateTo } from "../../../navigation";
import { formatShortDate } from "../../../dates";

const RELATIONSHIPS = [
  "Wife",
  "Husband",
  "Spouse",
  "Father",
  "Mother",
  "Son",
  "Daughter",
  "Brother",
  "Sister",
  "Grandparent",
  "Other",
];
const GENDERS = ["Female", "Male", "Other"];

// A consent link sent by SMS stays valid this long.
const INVITE_DAYS = 7;

const EMPTY_FORM = {
  name: "",
  relationship: "",
  dob: "",
  gender: "",
  phone: "",
  recordAccess: true,
};

// Member shape:
//   status  "active" | "pending" (adult who hasn't approved the SMS link yet) | "archived"
//   access  "full" | "book" (can book, can't see records) | "requested" (record access asked for)
//   archived members also carry `was` ("pending" | "Dependent") and `archivedNote`.

// Account holder + family (sample data for the populated design).
export const sampleFamilyMembers = [
  {
    id: 1,
    name: "Rohan Iyer",
    relationship: "Self",
    dob: "1989-03-14",
    gender: "Male",
    phone: "9876543210",
    status: "active",
    access: "full",
  },
  {
    id: 2,
    name: "Shreya Iyer",
    relationship: "Wife",
    dob: "1989-06-28",
    gender: "Female",
    phone: "9876500210",
    status: "active",
    access: "full",
  },
  {
    id: 3,
    name: "Sharan Iyer",
    relationship: "Son",
    dob: "2017-09-22",
    gender: "Male",
    phone: "",
    status: "active",
    access: "full",
  },
  {
    id: 4,
    name: "Meena Iyer",
    relationship: "Sister",
    dob: "1994-03-14",
    gender: "Female",
    phone: "9876511122",
    status: "archived",
    access: "full",
    was: "pending",
    archivedNote: "Access revoked",
  },
  {
    id: 5,
    name: "Kiran Iyer",
    relationship: "Brother",
    dob: "1989-06-28",
    gender: "Male",
    phone: "9876533344",
    status: "archived",
    access: "full",
    was: "pending",
    archivedNote: "SMS consent link expired",
  },
];

const withShreya = (changes) =>
  sampleFamilyMembers.map((member) =>
    member.id === 2 ? { ...member, ...changes } : member
  );

// Shreya hasn't approved her consent link yet.
export const samplePendingFamilyMembers = withShreya({
  status: "pending",
  invitedAt: new Date().toISOString().slice(0, 10),
});

// Shreya shares bookings only, so her records can be requested.
export const sampleBookOnlyFamilyMembers = withShreya({ access: "book" });

const today = () => new Date().toISOString().slice(0, 10);

const formatDob = (dob) => formatShortDate(new Date(`${dob}T00:00:00`));

const ageFrom = (dob) => {
  const birth = new Date(`${dob}T00:00:00`);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const beforeBirthday =
    now.getMonth() < birth.getMonth() ||
    (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate());
  return beforeBirthday ? age - 1 : age;
};

const isAdult = (member) => Boolean(member.dob) && ageFrom(member.dob) >= 18;

const firstName = (name) => name.split(" ")[0];

const pronouns = (gender) =>
  gender === "Female"
    ? { subject: "she", object: "her", possessive: "her" }
    : gender === "Male"
      ? { subject: "he", object: "him", possessive: "his" }
      : { subject: "they", object: "them", possessive: "their" };

const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

// "+91 ••••• •210": enough to recognise the number without exposing it.
const maskPhone = (phone) => `+91 ••••• •${phone.slice(-3)}`;

// Keeps the 10-digit mobile number from "+91 98765 43210" style input.
const normalisePhone = (phone) => {
  const digits = phone.replace(/\D/g, "");
  return digits.length === 12 && digits.startsWith("91") ? digits.slice(2) : digits;
};

const daysSinceInvite = (member) => {
  const sent = member.invitedAt ? new Date(`${member.invitedAt}T00:00:00`) : new Date();
  return Math.max(0, Math.floor((Date.now() - sent.getTime()) / 86400000));
};

const expiresIn = (member) => {
  const left = Math.max(0, INVITE_DAYS - daysSinceInvite(member));
  return `expires in ${left} day${left === 1 ? "" : "s"}`;
};

const inviteStatus = (member) => {
  const since = daysSinceInvite(member);
  const sentLabel = since === 0 ? "today" : since === 1 ? "yesterday" : `${since} days ago`;
  return `Link sent ${sentLabel} · ${expiresIn(member)}`;
};

// "Record access" column: what the account holder can see for this person, and why.
const recordAccess = (member) => {
  if (member.relationship === "Self") return ["Full access", "Self records"];
  if (member.status === "pending") return ["Pending", inviteStatus(member)];
  if (member.access === "book") return ["Book only", null];
  if (member.access === "requested") return ["Pending", "Record access requested"];
  if (!isAdult(member)) return ["Full access", "No consent needed (minor)"];
  return ["Full access", `Shared by ${firstName(member.name)}`];
};

function validate(form) {
  const errors = {};
  if (form.name.trim().length < 2) errors.name = "Enter the member's full name.";
  if (!form.relationship) errors.relationship = "Choose a relation.";
  if (!form.gender) errors.gender = "Choose a gender.";
  if (!form.dob) errors.dob = "Enter a date of birth.";
  else if (form.dob > today()) errors.dob = "Date of birth can't be in the future.";
  // Adults approve the link themselves, so they need a number to receive it.
  if (isAdult(form) && !/^[6-9]\d{9}$/.test(normalisePhone(form.phone))) {
    errors.phone = "Enter a valid 10-digit mobile number.";
  }
  return errors;
}

/* Small pieces */

const BackArrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);

const Clock = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

function Switch({ checked, onChange, label, hideLabel = false }) {
  return (
    <label className="fm-switch">
      <input
        type="checkbox"
        role="switch"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        aria-label={hideLabel ? label : undefined}
      />
      <span className="fm-switch-track" aria-hidden="true" />
      {!hideLabel && <span className="fm-switch-label">{label}</span>}
    </label>
  );
}

// Centred dialog used by every step of the flow. No close button in the
// design, so Escape and the backdrop dismiss it.
function Dialog({ label, size = "md", onClose, children }) {
  useEffect(() => {
    const onKey = (event) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fm-overlay" onClick={onClose}>
      <div
        className={`fm-dialog fm-dialog--${size}`}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

function DialogHeading({ eyebrow, title, text, center = false }) {
  return (
    <div className={`fm-dialog-heading ${center ? "fm-dialog-heading--center" : ""}`}>
      {eyebrow && <p className="fm-eyebrow">{eyebrow}</p>}
      <h2>{title}</h2>
      {text && <p className="fm-dialog-text">{text}</p>}
    </div>
  );
}

function DialogActions({ secondary, primary, onSecondary, onPrimary, primaryDisabled }) {
  return (
    <div className="fm-dialog-actions">
      <button type="button" className="fm-btn fm-btn--outline" onClick={onSecondary}>
        {secondary}
      </button>
      <button
        type={onPrimary ? "button" : "submit"}
        className="fm-btn fm-btn--primary"
        onClick={onPrimary}
        disabled={primaryDisabled}
      >
        {primary}
      </button>
    </div>
  );
}

function SuccessDialog({ title, text, secondary, primary, onSecondary, onPrimary, onClose }) {
  return (
    <Dialog label={title} size="sm" onClose={onClose}>
      <span className="fm-success-badge" aria-hidden="true">
        <Icon name="check" size={22} />
      </span>
      <DialogHeading title={title} text={text} center />
      <DialogActions
        secondary={secondary}
        primary={primary}
        onSecondary={onSecondary}
        onPrimary={onPrimary}
      />
    </Dialog>
  );
}

/* Step 1: what adding a dependent means */

function IntroDialog({ onClose, onContinue }) {
  const points = [
    {
      icon: "calendar",
      title: "You manage their care",
      text: "Book visits, and hold their reports and prescriptions from your account.",
    },
    {
      icon: "check",
      title: "Added instantly",
      text: "A dependent has no records of their own to protect, so there's nothing to approve.",
    },
  ];

  return (
    <Dialog label="Add a family member" onClose={onClose}>
      <DialogHeading
        eyebrow="Add a family member"
        title="You're adding someone in your care"
        text="People you add here are dependents a child, or an adult who can't manage their own health account. Their profile lives under yours."
      />
      <ul className="fm-points">
        {points.map((point) => (
          <li key={point.title}>
            <span className="fm-point-icon">
              <Icon name={point.icon} size={14} />
            </span>
            <div>
              <strong>{point.title}</strong>
              <p>{point.text}</p>
            </div>
          </li>
        ))}
      </ul>
      <DialogActions
        secondary="Cancel"
        primary="Continue"
        onSecondary={onClose}
        onPrimary={onContinue}
      />
    </Dialog>
  );
}

/* Step 2: create / manage a dependent */

function MemberForm({ member, onBack, onClose, onSave, onRemove }) {
  const editing = Boolean(member);
  const [form, setForm] = useState(
    member
      ? { ...EMPTY_FORM, ...member, recordAccess: member.access !== "book" }
      : EMPTY_FORM
  );
  const [errors, setErrors] = useState({});

  const set = (field, value) => {
    setForm((values) => ({ ...values, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };
  const update = (field) => (event) => set(field, event.target.value);

  const age = form.dob && form.dob <= today() ? ageFrom(form.dob) : null;
  const adult = age !== null && age >= 18;

  const handleSubmit = (event) => {
    event.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length === 0) {
      onSave({
        ...form,
        name: form.name.trim(),
        phone: adult ? normalisePhone(form.phone) : form.phone,
      });
    }
  };

  const field = (name, label, control, { full = false, required = false } = {}) => (
    <label className={`fm-field ${full ? "fm-field--full" : ""}`}>
      <span className="fm-field-label">
        {label}
        {required && <em className="fm-required"> *</em>}
      </span>
      {control}
      {errors[name] && <em className="fm-field-error">{errors[name]}</em>}
    </label>
  );

  const select = (name, options, placeholder) => (
    <span className="fm-select">
      <select
        value={form[name]}
        onChange={update(name)}
        aria-invalid={Boolean(errors[name])}
        className={form[name] ? "" : "is-placeholder"}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <Icon name="chevron" size={18} />
    </span>
  );

  // The record-access switch shows once it matters: always when managing,
  // and for adults when adding (minors share records without consent).
  const showAccess = editing || adult;

  return (
    <Dialog label={editing ? `Manage ${member.name}` : "Create a dependent profile"} size="lg" onClose={onClose}>
      <form className="fm-form" onSubmit={handleSubmit} noValidate>
        {!editing && (
          <button type="button" className="fm-back" onClick={onBack} aria-label="Back">
            <BackArrow />
          </button>
        )}
        <DialogHeading
          eyebrow={editing ? "Manage dependent" : null}
          title={editing ? member.name : "Create a dependent profile"}
          text="You'll manage care and bookings for this person from your account."
        />

        <div className="fm-fields">
          {field(
            "name",
            "Full name",
            <input
              type="text"
              placeholder="Please enter full name"
              value={form.name}
              onChange={update("name")}
              aria-invalid={Boolean(errors.name)}
              autoFocus
            />,
            { full: true }
          )}
          {field("relationship", "Relation", select("relationship", RELATIONSHIPS, "Select relation"))}
          {field("gender", "Gender", select("gender", GENDERS, "Select gender"))}
          {field(
            "dob",
            "Date of birth",
            <input
              type="date"
              value={form.dob}
              max={today()}
              onChange={update("dob")}
              aria-invalid={Boolean(errors.dob)}
              className={form.dob ? "" : "is-placeholder"}
            />
          )}
          <label className="fm-field">
            <span className="fm-field-label">Age (auto)</span>
            <input type="text" value={age === null ? "-" : `${age} years`} readOnly tabIndex={-1} className="fm-input-auto" />
          </label>
          {adult &&
            field(
              "phone",
              "Mobile number",
              <input
                type="tel"
                inputMode="numeric"
                placeholder="+91 00000 00000"
                value={form.phone}
                onChange={update("phone")}
                aria-invalid={Boolean(errors.phone)}
              />,
              { full: true, required: true }
            )}
          {showAccess && (
            <div className="fm-field--full">
              <Switch
                checked={form.recordAccess}
                onChange={(value) => set("recordAccess", value)}
                label="Record access"
              />
            </div>
          )}
        </div>

        {editing ? (
          <DialogActions
            secondary="Remove from family"
            primary="Save changes"
            onSecondary={() => onRemove(member)}
          />
        ) : (
          <DialogActions secondary="Cancel" primary="Add to my family member" onSecondary={onClose} />
        )}
      </form>
    </Dialog>
  );
}

/* Request record access from a book-only adult */

function AccessRequestDialog({ onClose, onSend }) {
  const [shares, setShares] = useState({ reports: true, prescriptions: false });
  const options = [
    { key: "reports", icon: "reports", label: "Reports & lab results" },
    { key: "prescriptions", icon: "prescription", label: "Prescriptions" },
  ];

  return (
    <Dialog label="Request record access" size="md-sm" onClose={onClose}>
      <DialogHeading
        eyebrow="Request record access"
        title="Ask dependent to share their records"
        text="You can currently book for this dependent, but not see their reports. We'll text them a consent link to approve record access."
      />
      <ul className="fm-share-list">
        {options.map((option) => (
          <li key={option.key}>
            <span className="fm-point-icon">
              <Icon name={option.icon} size={16} />
            </span>
            <span className="fm-share-label">{option.label}</span>
            <Switch
              checked={shares[option.key]}
              onChange={(value) => setShares((current) => ({ ...current, [option.key]: value }))}
              label={option.label}
              hideLabel
            />
          </li>
        ))}
      </ul>
      <DialogActions
        secondary="Cancel"
        primary="Send access request"
        onSecondary={onClose}
        onPrimary={() => onSend(shares)}
        primaryDisabled={!shares.reports && !shares.prescriptions}
      />
    </Dialog>
  );
}

/* Members table */

function MemberTable({ members, archived, onEdit, onBook, onViewRequest, onRequestAccess, onRestore }) {
  return (
    <div className="pa-table-wrapper">
      <table className="pa-table fm-table">
        <thead>
          <tr>
            <th>FAMILY MEMBER</th>
            <th>RELATION</th>
            <th>GENDER · AGE</th>
            <th>DATE OF BIRTH</th>
            <th>RECORD ACCESS</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => {
            const isSelf = member.relationship === "Self";
            const pending = member.status === "pending";
            const [access, accessNote] = recordAccess(member);
            const subtitle = archived
              ? `Was: ${member.was ?? "Dependent"}`
              : isSelf
                ? "Self"
                : pending
                  ? "Awaiting SMS consent"
                  : "Dependent";

            return (
              <tr key={member.id}>
                <td>
                  <div className="pa-doctor-cell">
                    <span className="pa-cell-primary">{member.name}</span>
                    <span className={`pa-cell-secondary ${isSelf ? "fm-self" : ""}`}>
                      {subtitle}
                    </span>
                  </div>
                </td>
                <td>
                  <span className="pa-consultation-type">{member.relationship}</span>
                </td>
                <td>
                  <span className="pa-consultation-type">
                    {member.gender} · {ageFrom(member.dob)}
                  </span>
                </td>
                <td>
                  <span className="pa-consultation-type">{formatDob(member.dob)}</span>
                </td>
                <td>
                  {archived ? (
                    <span className="pa-cell-primary">{member.archivedNote}</span>
                  ) : (
                    <div className="pa-doctor-cell">
                      <span className="pa-cell-primary">{access}</span>
                      {member.access === "book" && !pending ? (
                        <button
                          type="button"
                          className="fm-text-link"
                          onClick={() => onRequestAccess(member)}
                        >
                          Request record access
                        </button>
                      ) : (
                        <span className={`pa-cell-secondary ${isSelf ? "fm-self" : ""}`}>
                          {accessNote}
                        </span>
                      )}
                    </div>
                  )}
                </td>
                <td>
                  {archived ? (
                    <button className="fm-book fm-book--wide" onClick={() => onRestore(member)}>
                      {member.was === "pending" ? "Re-invite" : "Restore"}
                    </button>
                  ) : pending ? (
                    <button className="fm-book fm-book--wide" onClick={() => onViewRequest(member)}>
                      View request
                    </button>
                  ) : (
                    <div className="fm-actions">
                      <button
                        className="fm-icon-button"
                        onClick={() => onEdit(member)}
                        aria-label={`Edit ${member.name}`}
                        title={isSelf ? "Edit your profile" : "Edit"}
                      >
                        <Icon name="edit" size={14} />
                      </button>
                      <button className="fm-book" onClick={() => onBook(member)}>
                        Book
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* Load states */

function LoadingState() {
  return (
    <div className="fm-loading" role="status" aria-live="polite">
      <span className="fm-visually-hidden">Loading family members…</span>
      <span className="fm-skeleton fm-skeleton--title" />
      <span className="fm-skeleton fm-skeleton--text" />
      <div className="fm-grid">
        <span className="fm-skeleton fm-skeleton--card" />
        <span className="fm-skeleton fm-skeleton--card" />
      </div>
    </div>
  );
}

function ErrorState({ onRetry }) {
  return (
    <section className="ae-empty fm-empty" role="alert">
      <h1 className="ae-empty-title">Something went wrong</h1>
      <p className="ae-empty-text">
        We hit a snag loading your dashboard. Your data is safe, please try
        again in a moment.
      </p>
      <button type="button" className="ae-empty-button" onClick={onRetry}>
        Try again
      </button>
    </section>
  );
}

/* Page */

// loadMembers (optional): async (attempt) => members, where attempt counts
// retries from 0. Without it the page shows
// initialMembers straight away.
export default function FamilyMembers({ initialMembers = [], loadMembers }) {
  const [members, setMembers] = useState(initialMembers);
  const [status, setStatus] = useState(loadMembers ? "loading" : "ready");
  const [attempt, setAttempt] = useState(0);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState("");
  const [tab, setTab] = useState("Active");
  const [search, setSearch] = useState("");

  const closeModal = useCallback(() => setModal(null), []);
  const closeToast = useCallback(() => setToast(""), []);

  const query = search.trim().toLowerCase();
  const visible = members.filter(
    (member) =>
      (member.status === "archived") === (tab === "Archived") &&
      (!query ||
        [member.name, member.relationship].some((value) =>
          value.toLowerCase().includes(query)
        ))
  );

  useEffect(() => {
    if (!loadMembers) return undefined;
    let cancelled = false;
    setStatus("loading");
    loadMembers(attempt)
      .then((list) => {
        if (cancelled) return;
        setMembers(list);
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [loadMembers, attempt]);

  const retry = () => setAttempt((count) => count + 1);

  const patch = (member, changes) =>
    setMembers((list) =>
      list.map((item) => (item.id === member.id ? { ...item, ...changes } : item))
    );

  const handleSave = ({ recordAccess: wantsAccess, ...values }) => {
    const existing = modal.member;

    if (!existing) {
      // Minors are added straight away; adults approve an SMS consent link first.
      const member = {
        ...values,
        id: Date.now(),
        access: wantsAccess || !isAdult(values) ? "full" : "book",
        status: isAdult(values) ? "pending" : "active",
        invitedAt: today(),
      };
      setMembers((list) => [...list, member]);
      setModal({ type: isAdult(member) ? "invited" : "added", member });
      return;
    }

    const updated = { ...existing, ...values };
    if (!wantsAccess) {
      updated.access = "book";
    } else if (existing.access === "book" && isAdult(updated)) {
      // An adult has to approve record access again.
      updated.access = "requested";
      patch(existing, updated);
      setModal({ type: "accessSent", member: updated });
      return;
    } else if (!isAdult(updated)) {
      updated.access = "full";
    }
    patch(existing, updated);
    setToast(`${updated.name}'s details updated`);
    closeModal();
  };

  // Nothing is deleted: removed members and cancelled requests move to Archived.
  const archive = (member, was, archivedNote) =>
    patch(member, { status: "archived", was, archivedNote });

  const handleArchive = (member) => {
    archive(member, "Dependent", "Removed access");
    closeModal();
    setToast(`${member.name} archived`);
  };

  const cancelInvite = (member) => {
    archive(member, "pending", "Request cancelled");
    closeModal();
    setToast(`Request to ${firstName(member.name)} cancelled`);
  };

  const cancelAccessRequest = (member) => {
    patch(member, { access: "book" });
    closeModal();
    setToast(`Record access request to ${firstName(member.name)} cancelled`);
  };

  const handleRestore = (member) => {
    if (member.was === "pending") {
      const invited = { ...member, status: "pending", invitedAt: today() };
      patch(member, { status: "pending", invitedAt: today() });
      setTab("Active");
      setModal({ type: "invited", member: invited });
      return;
    }
    patch(member, { status: "active" });
    setToast(`${member.name} restored`);
  };

  const handleEdit = (member) => {
    if (member.relationship === "Self") {
      navigateTo("PatientProfileSettings");
      return;
    }
    setModal({ type: "form", member });
  };

  const handleSendAccess = (member) => {
    const requested = { ...member, access: "requested" };
    patch(member, { access: "requested" });
    setModal({ type: "accessSent", member: requested });
  };

  const book = () => navigateTo("allDoctors");

  const renderModal = () => {
    if (!modal) return null;
    const { member } = modal;
    const who = member ? pronouns(member.gender) : null;

    switch (modal.type) {
      case "intro":
        return (
          <IntroDialog
            onClose={closeModal}
            onContinue={() => setModal({ type: "form" })}
          />
        );
      case "form":
        return (
          <MemberForm
            member={member}
            onBack={() => setModal({ type: "intro" })}
            onClose={closeModal}
            onSave={handleSave}
            onRemove={(target) => setModal({ type: "archive", member: target })}
          />
        );
      case "added":
        return (
          <SuccessDialog
            title={`${firstName(member.name)} is now in your family`}
            text={`You can book appointments and manage reports for ${firstName(member.name)} from your account. You can add a phone number any time so ${who.subject} can claim ${who.possessive} own login later.`}
            secondary="Done"
            primary="Book"
            onSecondary={closeModal}
            onPrimary={book}
            onClose={closeModal}
          />
        );
      case "invited":
        return (
          <SuccessDialog
            title={`Consent link sent to ${firstName(member.name)}`}
            text={`We've texted ${member.name} a secure link at ${maskPhone(member.phone)}. ${capitalize(who.subject)}'ll appear as a dependent once ${who.subject} taps it and approves, you'll be notified either way.`}
            secondary="Cancel Request"
            primary="Done"
            onSecondary={() => cancelInvite(member)}
            onPrimary={closeModal}
            onClose={closeModal}
          />
        );
      case "request":
        return (
          <Dialog label={`Consent link sent to ${firstName(member.name)}`} onClose={closeModal}>
            <DialogHeading
              title={`Consent link sent to ${firstName(member.name)}`}
              text={`We've texted ${member.name} a secure link at ${maskPhone(member.phone)}. ${capitalize(who.subject)}'ll appear as a linked member once ${who.subject} taps it and approves, you'll be notified either way. No account needed on ${who.possessive} end to approve.`}
            />
            <div className="fm-pending-note">
              <p className="fm-pending-title">
                <Clock /> Pending
              </p>
              <p>
                {capitalize(expiresIn(member))}. We remind{" "}
                {who.object} once before it lapses. You can cancel this request any time.
              </p>
            </div>
            <DialogActions
              secondary="Cancel request"
              primary="Done"
              onSecondary={() => cancelInvite(member)}
              onPrimary={closeModal}
            />
          </Dialog>
        );
      case "access":
        return (
          <AccessRequestDialog
            onClose={closeModal}
            onSend={() => handleSendAccess(member)}
          />
        );
      case "accessSent":
        return (
          <SuccessDialog
            title={`Consent link sent to ${firstName(member.name)}`}
            text={`We've texted ${member.name} a secure link at ${maskPhone(member.phone)}. ${capitalize(who.subject)}'ll share ${who.possessive} records once ${who.subject} taps it and approves, you'll be notified either way.`}
            secondary="Cancel Request"
            primary="Done"
            onSecondary={() => cancelAccessRequest(member)}
            onPrimary={closeModal}
            onClose={closeModal}
          />
        );
      case "archive":
        return (
          <Dialog label="Archive this member from your family?" size="md-sm" onClose={closeModal}>
            <DialogHeading
              title="Archive this member from your family?"
              text="This member will be moved out of your active family list. You can restore them at any time. This does not delete anything. All prescriptions, reports, invoices and appointment history stay in the medical record."
            />
            <DialogActions
              secondary="Cancel"
              primary="Archive"
              onSecondary={closeModal}
              onPrimary={() => handleArchive(member)}
            />
          </Dialog>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Navbar />
      <div className="patient-appointments ap-page fm-page">
        <Sidebar active="Family Members" />

        <main className="pa-main fm-main" aria-busy={status === "loading"}>
          {status === "loading" ? (
            <LoadingState />
          ) : status === "error" ? (
            <ErrorState onRetry={retry} />
          ) : members.length === 0 ? (
            <section className="ae-empty fm-empty">
              <h1 className="ae-empty-title">No family members added</h1>
              <p className="ae-empty-text">
                Add the people you care for to book appointments, store their
                reports and manage prescriptions all from your account.
              </p>
              <button
                type="button"
                className="ae-empty-button"
                onClick={() => setModal({ type: "intro" })}
              >
                Add member
              </button>
            </section>
          ) : (
            <>
              <div className="fm-toolbar">
                <label className="pa-search fm-search">
                  <input
                    type="text"
                    placeholder="Search for family member"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    aria-label="Search for family member"
                  />
                  <Icon name="search" size={20} />
                </label>

                <div className="fm-toolbar-right">
                  <div className="fm-tabs" role="tablist">
                    {["Active", "Archived"].map((name) => (
                      <button
                        key={name}
                        role="tab"
                        aria-selected={tab === name}
                        className={tab === name ? "is-active" : ""}
                        onClick={() => setTab(name)}
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                  <button
                    className="ap-outline-button fm-add"
                    onClick={() => setModal({ type: "intro" })}
                  >
                    <span aria-hidden="true">+</span>
                    Add member
                  </button>
                </div>
              </div>

              {visible.length > 0 ? (
                <MemberTable
                  members={visible}
                  archived={tab === "Archived"}
                  onEdit={handleEdit}
                  onBook={book}
                  onViewRequest={(member) => setModal({ type: "request", member })}
                  onRequestAccess={(member) => setModal({ type: "access", member })}
                  onRestore={handleRestore}
                />
              ) : (
                <p className="fm-none">
                  {query
                    ? `No family members match “${search}”.`
                    : tab === "Archived"
                      ? "No archived family members."
                      : "No active family members."}
                </p>
              )}

              {tab === "Archived" && (
                <p className="fm-archive-note">
                  Archived members are hidden from active care but nothing is
                  deleted. Their prescriptions, reports, invoices and
                  appointment history stay in their medical record and can be
                  restored at any time.
                </p>
              )}
            </>
          )}
        </main>

        {renderModal()}

        <Toast message={toast} onClose={closeToast} />
      </div>
      <Footer />
    </>
  );
}
