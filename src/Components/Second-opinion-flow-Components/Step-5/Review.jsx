import React, { useState } from "react";
import { ArrowRight, Check, ShieldCheck, SquarePen } from "lucide-react";
import { COUPONS } from "../flowData";
import { checkCoupon, documentLabels, formatAmount, priceFor, specialistPlan } from "../flowSummary";

const CONSENTS = [
  "The information I've provided is accurate to the best of my knowledge, and these records relate to the patient named above.",
  "I understand this is a review of records, not a substitute for a physical examination or emergency care, and does not create an ongoing doctor patient relationship.",
  "I consent to Lakshmee securely processing my documents for this opinion, in line with the Privacy Policy and Terms of Use.",
];

function SummaryBlock({ title, onEdit, children }) {
  return (
    <section className="sof-summary-block">
      <header>
        <h3>{title}</h3>
        <button type="button" className="sof-icon-button" onClick={onEdit} aria-label={`Edit ${title}`}>
          <SquarePen size={16} />
        </button>
      </header>
      {children}
    </section>
  );
}

function Detail({ label, value }) {
  if (!value) return null;
  return (
    <div className="sof-detail">
      <span>{label}</span>
      <p>{value}</p>
    </div>
  );
}

export default function Review({ form, patient, patientAge, onEdit, onChange, onSubmit, busy }) {
  const [code, setCode] = useState(form.coupon?.code || "");
  const [couponError, setCouponError] = useState("");

  const plan = specialistPlan(form);
  const documents = documentLabels(form);
  const price = priceFor(form.coupon);
  const allConsented = CONSENTS.every((_, index) => form.consents[index]);

  const applyCoupon = (value = code) => {
    setCode(value);
    if (!value.trim()) {
      setCouponError("Enter a code first.");
      return;
    }
    const { coupon, error } = checkCoupon(value, form, patientAge);
    setCouponError(error || "");
    onChange({ coupon: coupon || null });
  };

  const toggleConsent = (index) =>
    onChange({ consents: { ...form.consents, [index]: !form.consents[index] } });

  return (
    <div className="sof-review">
      <div className="sof-review-intro">
        <h1>One last look<br />before you pay.</h1>
        <p>
          Check everything's right. You can edit any section, nothing is sent until you confirm.
          <br />
          You're only charged once there's no subscription. Your card details are encrypted and never stored by Lakshmee.
        </p>
      </div>

      <div className="sof-review-grid">
        <div className="sof-review-main">
          <div className="sof-summary">
            <SummaryBlock title="Your case" onEdit={() => onEdit(0)}>
              <Detail label="For" value={`${patient.name} · ${patient.label}`} />
              <Detail label="Specialty" value={form.specialty} />
              <Detail label="Condition" value={form.condition} />
              <Detail label="Treating doctor" value={[form.doctor, form.hospital].filter(Boolean).join(" · ")} />
              <Detail label="Your description" value={form.description} />
            </SummaryBlock>

            <SummaryBlock title="History & medications" onEdit={() => onEdit(1)}>
              <Detail label="Medications" value={form.medications || "None listed"} />
              <Detail label="History" value={form.history || "None listed"} />
              <Detail label="Age · Gender" value={[form.age && `${form.age} yrs`, form.gender].filter(Boolean).join(" · ")} />
            </SummaryBlock>

            <SummaryBlock title={`Documents (${documents.length})`} onEdit={() => onEdit(2)}>
              {documents.length ? (
                <div className="sof-tags">
                  {documents.map((name) => (
                    <span key={name} className="sof-tag">{name}</span>
                  ))}
                </div>
              ) : (
                <p className="sof-muted">No documents yet, you can add them after submitting.</p>
              )}
            </SummaryBlock>

            <SummaryBlock title="Specialist & plan" onEdit={() => onEdit(3)}>
              <Detail label="Specialist" value={plan.label} />
              <Detail label="Plan" value="Written specialist review" />
            </SummaryBlock>
          </div>

          <section className="sof-coupon">
            <h3>Have a coupon or assistance code?</h3>
            <form
              className="sof-coupon-row"
              onSubmit={(event) => {
                event.preventDefault();
                applyCoupon();
              }}
            >
              <input
                type="text"
                className="sof-input"
                placeholder="ENTER CODE"
                aria-label="Coupon or assistance code"
                value={code}
                onChange={(event) => {
                  setCode(event.target.value.toUpperCase());
                  setCouponError("");
                }}
              />
              <button type="submit" className="sof-outline">Apply</button>
            </form>
            {couponError && <span className="sof-error">{couponError}</span>}
            {form.coupon && !couponError && (
              <span className="sof-success">
                <Check size={14} /> {form.coupon.code} applied · {form.coupon.perk || form.coupon.label}
                <button type="button" className="sof-link" onClick={() => { setCode(""); onChange({ coupon: null }); }}>
                  Remove
                </button>
              </span>
            )}
            <div className="sof-coupon-chips">
              {COUPONS.map((coupon) => (
                <button key={coupon.code} type="button" className="sof-coupon-chip" onClick={() => applyCoupon(coupon.code)}>
                  <strong>{coupon.code}</strong> {coupon.label}
                </button>
              ))}
            </div>
          </section>

          <section className="sof-consent">
            <h3>Consent &amp; declaration</h3>
            <p className="sof-muted">Please confirm the following before submitting.</p>
            {CONSENTS.map((text, index) => (
              <label key={text} className="sof-check">
                <input type="checkbox" checked={Boolean(form.consents[index])} onChange={() => toggleConsent(index)} />
                <span className="sof-checkbox" aria-hidden="true">
                  {form.consents[index] && <Check size={12} strokeWidth={3} />}
                </span>
                <span>{text}</span>
              </label>
            ))}
          </section>

          <div className="sof-submit-row">
            <button type="button" className="sof-primary" onClick={onSubmit} disabled={!allConsented || busy}>
              {busy ? "Processing payment…" : "Confirm & continue to payment"}
              {!busy && <ArrowRight size={16} />}
            </button>
            {!allConsented && <span className="sof-hint">Tick all three to continue.</span>}
          </div>
        </div>

        <aside className="sof-order" aria-label="Order summary">
          <p className="sof-order-title">Order summary</p>
          <div className="sof-order-row">
            <span>Written specialist review</span>
            <strong>{formatAmount(price.subtotal)}</strong>
          </div>
          <div className="sof-order-row">
            <span>Response time</span>
            <strong>{plan.responseTime}</strong>
          </div>
          {price.discount > 0 && (
            <div className="sof-order-row sof-order-row--discount">
              <span>{form.coupon.code}</span>
              <strong>− {formatAmount(price.discount)}</strong>
            </div>
          )}
          {form.coupon?.perk && (
            <div className="sof-order-row">
              <span>{form.coupon.code}</span>
              <strong>{form.coupon.perk}</strong>
            </div>
          )}
          <div className="sof-order-total">
            <span>Total payable</span>
            <strong>{formatAmount(price.total)}</strong>
          </div>
          <p className="sof-order-note">
            <ShieldCheck size={14} /> Full refund if we can't provide an opinion for your case.
          </p>
        </aside>
      </div>
    </div>
  );
}
