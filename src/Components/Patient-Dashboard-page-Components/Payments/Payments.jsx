import React, { useCallback, useState } from "react";
import "../PatientAppointments/PatientAppointments.css";
import "../AppointmentsEmpty/AppointmentsEmpty.css";
import "../Appointments/Appointments.css";
import "./Payments.css";
import Navbar from "../../Home-page-Components/Navbar/Navbar";
import Footer from "../../Home-page-Components/Footer/HomeFooter";
import { Icon, Sidebar } from "../PatientAppointments/PatientAppointments";
import { Modal, Toast } from "../Appointments/Appointments";
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";
import FilterMenu from "../FilterMenu/FilterMenu";

export const samplePayments = [
  {
    id: "LKM-26-A479-2207",
    description: "First consultation · Dr. Menon",
    method: "UPI",
    methodDetail: "····4210",
    date: "2 May 2026",
    amount: 841,
    status: "Failed",
  },
  {
    id: "LKM-26-A480-2208",
    description: "Second opinion · Dr. Kashyap",
    method: "Card",
    methodDetail: "····7781",
    date: "5 May 2026",
    amount: 1200,
    status: "Paid",
  },
  {
    id: "LKM-26-A402-1983",
    description: "Cancelled · Dr. Reddy",
    note: "Refund initiated 2 May",
    method: "UPI",
    methodDetail: "····4210",
    date: "18 Apr 2026",
    amount: 841,
    status: "Refund processing",
    refund: { initiated: "2 May 2026", expected: "9 May 2026" },
  },
  {
    id: "LKM-26-A311-1720",
    description: "Lipid Profile + Echo",
    note: "Diagnostics package",
    method: "Wallet",
    methodDetail: "Paytm",
    date: "12 Mar 2026",
    amount: 2087,
    status: "Paid",
  },
];

const STATUS_OPTIONS = [
  { value: "All", label: "All" },
  { value: "Paid", label: "Paid" },
  { value: "Failed", label: "Failed" },
  { value: "Refund processing", label: "Refund processing" },
  { value: "Refunded", label: "Refunded" },
];

