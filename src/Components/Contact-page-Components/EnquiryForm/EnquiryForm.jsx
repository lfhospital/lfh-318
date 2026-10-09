import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import "./EnquiryForm.css";

const ENQUIRY_EMAIL = "care@lfh.in";

const topics = [
  "Appointments",
  "Billing & payments",
  "Reports & records",
  "Health packages",
  "Feedback",
  "Something else",
];

const emptyForm = { name: "", mobile: "", email: "", topic: "", message: "" };

function validate(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = "Please enter your full name";
  if (form.mobile.length !== 10) errors.mobile = "Enter a 10-digit mobile number";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
    errors.email = "Enter a valid email address";
  if (!form.topic) errors.topic = "Please choose a topic";
  if (!form.message.trim()) errors.message = "Please write a short message";
  return errors;
}

export default function EnquiryForm() {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const update = (field) => (e) => {
    const value =
      field === "mobile" ? e.target.value.replace(/\D/g, "").slice(0, 10) : e.target.value;
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((errs) => ({ ...errs, [field]: undefined }));
    setSent(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) return;

    // No enquiry API yet: hand off to the visitor's email app
    const subject = `Enquiry: ${form.topic} — ${form.name.trim()}`;
    const body = [
      form.message.trim(),
      "",
      `Name: ${form.name.trim()}`,
      `Mobile: +91 ${form.mobile}`,
      `Email: ${form.email.trim()}`,
    ].join("\n");
    window.location.href = `mailto:${ENQUIRY_EMAIL}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  const fieldClass = (field) => `enquiry-input ${errors[field] ? "has-error" : ""}`;

  return (
    <section className="enquiry">
      <div className="enquiry-intro">
        <p className="page-eyebrow">Send an enquiry</p>
        <div className="enquiry-intro-copy">
          <h2>
            Write to us and
            <br />
            we'll be in touch.
          </h2>
          <p>
            No bots, no ticket black-holes. Our patient-care team triages each
            enquiry and routes it to the right specialist.
          </p>
        </div>
      </div>

      <form className="enquiry-form" onSubmit={handleSubmit} noValidate>
        <div className="enquiry-field">
          <label htmlFor="enquiry-name">Full name</label>
          <input
            id="enquiry-name"
            className={fieldClass("name")}
            placeholder="Enter full name"
            autoComplete="name"
            value={form.name}
            onChange={update("name")}
          />
          {errors.name && <span className="enquiry-error">{errors.name}</span>}
        </div>

        <div className="enquiry-row">
          <div className="enquiry-field">
            <label htmlFor="enquiry-mobile">Mobile number</label>
            <div className={`${fieldClass("mobile")} enquiry-phone`}>
              <span>+91</span>
              <input
                id="enquiry-mobile"
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                placeholder="0000000000"
                value={form.mobile}
                onChange={update("mobile")}
              />
            </div>
            {errors.mobile && <span className="enquiry-error">{errors.mobile}</span>}
          </div>

          <div className="enquiry-field">
            <label htmlFor="enquiry-email">Email</label>
            <input
              id="enquiry-email"
              type="email"
              className={fieldClass("email")}
              placeholder="you@email.com"
              autoComplete="email"
              value={form.email}
              onChange={update("email")}
            />
            {errors.email && <span className="enquiry-error">{errors.email}</span>}
          </div>
        </div>

        <div className="enquiry-field">
          <label htmlFor="enquiry-topic">I'm reaching about...</label>
          <div className="enquiry-select-wrap">
            <select
              id="enquiry-topic"
              className={`${fieldClass("topic")} ${form.topic ? "" : "is-placeholder"}`}
              value={form.topic}
              onChange={update("topic")}
            >
              <option value="" disabled>
                Select option
              </option>
              {topics.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <ChevronDown size={20} strokeWidth={1.67} />
          </div>
          {errors.topic && <span className="enquiry-error">{errors.topic}</span>}
        </div>

        <div className="enquiry-field">
          <label htmlFor="enquiry-message">Message</label>
          <textarea
            id="enquiry-message"
            className={fieldClass("message")}
            value={form.message}
            onChange={update("message")}
          />
          {errors.message && <span className="enquiry-error">{errors.message}</span>}
        </div>

        <div className="enquiry-actions">
          <button type="submit" className="enquiry-submit">
            Submit enquiry
          </button>
          {sent && (
            <p className="enquiry-sent" role="status">
              Your email app should open with the enquiry ready to send. If it
              doesn't, write to us at{" "}
              <a href={`mailto:${ENQUIRY_EMAIL}`}>{ENQUIRY_EMAIL}</a>.
            </p>
          )}
        </div>
      </form>
    </section>
  );
}
