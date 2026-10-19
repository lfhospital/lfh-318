import React, { useCallback, useEffect, useState } from "react";
import "../PatientAppointments/PatientAppointments.css";
import "../AppointmentsEmpty/AppointmentsEmpty.css";
import "../Appointments/Appointments.css";
import "../Prescriptions/Prescriptions.css";
import "./SecondOpinion.css";
import Navbar from "../../Home-page-Components/Navbar/Navbar";
import Footer from "../../Home-page-Components/Footer/HomeFooter";
import {
  Icon,
  PATIENT_OPTIONS,
  Sidebar,
} from "../PatientAppointments/PatientAppointments";
import { Modal, Toast } from "../Appointments/Appointments";
import { SORT_OPTIONS } from "../PatientReports/PatientReports";
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";
import FilterMenu from "../FilterMenu/FilterMenu";
import UploadDialog, { defaultUpload } from "../UploadDialog/UploadDialog";
import { formatShortDate } from "../../../dates";
import { getSubmittedSecondOpinions } from "../../Second-opinion-flow-Components/secondOpinionStore";

const DAY_MS = 24 * 60 * 60 * 1000;

const STATUS_OPTIONS = [
  { value: "All", label: "All" },
  { value: "Ready", label: "Ready" },
  { value: "Under review", label: "Under review" },
  { value: "More documents needed", label: "More documents needed" },
  { value: "Cancelled", label: "Cancelled" },
];

const PATIENTS = [
  { name: "Rohan Iyer", relation: "Me" },
  { name: "Shreya Iyer", relation: "Family" },
  { name: "Sharan Iyer", relation: "Family" },
];

const SPECIALTIES = [
  "Cardiology",
  "Oncology",
  "Orthopedics",
  "Neurology",
  "Nephrology",
  "Gastroenterology",
];

const REVIEW_TYPES = [
  { value: "Written review", price: 2500 },
  { value: "Review & consult", price: 4000 },
];

const today = () => new Date().toISOString().slice(0, 10);

const formatDate = (iso) =>
  iso === today()
    ? "Today"
    : formatShortDate(new Date(`${iso}T00:00:00`));

const formatAmount = (amount) => `₹${amount.toLocaleString("en-IN")}`;

// "Dr. Vikram Rao" -> "Dr. Rao"
const shortName = (name) => `Dr. ${name.split(" ").pop()}`;

const progressFor = ({ status, specialist, submitted }) => {
  const steps = [
    { label: "Request submitted & paid", text: "Case and documents received.", time: submitted, state: "done" },
    {
      label: "Specialist assigned",
      text: specialist ? `${specialist.name}, ${specialist.role}.` : "We're matching you with a specialist.",
      time: specialist ? submitted : "",
      state: specialist ? "done" : "active",
    },
    {
      label: "Under review",
      text:
        status === "More documents needed"
          ? "Paused until you upload the requested document."
          : `${specialist ? shortName(specialist.name) : "The specialist"} is studying your reports.`,
      time: status === "More documents needed" ? "On hold" : "In progress",
      state: status === "Ready" ? "done" : specialist ? "active" : "todo",
    },
    {
      label: "Opinion ready",
      text: "Your written opinion & video consult will appear here.",
      time: status === "Ready" ? "Delivered" : "Est. within 24h of resuming",
      state: status === "Ready" ? "done" : "todo",
    },
  ];
  return status === "Cancelled"
    ? [...steps.slice(0, 2), { label: "Request cancelled", text: "Your refund has been initiated.", time: "Refund in 5–7 working days", state: "done" }]
    : steps;
};

