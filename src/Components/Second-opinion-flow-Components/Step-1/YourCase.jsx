import React from "react";
import { Plus } from "lucide-react";
import { Chip, ContinueButton, Field, SectionHeading, StepIntro } from "../FlowParts";
import { DESCRIPTION_LIMIT, SPECIALTIES } from "../flowData";

export function validateCase(form) {
  const errors = {};
  if (!form.patientId) errors.patientId = "Choose who this opinion is for.";
  if (form.condition.trim().length < 3) errors.condition = "Tell us the condition or diagnosis.";
  if (!form.specialty) errors.specialty = "Choose the closest specialty.";
  if (form.description.trim().length < 10) errors.description = "Describe what's happening in a sentence or two.";
  return errors;
}

export default function YourCase({ form, patients, errors, onChange, onAddMember, onContinue }) {
  const set = (field) => (event) => onChange({ [field]: event.target.value });

  return (
    <div className="sof-layout">
      <StepIntro
        title={<>Tell us what you'd like<br />a second look at.</>}
        text="Share as much as you can. Everything is private and saved automatically as a draft, you can pause and return anytime."
      />

      <div className="sof-content">
        <section className="sof-section">
          <SectionHeading
            number={1}
            title="Who is this opinion for?"
            hint="Request for yourself or a family member linked to your account."
          />
          <div className="sof-chips" role="group" aria-label="Patient">
            {patients.map((patient) => (
              <Chip
                key={patient.id}
                selected={form.patientId === patient.id}
                className="sof-chip--patient"
                onClick={() => onChange({ patientId: patient.id })}
              >
                {patient.name} · {patient.label}
              </Chip>
            ))}
            <button type="button" className="sof-chip sof-chip--add" onClick={onAddMember}>
              <Plus size={14} />
              Add member
            </button>
          </div>
          {errors.patientId && <span className="sof-error">{errors.patientId}</span>}
        </section>

        <section className="sof-section">
          <SectionHeading
            number={2}
            title="Your condition"
            hint="What has been diagnosed or recommended, and which area of medicine it falls under."
          />
          <Field
            label="Medical condition / diagnosis"
            required
            error={errors.condition}
            hint="In your words is fine, you don't need medical terms."
          >
            <input
              type="text"
              className="sof-input"
              placeholder="e.g. Early-stage breast cancer, herniated L4-L5 disc..."
              value={form.condition}
              onChange={set("condition")}
              aria-invalid={Boolean(errors.condition)}
            />
          </Field>
          <div className="sof-field">
            <span className="sof-label">
              Which specialty does this relate to?
              <em className="sof-required"> *</em>
            </span>
            <div className="sof-chips sof-chips--fill" role="group" aria-label="Specialty">
              {SPECIALTIES.map((specialty) => (
                <Chip
                  key={specialty}
                  selected={form.specialty === specialty}
                  onClick={() => onChange({ specialty })}
                >
                  {specialty}
                </Chip>
              ))}
            </div>
            {errors.specialty ? (
              <span className="sof-error">{errors.specialty}</span>
            ) : (
              <span className="sof-hint">
                Not sure? Choose the closest, our care team confirms the right sub specialty.
              </span>
            )}
          </div>
        </section>

        <section className="sof-section">
          <SectionHeading
            number={3}
            title="Where are you being treated now?"
            hint="This gives our specialist the full clinical context. Optional but recommended."
          />
          <div className="sof-row">
            <Field label="Treating doctor (optional)">
              <input
                type="text"
                className="sof-input"
                placeholder="Enter dr. name"
                value={form.doctor}
                onChange={set("doctor")}
              />
            </Field>
            <Field label="Hospital / clinic (optional)">
              <input
                type="text"
                className="sof-input"
                placeholder="e.g. City general hospital"
                value={form.hospital}
                onChange={set("hospital")}
              />
            </Field>
          </div>
        </section>

        <section className="sof-section">
          <SectionHeading
            number={4}
            title="Describe what's happening"
            hint="Symptoms, when they started, and what you're most worried about or want answered."
          />
          <Field
            label="Your description"
            required
            error={errors.description}
            counter={`${form.description.length}/${DESCRIPTION_LIMIT}`}
          >
            <textarea
              className="sof-input sof-textarea"
              rows={3}
              maxLength={DESCRIPTION_LIMIT}
              placeholder="e.g. I was diagnosed 3 weeks ago and my doctor has recommended surgery. I'd like to know if there are less invasive options, and whether the diagnosis is certain..."
              value={form.description}
              onChange={set("description")}
              aria-invalid={Boolean(errors.description)}
            />
          </Field>
        </section>

        <ContinueButton onClick={onContinue} />
      </div>
    </div>
  );
}
