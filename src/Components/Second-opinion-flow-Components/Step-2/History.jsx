import React from "react";
import { ChevronDown } from "lucide-react";
import { ContinueButton, Field, SectionHeading, StepIntro } from "../FlowParts";
import { GENDERS } from "../flowData";

export function validateHistory(form) {
  const errors = {};
  if (form.age !== "" && !(Number(form.age) >= 0 && Number(form.age) <= 120)) {
    errors.age = "Enter an age between 0 and 120.";
  }
  return errors;
}

export default function History({ form, errors, onChange, onContinue }) {
  const set = (field) => (event) => onChange({ [field]: event.target.value });

  return (
    <div className="sof-layout">
      <StepIntro
        title={<>A little background<br />helps us help you.</>}
        text="Skip anything you're unsure about, the specialist can ask for more if needed."
      />

      <div className="sof-content">
        <section className="sof-section">
          <SectionHeading
            number={1}
            title="Current medications"
            hint="List anything you take regularly, with dosage if you know it."
          />
          <textarea
            className="sof-input sof-textarea"
            rows={3}
            aria-label="Current medications"
            placeholder="e.g. metformin 500mg twice daily, Atorvastatin 10mg at night..."
            value={form.medications}
            onChange={set("medications")}
          />
        </section>

        <section className="sof-section">
          <SectionHeading
            number={2}
            title="Relevant medical history"
            hint="Past surgeries, chronic conditions, allergies or family history related to this concern."
          />
          <textarea
            className="sof-input sof-textarea"
            rows={3}
            aria-label="Relevant medical history"
            placeholder="e.g. Type 2 diabetes since 2018, no known drug allergies..."
            value={form.history}
            onChange={set("history")}
          />
        </section>

        <section className="sof-section">
          <SectionHeading
            number={3}
            title="A few quick details"
            optional
            hint="This gives our specialist the full clinical context. Optional but recommended."
          />
          <div className="sof-row">
            <Field label="Age" error={errors.age}>
              <input
                type="number"
                inputMode="numeric"
                min="0"
                max="120"
                className="sof-input"
                placeholder="e.g. 58"
                value={form.age}
                onChange={set("age")}
                aria-invalid={Boolean(errors.age)}
              />
            </Field>
            <Field label="Gender">
              <span className="sof-select">
                <select
                  className={`sof-input ${form.gender ? "" : "is-placeholder"}`}
                  value={form.gender}
                  onChange={set("gender")}
                >
                  <option value="">Select gender</option>
                  {GENDERS.map((gender) => (
                    <option key={gender} value={gender}>
                      {gender}
                    </option>
                  ))}
                </select>
                <ChevronDown size={18} />
              </span>
            </Field>
          </div>
        </section>

        <ContinueButton onClick={onContinue} />
      </div>
    </div>
  );
}
