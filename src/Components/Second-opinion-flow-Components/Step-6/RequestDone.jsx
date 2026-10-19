import React from "react";
import { Check } from "lucide-react";

export default function RequestDone({ firstName, reference, doctor, onDownload, onTrack }) {
  const steps = [
    {
      label: "Request submitted & paid",
      text: "We've received your case and documents.",
      time: "Just now · confirmation sent by email & SMS",
      state: "done",
    },
    doctor
      ? {
          label: `Confirming ${doctor.name}`,
          text: doctor.booked
            ? "You're on the waitlist, we'll confirm a slot with the specialist."
            : "We're confirming the specialist's availability for your case.",
          time: doctor.booked ? "Expected within 5 days" : "Expected within a few hours",
          state: "active",
        }
      : {
          label: "Specialist being assigned",
          text: "Our care team is matching your case to a senior specialist.",
          time: "Expected within a few hours",
          state: "active",
        },
    {
      label: "Under review",
      text: "Your specialist studies your reports and prepares a written opinion. We'll message you if anything more is needed.",
      time: "",
      state: "todo",
    },
    {
      label: "Opinion ready",
      text: "Your full second opinion arrives in your portal, downloadable as a PDF.",
      time: "Typically within 48 hours",
      state: "todo",
    },
  ];

  return (
    <div className="sof-done">
      <span className="sof-done-badge" aria-hidden="true">
        <Check size={44} strokeWidth={1.5} />
      </span>
      <h1>Your request is in.</h1>
      <p className="sof-done-text">
        Thank you, {firstName}.{" "}
        {doctor
          ? `We're confirming ${doctor.name}'s availability for your case.`
          : "Our care team is already matching your case to the right senior specialist."}{" "}
        You'll get an update the moment a doctor is assigned, no need to wait here.
      </p>
      <p className="sof-reference">
        Reference ID <strong>{reference}</strong>
      </p>

      <section className="sof-next">
        <h2>What happens next</h2>
        <ol className="sof-timeline">
          {steps.map((step) => (
            <li key={step.label} className={`is-${step.state}`}>
              <span className="sof-timeline-marker" aria-hidden="true">
                {step.state === "done" && <Check size={10} strokeWidth={3} />}
              </span>
              <span className="sof-timeline-body">
                <strong>{step.label}</strong>
                <span>{step.text}</span>
              </span>
              {step.time && <span className="sof-timeline-time">{step.time}</span>}
            </li>
          ))}
        </ol>

        <p className="sof-quick-title">Quick actions</p>
        <div className="sof-quick-actions">
          <button type="button" className="sof-outline" onClick={onDownload}>
            Download summary
          </button>
          <button type="button" className="sof-primary" onClick={onTrack}>
            Track on my dashboard
          </button>
        </div>
      </section>
    </div>
  );
}