export const sampleSecondOpinions = [
  {
    ref: "LF-26-4B7K2",
    title: "Cardiology- valve replacement review",
    type: "Written review",
    orderedBy: "Dr. A. Menon",
    department: "Cardiology",
    date: today(),
    submitted: "28 Jul 2026",
    delivered: "4 Aug 2026",
    patient: "Shreya Iyer",
    relation: "Family",
    patientNote: "wife",
    status: "Ready",
    paid: 2500,
    specialist: {
      name: "Dr. Anjali Kashyap",
      role: "Senior Consultant, Interventional Cardiology",
      chips: ["21 yrs exp.", "MD, DM", "CMC Vellore"],
    },
    documents: [
      { name: "Echocardiogram_Jul2026.pdf", meta: "Uploaded by you · 1.8 MB" },
      { name: "Cardiac cath report · Jul 2026", meta: "From your Lakshmee records" },
    ],
    opinion: {
      summary: [
        "I have reviewed Mrs. Iyer's echocardiogram, cardiac catheterisation report, and the treating cardiologist's notes. She has moderate-to-severe aortic stenosis with preserved ejection fraction and stable symptoms. Her current team has recommended surgical aortic valve replacement (SAVR).",
        "Based on the records provided, the diagnosis is well-supported and appropriate. However, given her age and anatomy, there is a strong case to evaluate a less invasive alternative before proceeding to open surgery.",
      ],
      findings: [
        { title: "Diagnosis confirmed.", text: "The aortic stenosis grading on the echo is consistent with the catheterisation data. No discrepancy found." },
        { title: "Surgery is reasonable", text: "but may not be the only option. Her valve calcification pattern and vascular access appear suitable for a catheter-based approach (TAVR)." },
        { title: "One gap:", text: "a recent coronary assessment is missing from the records — this is important before finalising any approach." },
      ],
      recommendations: [
        "Request a Heart Team consultation (cardiologist + cardiac surgeon together) to compare SAVR vs. TAVR for her specific case.",
        "Complete a coronary angiogram if not done in the last 6 months.",
        "There is no urgency to decide this week, her symptoms are stable. Taking two weeks to evaluate options carries low risk.",
      ],
      plainWords:
        "Your wife's doctors are right about the problem. Surgery would help, but there may be a keyhole option that avoids opening the chest. It's worth one more conversation, and one more test, before deciding. There's no emergency.",
      attachments: [
        { name: "Full_Written_Opinion.pdf", meta: "Signed · 3 pages" },
        { name: "Annotated_Echocardiogram.pdf", meta: "Specialist notes · 1 page" },
      ],
    },
  },
  {
    ref: "LF-26-4C1M8",
    title: "Oncology - treatment options",
    type: "Review & consult",
    orderedBy: "Dr. A. Menon",
    department: "Cardiology",
    date: "2026-05-02",
    submitted: "3 Aug 2026",
    patient: "Rohan Iyer",
    relation: "Me",
    status: "Under review",
    paid: 4000,
    specialist: {
      name: "Dr. Vikram Rao",
      role: "Head, Medical Oncology",
      chips: ["24 yrs exp.", "MD, DM", "AIIMS"],
    },
    documents: [
      { name: "PET_CT_Report_Jul2026.pdf", meta: "Uploaded by you · 3.2 MB" },
      { name: "Oncology consult · Jun 2026", meta: "From your Lakshmee records" },
    ],
  },
  {
    ref: "LF-26-4D9P3",
    title: "Orthopedics- knee surgery",
    type: "Written review",
    orderedBy: "Dr. A. Menon",
    department: "Cardiology",
    date: "2026-05-02",
    submitted: "1 Aug 2026",
    patient: "Rohan Iyer",
    relation: "Me",
    status: "More documents needed",
    paid: 2500,
    specialist: {
      name: "Dr. Meera Pillai",
      role: "Consultant, Joint Replacement",
      chips: ["18 yrs exp.", "MS Ortho", "KEM Mumbai"],
    },
    requiredDocument: {
      title: "Upload your most recent knee MRI",
      text: "Dr. Pillai has requested one more report. Upload the required document so the review can continue. The 48-hour clock is paused until then.",
    },
    documents: [{ name: "Knee_Xray_Jul2026.jpg", meta: "Uploaded by you · 2.4 MB" }],
  },
];

const actionFor = (status) =>
  ({ Ready: "View", "Under review": "Track", "More documents needed": "Upload" })[status] ||
  "Details";