const formatAmount = (amount) =>
  `₹${amount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

const statusClass = (status) => status.toLowerCase().replace(/\s+/g, "-");

function downloadInvoice(payment) {
  const invoice = [
    "LAKSHMEE FOUNDATION HOSPITAL",
    `Invoice ${payment.id}`,
    "",
    `Date:      ${payment.date}`,
    `Item:      ${payment.description}${payment.note ? ` (${payment.note})` : ""}`,
    `Method:    ${payment.method} ${payment.methodDetail || ""}`.trimEnd(),
    `Amount:    ${formatAmount(payment.amount)}`,
    `Status:    ${payment.status}`,
  ].join("\n");

  const url = URL.createObjectURL(new Blob([invoice], { type: "text/plain" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `${payment.id}.txt`;
  link.click();
  URL.revokeObjectURL(url);
}

function StatusBadge({ status }) {
  return (
    <span className={`pm-status pm-status--${statusClass(status)}`}>
      {status === "Failed" && <Icon name="close" size={11} />}
      {status === "Paid" && <span className="pm-status-dot" aria-hidden="true" />}
      {status}
    </span>
  );
}

function PaymentsTable({ payments, onRetry, onDownload, onRefund }) {
  return (
    <div className="pa-table-wrapper">
      <table className="pa-table pm-table">
        <thead>
          <tr>
            <th>DESCRIPTION</th>
            <th>METHOD</th>
            <th>DATE</th>
            <th>AMOUNT</th>
            <th>STATUS</th>
            <th>INVOICE</th>
          </tr>
        </thead>

        <tbody>
          {payments.map((payment) => (
            <tr key={payment.id}>
              <td>
                <div className="pa-doctor-cell">
                  <span className="pa-cell-primary">{payment.description}</span>
                  <span className="pa-cell-secondary">{payment.note || payment.id}</span>
                </div>
              </td>
              <td>
                <div className="pa-doctor-cell">
                  <span className="pa-cell-primary">{payment.method}</span>
                  <span className="pa-cell-secondary">{payment.methodDetail}</span>
                </div>
              </td>
              <td>
                <span className="pa-cell-primary">{payment.date}</span>
              </td>
              <td>
                <span className="pm-amount">{formatAmount(payment.amount)}</span>
              </td>
              <td>
                <StatusBadge status={payment.status} />
              </td>
              <td>
                {payment.status === "Failed" && (
                  <button className="pm-retry" onClick={() => onRetry(payment)}>
                    Retry
                  </button>
                )}
                {payment.status === "Paid" && (
                  <button
                    className="pm-icon-button"
                    onClick={() => onDownload(payment)}
                    aria-label={`Download invoice ${payment.id}`}
                    title="Download invoice"
                  >
                    <Icon name="download" size={15} />
                  </button>
                )}
                {(payment.status === "Refund processing" ||
                  payment.status === "Refunded") && (
                  <button
                    className="pm-icon-button"
                    onClick={() => onRefund(payment)}
                    aria-label={`Refund status for ${payment.id}`}
                    title="Refund status"
                  >
                    <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
                      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.7" />
                      <path d="M12 7v5l3 2" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                    </svg>
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RefundDetails({ payment, onClose }) {
  const steps = [
    { label: "Refund initiated", date: payment.refund?.initiated, done: true },
    {
      label: `Sent to your ${payment.method} ${payment.methodDetail || ""}`.trim(),
      date: payment.status === "Refunded" ? payment.refund?.expected : "In progress",
      done: payment.status === "Refunded",
    },
    {
      label: "Credited",
      date: payment.status === "Refunded" ? payment.refund?.expected : `Expected by ${payment.refund?.expected}`,
      done: payment.status === "Refunded",
    },
  ];

  return (
    <Modal title="Refund status" onClose={onClose}>
      <p className="ap-modal-sub">
        {formatAmount(payment.amount)} for {payment.description}. Refunds reach
        your original payment method in 5–7 working days.
      </p>
      <ol className="pm-timeline">
        {steps.map((step) => (
          <li key={step.label} className={step.done ? "is-done" : ""}>
            <span className="pm-timeline-dot" aria-hidden="true" />
            <span className="pa-cell-primary">{step.label}</span>
            <span className="pa-cell-secondary">{step.date}</span>
          </li>
        ))}
      </ol>
    </Modal>
  );
}

export default function Payments({ initialPayments = [], onBookConsultation }) {
  const [payments, setPayments] = useState(initialPayments);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState("");
  const closeModal = useCallback(() => setModal(null), []);
  const closeToast = useCallback(() => setToast(""), []);

  const query = search.trim().toLowerCase();
  const visible = payments.filter(
    (payment) =>
      (statusFilter === "All" || payment.status === statusFilter) &&
      (!query ||
        [payment.description, payment.note, payment.id, payment.method]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(query)))
  );

  const handleDownload = (payment) => {
    downloadInvoice(payment);
    setToast(`Invoice ${payment.id} downloaded`);
  };

  const handleRetry = (payment) => {
    setPayments((list) =>
      list.map((item) => (item.id === payment.id ? { ...item, status: "Paid" } : item))
    );
    closeModal();
    setToast(`Payment of ${formatAmount(payment.amount)} successful`);
  };

  return (
    <>
      <Navbar />
      <div className="patient-appointments ap-page pm-page">
        <Sidebar active="Payments" />

        <main className="pa-main pm-main">
          {payments.length === 0 ? (
            <section className="ae-empty pm-empty">
              <h1 className="ae-empty-title">No payment history</h1>
              <p className="ae-empty-text">
                Your consultation and diagnostic payments, invoices and refunds
                will be listed here.
              </p>
              <button
                type="button"
                className="ae-empty-button"
                onClick={onBookConsultation}
              >
                Book a consultation
              </button>
            </section>
          ) : (
            <>
              <div className="pm-toolbar">
                <label className="pa-search pm-search">
                  <input
                    type="text"
                    placeholder="Search by medicine, doctor or patient name"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    aria-label="Search payments"
                  />
                  <Icon name="search" size={20} />
                </label>
                <FilterMenu
                  label="Status"
                  value={statusFilter}
                  onChange={setStatusFilter}
                  options={STATUS_OPTIONS}
                  hideAllValue
                  align="right"
                />
              </div>

              {visible.length > 0 ? (
                <PaymentsTable
                  payments={visible}
                  onRetry={(payment) => setModal({ type: "retry", payment })}
                  onDownload={handleDownload}
                  onRefund={(payment) => setModal({ type: "refund", payment })}
                />
              ) : (
                <section className="ae-empty pm-empty">
                  <h2 className="ae-empty-title">No payments match your filters</h2>
                  <button
                    type="button"
                    className="ae-empty-button"
                    onClick={() => {
                      setSearch("");
                      setStatusFilter("All");
                    }}
                  >
                    Clear filters
                  </button>
                </section>
              )}
            </>
          )}
        </main>

        {modal?.type === "retry" && (
          <ConfirmDialog
            title="Retry payment?"
            subtitle={`${modal.payment.description} · ${modal.payment.id}`}
            secondaryLabel="Cancel"
            primaryLabel={`Pay ${formatAmount(modal.payment.amount)}`}
            onSecondary={closeModal}
            onPrimary={() => handleRetry(modal.payment)}
            onClose={closeModal}
          >
            <p>
              We'll charge {formatAmount(modal.payment.amount)} to your{" "}
              {modal.payment.method} {modal.payment.methodDetail}. If the earlier
              attempt was debited, it is refunded automatically.
            </p>
          </ConfirmDialog>
        )}

        {modal?.type === "refund" && (
          <RefundDetails payment={modal.payment} onClose={closeModal} />
        )}

        <Toast message={toast} onClose={closeToast} />
      </div>
      <Footer />
    </>
  );
}
