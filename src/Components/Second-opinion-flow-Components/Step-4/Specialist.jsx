import React from "react";
import { Check } from "lucide-react";
import { Chip, ContinueButton, SectionHeading, StepIntro } from "../FlowParts";
import { SPECIALIST_MODES, SPECIALISTS, SPECIALTIES } from "../flowData";

export function validateSpecialist(form) {
  const errors = {};
  if (form.mode === "specialty" && !form.planSpecialty) errors.specialist = "Choose a specialty.";
  if (form.mode === "doctor" && !form.doctorName) errors.specialist = "Choose a specialist.";
  return errors;
}

function Radio({ checked }) {
  return (
    <span className={`sof-radio ${checked ? "is-checked" : ""}`} aria-hidden="true">
      {checked && <Check size={12} strokeWidth={3} />}
    </span>
  );
}

export default function Specialist({ form, errors, onChange, onContinue }) {
  const doctors = SPECIALISTS[form.specialty] || SPECIALISTS.Other;
  const chosen = doctors.find((doctor) => doctor.name === form.doctorName);

  return (
    <div className="sof-layout">
      <StepIntro
        title={<>How would you like your<br />specialist chosen?</>}
        text="Most patients let our care team match the best doctor for their exact case, it's the fastest route to an accurate opinion."
      />

      <div className="sof-content sof-content--tight">
        <div className="sof-options" role="radiogroup" aria-label="How to choose a specialist">
          {SPECIALIST_MODES.map((mode) => (
            <label key={mode.value} className={`sof-option ${form.mode === mode.value ? "is-selected" : ""}`}>
              <input
                type="radio"
                name="specialist-mode"
                value={mode.value}
                checked={form.mode === mode.value}
                onChange={() =>
                  onChange({
                    mode: mode.value,
                    planSpecialty: form.planSpecialty || form.specialty,
                  })
                }
              />
              <Radio checked={form.mode === mode.value} />
              <span className="sof-option-text">
                <strong>{mode.title}</strong>
                <span>{mode.text}</span>
              </span>
            </label>
          ))}
        </div>

        {form.mode === "specialty" && (
          <section className="sof-section sof-section--compact">
            <SectionHeading
              title="Choose a specialty"
              hint="We'll assign the right senior specialist within it."
            />
            <div className="sof-chips sof-chips--fill" role="group" aria-label="Specialty">
              {SPECIALTIES.map((specialty) => (
                <Chip
                  key={specialty}
                  selected={form.planSpecialty === specialty}
                  onClick={() => onChange({ planSpecialty: specialty })}
                >
                  {specialty}
                </Chip>
              ))}
            </div>
          </section>
        )}

        {form.mode === "doctor" && (
          <section className="sof-section sof-section--compact">
            <SectionHeading
              title="Choose your specialist"
              hint="Senior specialists available for second opinions in your specialty."
            />
            <div className="sof-doctor-list" role="radiogroup" aria-label="Specialist">
              {doctors.map((doctor) => (
                <label key={doctor.name} className="sof-doctor">
                  <input
                    type="radio"
                    name="specialist-doctor"
                    checked={form.doctorName === doctor.name}
                    onChange={() => onChange({ doctorName: doctor.name })}
                  />
                  <Radio checked={form.doctorName === doctor.name} />
                  <span className="sof-option-text">
                    <strong>
                      {doctor.name} · {doctor.role}
                    </strong>
                    <span>
                      {doctor.field} · {doctor.years} yrs experience · Available in {doctor.available}
                    </span>
                  </span>
                </label>
              ))}
            </div>

            {chosen?.booked && (
              <div className="sof-warning" role="status">
                <span className="sof-warning-icon" aria-hidden="true">!</span>
                <div>
                  <strong>Dr. {chosen.name.split(" ").pop()} is fully booked this week.</strong>
                  <p>
                    You can join {chosen.pronoun || "their"} waitlist (est. 5 days) or let us
                    assign an equally senior specialist for a faster response.
                  </p>
                  <div className="sof-warning-actions">
                    <button type="button" className="sof-link" onClick={onContinue}>
                      Join waitlist
                    </button>
                    <button
                      type="button"
                      className="sof-link"
                      onClick={() => onChange({ mode: "match", doctorName: "" })}
                    >
                      Assign another specialist
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {errors.specialist && <span className="sof-error">{errors.specialist}</span>}

        <ContinueButton onClick={onContinue} />
      </div>
    </div>
  );
}