function inDateRange(iso, range) {
  const date = new Date(`${iso}T00:00:00`);
  const age = Date.now() - date.getTime();
  if (range === "30d") return age <= 30 * DAY_MS;
  if (range === "3m") return age <= 92 * DAY_MS;
  return String(date.getFullYear()) === range;
}

function downloadText(fileName, lines) {
  const url = URL.createObjectURL(new Blob([lines.join("\n")], { type: "text/plain" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

function caseSummaryLines(request) {
  return [
    "LAKSHMEE FOUNDATION HOSPITAL · SECOND OPINION",
    `Reference:   ${request.ref}`,
    `Request:     ${request.title} (${request.type})`,
    `Patient:     ${request.patient} (${request.relation})`,
    `Submitted:   ${request.submitted}`,
    `Status:      ${request.status}`,
    request.specialist ? `Specialist:  ${request.specialist.name}, ${request.specialist.role}` : "",
    "",
    "Documents:",
    ...request.documents.map((doc) => `- ${doc.name} (${doc.meta})`),
  ].filter((line) => line !== "");
}

/* Status badge */

function StatusBadge({ status }) {
  const variant = status.toLowerCase().replace(/\s+/g, "-");
  return (
    <span className={`so-status so-status--${variant}`}>
      {status === "Ready" && <span className="so-status-dot" aria-hidden="true" />}
      {status}
    </span>
  );
}

/* Dialog shell shared by View / Track */

function OpinionDialog({ eyebrow, request, width, onClose, children }) {
  useEffect(() => {
    const onKey = (event) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const forWhom = `For ${request.patient}${
    request.patientNote ? ` (${request.patientNote})` : ` · ${request.relation}`
  }`;
  const meta =
    request.status === "Ready"
      ? [forWhom, `Ref ${request.ref}`, `Delivered ${request.delivered}`]
      : [forWhom, `Ref ${request.ref}`, `Submitted ${request.submitted}`, request.type, `${formatAmount(request.paid)} paid`];

  return (
    <div className="so-overlay" onClick={onClose}>
      <div
        className="so-modal"
        style={{ maxWidth: width }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="so-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button className="so-close" onClick={onClose} aria-label="Close">
          <Icon name="close" size={22} />
        </button>
        <header className="so-modal-head">
          <p className="so-eyebrow">Second opinion · {eyebrow}</p>
          <h2 id="so-modal-title">{request.title}</h2>
          <p className="so-modal-meta">{meta.join(" · ")}</p>
        </header>
        {children}
      </div>
    </div>
  );
}

function FileRow({ file, onView, onDownload }) {
  return (
    <li className="so-file">
      <span className="so-file-badge" aria-hidden="true">
        PDF
      </span>
      <span className="so-file-text">
        <span className="so-file-name">{file.name}</span>
        <span className="so-file-meta">{file.meta}</span>
      </span>
      <span className="so-file-actions">
        {onView && (
          <button className="so-icon-button" onClick={() => onView(file)} aria-label={`View ${file.name}`} title="View">
            <Icon name="eye" size={14} />
          </button>
        )}
        <button className="so-icon-button" onClick={() => onDownload(file)} aria-label={`Download ${file.name}`} title="Download">
          <Icon name="download" size={14} />
        </button>
      </span>
    </li>
  );
}

/* "Ready" — the written opinion */

function OpinionView({ request, onClose, onDownload }) {
  const { opinion } = request;
  return (
    <OpinionDialog eyebrow="Completed" request={request} width="74.625rem" onClose={onClose}>
      <div className="so-opinion">
        <section className="so-block">
          <h3 className="so-block-title">
            <span className="so-block-icon"><Icon name="prescription" size={16} /></span>
            Summary
          </h3>
          {opinion.summary.map((paragraph) => (
            <p key={paragraph.slice(0, 20)}>{paragraph}</p>
          ))}
        </section>

        <section className="so-block">
          <h3 className="so-block-title">
            <span className="so-block-icon"><Icon name="search" size={16} /></span>
            Findings
          </h3>
          <ul className="so-bullets">
            {opinion.findings.map((finding) => (
              <li key={finding.title}>
                <strong>{finding.title}</strong>
                <br />
                {finding.text}
              </li>
            ))}
          </ul>
        </section>

        <section className="so-block">
          <h3 className="so-block-title">
            <span className="so-block-icon"><Icon name="check" size={16} /></span>
            Recommendations
          </h3>
          <ul className="so-bullets">
            {opinion.recommendations.map((item) => (
              <li key={item.slice(0, 20)}>{item}</li>
            ))}
          </ul>
          <p>
            <span className="so-plain">In plain words - </span>
            {opinion.plainWords}
          </p>
        </section>

        <section className="so-block so-block--last">
          <h3 className="so-block-title">
            <span className="so-block-icon"><Icon name="family" size={16} /></span>
            Attachments from {shortName(request.specialist.name)}
          </h3>
          <ul className="so-files">
            {opinion.attachments.map((file) => (
              <FileRow key={file.name} file={file} onDownload={onDownload} />
            ))}
          </ul>
        </section>
      </div>
    </OpinionDialog>
  );
}

/* "Under review" / "More documents needed" — tracking */

function TrackView({ request, onClose, onAddDocuments, onViewFile, onDownloadFile, onDownloadSummary, onCancel }) {
  const steps = progressFor(request);
  const eyebrow = request.status === "Cancelled" ? "Cancelled" : "Under review";
  const canCancel = request.status !== "Ready" && request.status !== "Cancelled";

  return (
    <OpinionDialog eyebrow={eyebrow} request={request} width="62rem" onClose={onClose}>
      {request.status === "More documents needed" && request.requiredDocument && (
        <div className="so-request-banner" role="alert">
          <span className="so-banner-icon" aria-hidden="true">!</span>
          <div>
            <p className="so-banner-title">{request.requiredDocument.title}</p>
            <p className="so-banner-text">{request.requiredDocument.text}</p>
          </div>
          <button className="so-banner-action" onClick={() => onAddDocuments(true)}>
            <Icon name="upload" size={14} />
            Upload now
          </button>
        </div>
      )}

      <div className="so-track">
        <div className="so-track-main">
          {request.specialist && (
            <section className="so-track-section">
              <p className="so-label">Your specialist</p>
              <p className="so-specialist-name">{request.specialist.name}</p>
              <p className="so-specialist-role">{request.specialist.role}</p>
              <div className="so-chips">
                {request.specialist.chips.map((chip) => (
                  <span key={chip} className="so-chip">{chip}</span>
                ))}
              </div>
            </section>
          )}

          <section className="so-track-section">
            <div className="so-docs-head">
              <h3>Documents</h3>
              {canCancel && (
                <button className="so-add-docs" onClick={() => onAddDocuments(false)}>
                  + Add documents
                </button>
              )}
            </div>
            <ul className="so-files">
              {request.documents.map((file) => (
                <FileRow key={file.name} file={file} onView={onViewFile} onDownload={onDownloadFile} />
              ))}
            </ul>
          </section>

          <section className="so-track-section so-track-section--last">
            <p className="so-label">Manage request</p>
            <div className="so-manage">
              <button className="so-outline-button" onClick={onDownloadSummary}>
                <Icon name="download" size={14} />
                Download case summary
              </button>
              {canCancel && (
                <button className="so-outline-button" onClick={onCancel}>
                  Cancel request and refund
                </button>
              )}
            </div>
            <p className="so-manage-note">
              Cancel before the opinion is delivered for a full refund.
              Cancellations after delivery aren't eligible.
            </p>
          </section>
        </div>

        <aside className="so-progress" aria-label="Progress">
          <h3>Progress</h3>
          <ol>
            {steps.map((step) => (
              <li key={step.label} className={`so-step so-step--${step.state}`}>
                <span className="so-step-marker" aria-hidden="true">
                  {step.state === "done" && (
                    <svg viewBox="0 0 24 24" width="10" height="10"><path d="m5 12 5 5 9-10" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  )}
                </span>
                <span className="so-step-body">
                  <span className="so-step-label">{step.label}</span>
                  <span className="so-step-text">{step.text}</span>
                  {step.time && <span className="so-step-time">{step.time}</span>}
                </span>
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </OpinionDialog>
  );
}

/* New request form */

function NewRequestModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({
    patient: PATIENTS[0].name,
    specialty: "",
    type: REVIEW_TYPES[0].value,
    question: "",
  });
  const [errors, setErrors] = useState({});
  const update = (field) => (event) => {
    setForm((values) => ({ ...values, [field]: event.target.value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };
  const price = REVIEW_TYPES.find((type) => type.value === form.type).price;

  const handleSubmit = (event) => {
    event.preventDefault();
    const found = {};
    if (!form.specialty) found.specialty = "Choose a specialty.";
    if (form.question.trim().length < 10) found.question = "Tell us a little more (at least 10 characters).";
    setErrors(found);
    if (Object.keys(found).length === 0) onSubmit({ ...form, price });
  };

  return (
    <Modal title="Request a second opinion" onClose={onClose}>
      <form className="prx-form" onSubmit={handleSubmit} noValidate>
        <div className="prx-fields">
          <label className="prx-field">
            <span>Patient</span>
            <select value={form.patient} onChange={update("patient")}>
              {PATIENTS.map((patient) => (
                <option key={patient.name} value={patient.name}>
                  {patient.name} ({patient.relation})
                </option>
              ))}
            </select>
          </label>
          <label className="prx-field">
            <span>Specialty</span>
            <select value={form.specialty} onChange={update("specialty")} aria-invalid={Boolean(errors.specialty)}>
              <option value="">Select</option>
              {SPECIALTIES.map((specialty) => (
                <option key={specialty} value={specialty}>{specialty}</option>
              ))}
            </select>
            {errors.specialty && <em className="so-field-error">{errors.specialty}</em>}
          </label>
          <fieldset className="prx-field prx-field--full so-types">
            <span>Review type</span>
            <div className="so-type-options">
              {REVIEW_TYPES.map((type) => (
                <label key={type.value} className={`so-type ${form.type === type.value ? "is-selected" : ""}`}>
                  <input type="radio" name="type" value={type.value} checked={form.type === type.value} onChange={update("type")} />
                  <span className="pa-cell-primary">{type.value}</span>
                  <span className="pa-cell-secondary">{formatAmount(type.price)}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <label className="prx-field prx-field--full">
            <span>What would you like reviewed?</span>
            <textarea
              rows={4}
              value={form.question}
              onChange={update("question")}
              placeholder="e.g. My doctor has recommended knee replacement. Is surgery the right option now?"
              aria-invalid={Boolean(errors.question)}
            />
            {errors.question && <em className="so-field-error">{errors.question}</em>}
          </label>
        </div>
        <p className="so-form-note">
          Your reports and family members are already here, nothing to re-enter.
          You can add documents after submitting.
        </p>
        <div className="ap-modal-actions">
          <button type="button" className="ap-outline-button" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="ap-primary-button">
            Submit &amp; pay {formatAmount(price)}
          </button>
        </div>
      </form>
    </Modal>
  );
}

/* Page */

export default function SecondOpinion({ initialRequests = [], uploadDocument = defaultUpload }) {
  // Requests made through the full-page flow appear on top.
  const [requests, setRequests] = useState(() => [...getSubmittedSecondOpinions(), ...initialRequests]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [patientFilter, setPatientFilter] = useState("All");
  const [sort, setSort] = useState("All");
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState("");

  const closeModal = useCallback(() => setModal(null), []);
  const closeToast = useCallback(() => setToast(""), []);

  const selected = modal?.ref && requests.find((item) => item.ref === modal.ref);

  const query = search.trim().toLowerCase();
  const visible = requests
    .filter(
      (item) =>
        (statusFilter === "All" || item.status === statusFilter) &&
        (patientFilter === "All" || item.relation === patientFilter) &&
        (sort === "All" || inDateRange(item.date, sort)) &&
        (!query ||
          [item.title, item.orderedBy, item.patient, item.ref, item.type]
            .some((value) => value.toLowerCase().includes(query)))
    )
    .sort((a, b) => b.date.localeCompare(a.date));

  const updateRequest = (ref, changes) =>
    setRequests((list) => list.map((item) => (item.ref === ref ? { ...item, ...changes } : item)));

  const openRequest = (item) => {
    const view = item.status === "Ready" ? "view" : "track";
    setModal({ type: view, ref: item.ref });
  };

  const handleDownloadFile = (file) => {
    downloadText(`${file.name.replace(/\.[^.]+$/, "")}.txt`, [
      "LAKSHMEE FOUNDATION HOSPITAL",
      file.name,
      file.meta,
    ]);
    setToast(`${file.name} downloaded`);
  };

  const handleViewFile = (file) => {
    if (file.url) {
      window.open(file.url, "_blank", "noopener");
      return;
    }
    setToast("Preview isn't available for this file");
  };

  const handleUploaded = (file) => {
    const request = selected;
    const doc = {
      name: file.name,
      meta: `Uploaded by you · ${Math.max(0.1, file.size / (1024 * 1024)).toFixed(1)} MB`,
      url: URL.createObjectURL(file),
    };
    const resolvesRequest = modal.resolves && request.status === "More documents needed";
    updateRequest(request.ref, {
      documents: [...request.documents, doc],
      ...(resolvesRequest ? { status: "Under review", requiredDocument: null } : {}),
    });
    setModal({ type: "track", ref: request.ref });
    setToast(resolvesRequest ? "Document uploaded. Your review has resumed" : "Document added");
  };

  const handleCancel = () => {
    updateRequest(selected.ref, { status: "Cancelled" });
    setModal({ type: "track", ref: selected.ref });
    setToast(`Request cancelled. ${formatAmount(selected.paid)} will be refunded in 5–7 working days`);
  };

  const handleNewRequest = (form) => {
    const patient = PATIENTS.find((item) => item.name === form.patient);
    const ref = `LF-26-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
    const submitted = formatShortDate(new Date());
    setRequests((list) => [
      {
        ref,
        title: `${form.specialty} - ${form.question.trim().slice(0, 40)}${form.question.trim().length > 40 ? "…" : ""}`,
        type: form.type,
        orderedBy: "Self referred",
        department: form.specialty,
        date: today(),
        submitted,
        patient: patient.name,
        relation: patient.relation,
        status: "Under review",
        paid: form.price,
        specialist: null,
        documents: [],
      },
      ...list,
    ]);
    setStatusFilter("All");
    closeModal();
    setToast("Request submitted. We'll assign a specialist shortly");
  };

  return (
    <>
      <Navbar />
      <div className="patient-appointments ap-page prx-page so-page">
        <Sidebar active="Second opinion" />

        <main className="pa-main so-main">
          {requests.length === 0 ? (
            <section className="ae-empty so-empty">
              <h1 className="ae-empty-title">No second opinion requests yet</h1>
              <p className="ae-empty-text">
                When you'd like an expert's independent review of a diagnosis or
                treatment plan, start a request. Your reports and family members
                are already here, nothing to re-enter.
              </p>
              <button
                type="button"
                className="ae-empty-button"
                onClick={() => setModal({ type: "new" })}
              >
                Request a second opinion
              </button>
            </section>
          ) : (
            <>
              <div className="so-toolbar">
                <label className="pa-search so-search">
                  <input
                    type="text"
                    placeholder="Search by medicine, doctor or patient name"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    aria-label="Search second opinion requests"
                  />
                  <Icon name="search" size={20} />
                </label>
                <div className="so-toolbar-right">
                  <FilterMenu label="Status" value={statusFilter} onChange={setStatusFilter} options={STATUS_OPTIONS} hideAllValue />
                  <FilterMenu label="Patient" value={patientFilter} onChange={setPatientFilter} options={PATIENT_OPTIONS} />
                  <FilterMenu label="Sort" value={sort} onChange={setSort} options={SORT_OPTIONS} align="right" />
                  <button className="so-new" onClick={() => setModal({ type: "new" })}>
                    New request
                  </button>
                </div>
              </div>

              {visible.length > 0 ? (
                <div className="pa-table-wrapper">
                  <table className="pa-table so-table">
                    <thead>
                      <tr>
                        <th>FOR</th>
                        <th>ORDERED BY</th>
                        <th>DATE</th>
                        <th>PATIENT</th>
                        <th>REFERENCE ID</th>
                        <th>STATUS</th>
                        <th>ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visible.map((item) => (
                        <tr key={item.ref}>
                          <td>
                            <div className="pa-doctor-cell">
                              <span className="pa-cell-primary so-for">{item.title}</span>
                              <span className="pa-cell-secondary">{item.type}</span>
                            </div>
                          </td>
                          <td>
                            <div className="pa-doctor-cell">
                              <span className="pa-cell-primary">{item.orderedBy}</span>
                              <span className="pa-cell-secondary">{item.department}</span>
                            </div>
                          </td>
                          <td>
                            <span className="pa-cell-primary">{formatDate(item.date)}</span>
                          </td>
                          <td>
                            <div className="pa-patient-cell">
                              <span className="pa-patient-name">{item.patient}</span>
                              <span className={`pa-patient-relation ${item.relation === "Family" ? "is-family" : ""}`}>
                                <Icon name={item.relation === "Family" ? "family" : "user"} size={11} />
                                {item.relation}
                              </span>
                            </div>
                          </td>
                          <td>
                            <span className="pa-consultation-type">{item.ref}</span>
                          </td>
                          <td>
                            <StatusBadge status={item.status} />
                          </td>
                          <td>
                            <button
                              className="pa-action-link"
                              onClick={() =>
                                item.status === "More documents needed"
                                  ? setModal({ type: "track", ref: item.ref })
                                  : openRequest(item)
                              }
                            >
                              {actionFor(item.status)}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <section className="ae-empty so-empty">
                  <h2 className="ae-empty-title">No requests match your filters</h2>
                  <button
                    type="button"
                    className="ae-empty-button"
                    onClick={() => {
                      setSearch("");
                      setStatusFilter("All");
                      setPatientFilter("All");
                      setSort("All");
                    }}
                  >
                    Clear filters
                  </button>
                </section>
              )}
            </>
          )}
        </main>

        {modal?.type === "view" && selected && (
          <OpinionView request={selected} onClose={closeModal} onDownload={handleDownloadFile} />
        )}

        {modal?.type === "track" && selected && (
          <TrackView
            request={selected}
            onClose={closeModal}
            onAddDocuments={(resolves) => setModal({ type: "upload", ref: selected.ref, resolves })}
            onViewFile={handleViewFile}
            onDownloadFile={handleDownloadFile}
            onDownloadSummary={() => {
              downloadText(`case-summary-${selected.ref}.txt`, caseSummaryLines(selected));
              setToast("Case summary downloaded");
            }}
            onCancel={() => setModal({ type: "cancel", ref: selected.ref })}
          />
        )}

        {modal?.type === "upload" && selected && (
          <UploadDialog
            title={modal.resolves ? selected.requiredDocument?.title || "Upload document" : "Add documents"}
            subtitle="Add reports or scans the specialist should review."
            onClose={() => setModal({ type: "track", ref: selected.ref })}
            onUploaded={handleUploaded}
            upload={uploadDocument}
          />
        )}

        {modal?.type === "cancel" && selected && (
          <ConfirmDialog
            title="Cancel this request?"
            subtitle={`${selected.title} · Ref ${selected.ref}`}
            secondaryLabel="Keep request"
            primaryLabel="Cancel & refund"
            onSecondary={() => setModal({ type: "track", ref: selected.ref })}
            onPrimary={handleCancel}
            onClose={() => setModal({ type: "track", ref: selected.ref })}
          >
            <p>
              {formatAmount(selected.paid)} will be refunded to your original
              payment method in 5–7 working days.
            </p>
          </ConfirmDialog>
        )}

        {modal?.type === "new" && (
          <NewRequestModal onClose={closeModal} onSubmit={handleNewRequest} />
        )}

        <Toast message={toast} onClose={closeToast} />
      </div>
      <Footer />
    </>
  );
}
