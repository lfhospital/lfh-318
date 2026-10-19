import React, { useCallback, useEffect, useRef, useState } from "react";
import "../PatientAppointments/PatientAppointments.css";
import "../AppointmentsEmpty/AppointmentsEmpty.css";
import "../Appointments/Appointments.css";
import "./Prescriptions.css";
import Navbar from "../../Home-page-Components/Navbar/Navbar";
import Footer from "../../Home-page-Components/Footer/HomeFooter";
import {
  Icon,
  PATIENT_OPTIONS,
  Sidebar,
} from "../PatientAppointments/PatientAppointments";
import { Modal, Toast } from "../Appointments/Appointments";
import UploadDialog, { defaultUpload } from "../UploadDialog/UploadDialog";
import FilterMenu from "../FilterMenu/FilterMenu";
import { formatShortDate } from "../../../dates";

const TABS = [
  { key: "All", label: "All" },
  { key: "Hospital", label: "Issued by the hospital" },
  { key: "Uploaded", label: "Self uploaded" },
];

const PATIENTS = [
  { name: "Rohan Iyer", relation: "Me" },
  { name: "Shreya Iyer", relation: "Family" },
];

const EMPTY_COPY = {
  All: {
    title: "No prescriptions yet",
    showBooking: true,
  },
  Hospital: {
    title: "No doctor issued prescriptions",
    showBooking: true,
  },
  Uploaded: {
    title: "No uploaded prescriptions",
    showBooking: false,
  },
};

const today = () => new Date().toISOString().slice(0, 10);

const formatDate = (value) =>
  value === today()
    ? "Today"
    : formatShortDate(new Date(`${value}T00:00:00`));

export const samplePrescriptions = [
  {
    id: 1,
    title: "Cardiology · Hypertension",
    doctor: "Dr. A. Menon",
    department: "Cardiology",
    date: today(),
    patient: "Rohan Iyer",
    relation: "Me",
    source: "Hospital",
    medicines: [
      { name: "Amlodipine 5 mg", dosage: "1 tablet every morning", days: "30 days" },
      { name: "Telmisartan 40 mg", dosage: "1 tablet at night", days: "30 days" },
    ],
  },
  {
    id: 2,
    title: "Cardiology · Hypertension",
    doctor: "Dr. A. Menon",
    department: "Cardiology",
    date: "2026-05-02",
    patient: "Rohan Iyer",
    relation: "Me",
    source: "Hospital",
    medicines: [
      { name: "Amlodipine 5 mg", dosage: "1 tablet every morning", days: "30 days" },
    ],
  },
  {
    id: 3,
    title: "Cardiology · Hypertension",
    doctor: "Dr. A. Menon",
    department: "Cardiology",
    date: "2026-05-02",
    patient: "Shreya Iyer",
    relation: "Family",
    source: "Hospital",
    medicines: [
      { name: "Metoprolol 25 mg", dosage: "1 tablet twice daily", days: "15 days" },
    ],
  },
  {
    id: 4,
    title: "Diabetes — Apollo Clinic",
    doctor: "Dr. Sharma",
    date: "2026-05-02",
    patient: "Rohan Iyer",
    relation: "Me",
    source: "Uploaded",
    fileName: "Diabetes — Apollo Clinic.jpg",
    fileType: "JPG",
    fileSize: 2.1 * 1024 * 1024,
  },
];

const medicineText = (item) =>
  Array.isArray(item.medicines)
    ? item.medicines.map((medicine) => medicine.name).join(", ")
    : item.medicines || "";

