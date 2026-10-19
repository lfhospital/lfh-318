import React from "react";
import { ArrowRight, ChevronLeft } from "lucide-react";
import { STEPS } from "./flowData";

export function BackButton({ onClick }) {
  return (
    <button type="button" className="sof-back" onClick={onClick}>
      <ChevronLeft size={18} />
      Back
    </button>
  );
}

// Progress across the six steps; finished steps can be revisited.
export function Stepper({ current, onSelect }) {
  return (
    <ol className="sof-stepper" aria-label="Request progress">
      {STEPS.map((label, index) => {
        const state = index < current ? "done" : index === current ? "current" : "todo";
        const canSelect = index < current && current < STEPS.length - 1;
        return (
          <li key={label} className={`sof-stepper-item is-${state}`}>
            <span className="sof-stepper-track" aria-hidden="true">
              <span className="sof-stepper-dot" />
            </span>
            {canSelect ? (
              <button type="button" className="sof-stepper-label" onClick={() => onSelect(index)}>
                {label}
              </button>
            ) : (
              <span className="sof-stepper-label" aria-current={state === "current" ? "step" : undefined}>
                {label}
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}

// Left column: what this step is about.
export function StepIntro({ title, text }) {
  return (
    <div className="sof-intro">
      <h1>{title}</h1>
      <p>{text}</p>
    </div>
  );
}

export function SectionHeading({ number, title, optional, hint }) {
  return (
    <div className="sof-section-heading">
      {number && <span className="sof-section-number">{number}.</span>}
      <h2>
        {title}
        {optional && <small> (optional)</small>}
      </h2>
      {hint && <p>{hint}</p>}
    </div>
  );
}

export function Field({ label, required, error, hint, counter, children }) {
  return (
    <label className="sof-field">
      <span className="sof-label-row">
        <span className="sof-label">
          {label}
          {required && <em className="sof-required"> *</em>}
        </span>
        {counter && <span className="sof-counter">{counter}</span>}
      </span>
      {children}
      {error ? <span className="sof-error">{error}</span> : hint && <span className="sof-hint">{hint}</span>}
    </label>
  );
}

export function Chip({ selected, onClick, children, className = "" }) {
  return (
    <button
      type="button"
      className={`sof-chip ${selected ? "is-selected" : ""} ${className}`}
      aria-pressed={selected}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function ContinueButton({ onClick, children = "Continue", disabled, busy }) {
  return (
    <div className="sof-continue-row">
      <button type="button" className="sof-primary" onClick={onClick} disabled={disabled || busy}>
        {busy ? "Processing…" : children}
        {!busy && <ArrowRight size={16} />}
      </button>
    </div>
  );
}