function downloadPrescription(item) {
  if (item.fileUrl) {
    const link = document.createElement("a");
    link.href = item.fileUrl;
    link.download = item.fileName;
    link.click();
    return;
  }

  const lines = [
    "LAKSHMEE FOUNDATION HOSPITAL",
    `Prescription · ${item.title}`,
    "",
    `Ordered by: ${item.doctor} (${item.department})`,
    `Patient:    ${item.patient}`,
    `Date:       ${formatDate(item.date)}`,
    "",
    ...(item.medicines || []).map(
      (medicine) => `- ${medicine.name}: ${medicine.dosage}, ${medicine.days}`
    ),
  ];
  const url = URL.createObjectURL(new Blob([lines.join("\n")], { type: "text/plain" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `prescription-${item.id}.txt`;
  link.click();
  URL.revokeObjectURL(url);
}

/* Toolbar */

function Toolbar({ search, setSearch, patientFilter, setPatientFilter, onUpload }) {
  return (
    <div className="prx-toolbar">
      <label className="pa-search prx-search">
        <input
          type="text"
          placeholder="Search by medicine, doctor or patient name"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          aria-label="Search by medicine, doctor or patient name"
        />
        <Icon name="search" size={20} />
      </label>

      <div className="prx-toolbar-actions">
        <button className="prx-tool-button" onClick={onUpload}>
          <Icon name="upload" size={16} />
          Upload prescription
        </button>

        <FilterMenu
          label="Patient"
          value={patientFilter}
          onChange={setPatientFilter}
          options={PATIENT_OPTIONS}
          align="right"
          className="prx-patient-menu"
        />
      </div>
    </div>
  );
}

/* Tabs */

function Tabs({ activeTab, setActiveTab }) {
  return (
    <div className="prx-tabs" role="tablist">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          role="tab"
          aria-selected={activeTab === tab.key}
          className={activeTab === tab.key ? "is-active" : ""}
          onClick={() => setActiveTab(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

/* Empty state */

function EmptyState({ activeTab, hasFilters, onClearFilters, onBookConsultation }) {
  if (hasFilters) {
    return (
      <section className="ae-empty prx-empty">
        <h2 className="ae-empty-title">No prescriptions match your search</h2>
        <p className="ae-empty-text">
          Try a different medicine, doctor or patient.
        </p>
        <button type="button" className="ae-empty-button" onClick={onClearFilters}>
          Clear search
        </button>
      </section>
    );
  }

  const copy = EMPTY_COPY[activeTab];

  return (
    <section className="ae-empty prx-empty">
      <h2 className="ae-empty-title">{copy.title}</h2>
      <p className="ae-empty-text">
        Prescriptions from your consultations will appear here, ready to
        download or share with any pharmacy.
      </p>
      {copy.showBooking && (
        <button type="button" className="ae-empty-button" onClick={onBookConsultation}>
          Book a consultation
        </button>
      )}
    </section>
  );
}

/* Table */

const formatSize = (bytes) =>
  bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;

// "JPG · 2.1 MB · Dr. Sharma"
const uploadMeta = (item) =>
  [item.fileType, item.fileSize && formatSize(item.fileSize), item.doctor]
    .filter(Boolean)
    .join(" · ");

/* ⋮ menu for self-uploaded prescriptions */

function RowMenu({ item, onRename, onDelete }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onPointer = (event) => {
      if (!wrapRef.current?.contains(event.target)) setOpen(false);
    };
    const onKey = (event) => event.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const choose = (action) => {
    setOpen(false);
    action(item);
  };

  return (
    <div className="prx-menu" ref={wrapRef}>
      <button
        className="prx-icon-button"
        onClick={() => setOpen((value) => !value)}
        aria-label={`More actions for ${item.title}`}
        aria-haspopup="menu"
        aria-expanded={open}
        title="More"
      >
        <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
          <circle cx="12" cy="5" r="1.6" fill="currentColor" />
          <circle cx="12" cy="12" r="1.6" fill="currentColor" />
          <circle cx="12" cy="19" r="1.6" fill="currentColor" />
        </svg>
      </button>
      {open && (
        <div className="prx-menu-list" role="menu">
          <button role="menuitem" onClick={() => choose(onRename)}>
            <Icon name="edit" size={14} />
            Rename
          </button>
          <button role="menuitem" onClick={() => choose(onDelete)}>
            <Icon name="trash" size={14} />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

function PrescriptionTable({ prescriptions, onView, onDownload, onRename, onDelete }) {
  return (
    <div className="pa-table-wrapper">
      <table className="pa-table prx-table">
        <thead>
          <tr>
            <th>PRESCRIPTION</th>
            <th>ORDERED BY</th>
            <th>DATE</th>
            <th>PATIENT</th>
            <th>ACTIONS</th>
          </tr>
        </thead>

        <tbody>
          {prescriptions.map((item) => (
            <tr key={item.id}>
              <td>
                <span className="prx-title prx-ellipsis" title={item.title}>
                  {item.title}
                </span>
                {item.source === "Uploaded" && (
                  <span className="prx-self-tag">
                    <Icon name="upload" size={11} />
                    Self uploaded
                  </span>
                )}
              </td>
              <td>
                {item.source === "Hospital" ? (
                  <div className="pa-doctor-cell">
                    <span className="pa-cell-primary">{item.doctor}</span>
                    <span className="pa-cell-secondary">{item.department}</span>
                  </div>
                ) : (
                  <div className="pa-doctor-cell">
                    <span className="pa-cell-primary">Uploaded by you</span>
                    <span className="pa-cell-secondary prx-ellipsis">{uploadMeta(item)}</span>
                  </div>
                )}
              </td>
              <td>
                <span className="pa-cell-primary">{formatDate(item.date)}</span>
              </td>
              <td>
                <div className="pa-patient-cell">
                  <span className="pa-patient-name">{item.patient}</span>
                  <span
                    className={`pa-patient-relation ${
                      item.relation === "Family" ? "is-family" : ""
                    }`}
                  >
                    <Icon
                      name={item.relation === "Family" ? "family" : "user"}
                      size={11}
                    />
                    {item.relation}
                  </span>
                </div>
              </td>
              <td>
                <div className="prx-actions">
                  <button
                    className="prx-icon-button"
                    onClick={() => onView(item)}
                    aria-label={`View ${item.title}`}
                    title="View"
                  >
                    <Icon name="eye" size={14} />
                  </button>
                  <button
                    className="prx-icon-button"
                    onClick={() => onDownload(item)}
                    aria-label={`Download ${item.title}`}
                    title="Download"
                  >
                    <Icon name="download" size={14} />
                  </button>
                  {item.source === "Uploaded" && (
                    <RowMenu item={item} onRename={onRename} onDelete={onDelete} />
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* Rename dialog */

function RenameModal({ item, onClose, onSave }) {
  const [title, setTitle] = useState(item.title);
  const trimmed = title.trim();

  return (
    <Modal title="Rename prescription" onClose={onClose}>
      <form
        className="prx-rename"
        onSubmit={(event) => {
          event.preventDefault();
          if (trimmed) onSave(trimmed);
        }}
      >
        <label className="prx-field prx-field--full">
          <span>Name</span>
          <input
            type="text"
            value={title}
            maxLength={80}
            onChange={(event) => setTitle(event.target.value)}
            autoFocus
            onFocus={(event) => event.target.select()}
          />
        </label>
        <div className="ap-modal-actions">
          <button type="button" className="ap-outline-button" onClick={onClose}>
            Cancel
          </button>
          <button
            type="submit"
            className="ap-primary-button"
            disabled={!trimmed || trimmed === item.title}
          >
            Save
          </button>
        </div>
      </form>
    </Modal>
  );
}

/* Prescription preview */

function PrescriptionPreview({ item, onClose, onDownload }) {
  return (
    <Modal title="Prescription" onClose={onClose}>
      <p className="ap-modal-sub">
        {item.title} · {item.doctor} · {formatDate(item.date)} · for {item.patient}
      </p>
      <ul className="ap-rx-list">
        {(item.medicines || []).map((medicine) => (
          <li key={medicine.name}>
            <span className="pa-cell-primary">{medicine.name}</span>
            <span className="pa-cell-secondary">
              {medicine.dosage} · {medicine.days}
            </span>
          </li>
        ))}
      </ul>
      <div className="ap-modal-actions">
        <button className="ap-primary-button" onClick={() => onDownload(item)}>
          <Icon name="download" size={16} />
          Download
        </button>
      </div>
    </Modal>
  );
}

/* Page */

export default function Prescriptions({
  initialPrescriptions = [],
  onBookConsultation,
  uploadPrescription = defaultUpload,
  onGoogleDrive,
}) {
  const [prescriptions, setPrescriptions] = useState(initialPrescriptions);
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [patientFilter, setPatientFilter] = useState("Me");
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState("");

  const closeModal = useCallback(() => setModal(null), []);
  const closeToast = useCallback(() => setToast(""), []);

  // Release uploaded file URLs when the page unmounts.
  const latest = useRef(prescriptions);
  latest.current = prescriptions;
  useEffect(
    () => () =>
      latest.current.forEach((item) => item.fileUrl && URL.revokeObjectURL(item.fileUrl)),
    []
  );

  const query = search.trim().toLowerCase();
  const visible = prescriptions.filter(
    (item) =>
      (activeTab === "All" || item.source === activeTab) &&
      (patientFilter === "All" || item.relation === patientFilter) &&
      (!query ||
        [item.title, medicineText(item), item.doctor, item.patient, item.fileName]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(query)))
  );

  const tabHasItems = prescriptions.some(
    (item) => activeTab === "All" || item.source === activeTab
  );
  const hasFilters = tabHasItems && (query !== "" || patientFilter !== "All");

  // Uploads are filed under the patient currently selected in the filter.
  const handleUploaded = (file) => {
    const patient =
      PATIENTS.find((item) => item.relation === patientFilter) || PATIENTS[0];
    const item = {
      id: Date.now(),
      title: file.name.replace(/\.[^.]+$/, ""),
      fileName: file.name,
      fileType: (file.name.split(".").pop() || "").toUpperCase(),
      fileSize: file.size,
      fileUrl: URL.createObjectURL(file),
      date: today(),
      patient: patient.name,
      relation: patient.relation,
      source: "Uploaded",
    };

    setPrescriptions((list) => [item, ...list]);
    if (activeTab === "Hospital") setActiveTab("Uploaded");
    closeModal();
    setToast("Prescription uploaded");
  };

  const handleView = (item) => {
    if (item.fileUrl) {
      window.open(item.fileUrl, "_blank", "noopener");
      return;
    }
    if (item.source === "Uploaded") {
      // Sample uploads have no file attached in this demo build.
      setToast("Preview isn't available for this file");
      return;
    }
    setModal({ type: "view", item });
  };

  const handleRename = (item, title) => {
    setPrescriptions((list) =>
      list.map((entry) => (entry.id === item.id ? { ...entry, title } : entry))
    );
    closeModal();
    setToast("Prescription renamed");
  };

  const handleDownload = (item) => {
    downloadPrescription(item);
    setToast("Prescription downloaded");
  };

  const handleDelete = (item) => {
    setPrescriptions((list) => list.filter((entry) => entry.id !== item.id));
    if (item.fileUrl) URL.revokeObjectURL(item.fileUrl);
    closeModal();
    setToast("Prescription deleted");
  };

  return (
    <>
      <Navbar />
      <div className="patient-appointments ap-page prx-page">
        <Sidebar active="Prescriptions" />

        <main className="pa-main prx-main">
          <Toolbar
            search={search}
            setSearch={setSearch}
            patientFilter={patientFilter}
            setPatientFilter={setPatientFilter}
            onUpload={() => setModal({ type: "upload" })}
          />

          <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

          {visible.length > 0 ? (
            <PrescriptionTable
              prescriptions={visible}
              onView={handleView}
              onDownload={handleDownload}
              onRename={(item) => setModal({ type: "rename", item })}
              onDelete={(item) => setModal({ type: "delete", item })}
            />
          ) : (
            <EmptyState
              activeTab={activeTab}
              hasFilters={hasFilters}
              onClearFilters={() => {
                setSearch("");
                setPatientFilter("All");
              }}
              onBookConsultation={onBookConsultation}
            />
          )}
        </main>

        {modal?.type === "upload" && (
          <UploadDialog
            title="Add your prescription"
            subtitle="Save your prescriptions for easy access whenever you need them."
            onClose={closeModal}
            onUploaded={handleUploaded}
            upload={uploadPrescription}
            onGoogleDrive={onGoogleDrive}
          />
        )}

        {modal?.type === "view" && (
          <PrescriptionPreview
            item={modal.item}
            onClose={closeModal}
            onDownload={handleDownload}
          />
        )}

        {modal?.type === "rename" && (
          <RenameModal
            item={modal.item}
            onClose={closeModal}
            onSave={(title) => handleRename(modal.item, title)}
          />
        )}

        {modal?.type === "delete" && (
          <Modal title="Delete prescription?" onClose={closeModal}>
            <p className="ap-modal-sub">
              “{modal.item.title}” will be removed from your records. This
              can't be undone.
            </p>
            <div className="ap-modal-actions">
              <button className="ap-outline-button" onClick={closeModal}>
                Keep it
              </button>
              <button
                className="ap-danger-button"
                onClick={() => handleDelete(modal.item)}
              >
                Delete
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
