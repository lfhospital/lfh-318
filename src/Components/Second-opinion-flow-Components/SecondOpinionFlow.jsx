import React, { useEffect, useMemo, useState } from "react";
import "./SecondOpinionFlow.css";
import Navbar from "../Home-page-Components/Navbar/Navbar";
import Footer from "../Home-page-Components/Footer/HomeFooter";
import { sampleFamilyMembers } from "../Patient-Dashboard-page-Components/FamilyMembers/FamilyMembers";
import { navigateTo, patientPageFor } from "../../navigation";
import { getUser } from "../../auth";
import { formatShortDate } from "../../dates";
import { BackButton, Stepper } from "./FlowParts";
import { STEPS } from "./flowData";
import {
  chosenDoctor,
  documentLabels,
  formatAmount,
  makeReference,
  priceFor,
  specialistPlan,
} from "./flowSummary";
import { clearDraft, getDraft, saveDraft, submitSecondOpinion } from "./secondOpinionStore";
import YourCase, { validateCase } from "./Step-1/YourCase";
import History, { validateHistory } from "./Step-2/History";
import Documents from "./Step-3/Documents";
import Specialist, { validateSpecialist } from "./Step-4/Specialist";
import Review from "./Step-5/Review";
import RequestDone from "./Step-6/RequestDone";

const EMPTY_FORM = {
  patientId: null,
  condition: "",
  specialty: "",
  doctor: "",
  hospital: "",
  description: "",
  medications: "",
  history: "",
  age: "",
  gender: "",
  uploads: [],
  recordIds: [],
  mode: "match",
  planSpecialty: "",
  doctorName: "",
  coupon: null,
  consents: {},
};

const DONE_STEP = STEPS.length - 1;

// A filled-in request, so each step can be previewed on its own page
// (see `initialStep` below and the SecondOpinion* pages in App.jsx).
const SAMPLE_FORM = {
  ...EMPTY_FORM,
  patientId: 1,
  condition: "Stable angina, advised angioplasty",
  specialty: "Cardiology",
  doctor: "Dr. S. Mehta",
  hospital: "City Heart Clinic",
  description:
    "I get chest tightness when climbing stairs. My cardiologist has recommended an angioplasty and I'd like a second view before going ahead.",
  medications: "Aspirin 75 mg, Atorvastatin 20 mg",
  history: "High blood pressure for 6 years. No previous heart procedures.",
  age: "37",
  gender: "Male",
  uploads: [
    { id: "sample-angiogram", name: "Angiogram report.pdf", meta: "Uploaded by you · 1.2 MB" },
    { id: "sample-ecg", name: "ECG Apr 2026.pdf", meta: "Uploaded by you · 340 KB" },
  ],
  recordIds: ["rec-cardio"],
  mode: "doctor",
  doctorName: "Dr. Anjali Kashyap",
};

// Page step names → step index.
const STEP_KEYS = ["case", "history", "documents", "specialist", "review", "done"];

const ageFrom = (dob) => {
  const birth = new Date(`${dob}T00:00:00`);
  const now = new Date();
  const age = now.getFullYear() - birth.getFullYear();
  const beforeBirthday =
    now.getMonth() < birth.getMonth() ||
    (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate());
  return beforeBirthday ? age - 1 : age;
};

// The account holder plus active family members, as "Rohan Iyer · Me" chips.
function usePatients() {
  return useMemo(() => {
    const user = getUser();
    return sampleFamilyMembers
      .filter((member) => member.status === "active")
      .map((member) => {
        const self = member.relationship === "Self";
        return {
          id: member.id,
          name: self && user?.name ? user.name : member.name,
          label: self ? "Me" : member.relationship,
          relation: self ? "Me" : "Family",
          age: ageFrom(self && user?.dob ? user.dob : member.dob),
          gender: self && user?.gender ? user.gender : member.gender,
        };
      });
  }, []);
}

function downloadSummary(request) {
  const lines = [
    "Lakshmee Foundation Hospital — Second opinion request",
    "",
    `Reference:   ${request.ref}`,
    `Submitted:   ${request.submitted}`,
    `Patient:     ${request.patient}`,
    `Specialty:   ${request.department}`,
    `Condition:   ${request.condition}`,
    `Specialist:  ${request.plan}`,
    `Documents:   ${request.documents.map((doc) => doc.name).join(", ") || "None yet"}`,
    `Paid:        ${formatAmount(request.paid)}`,
    "",
    "Your description",
    request.description,
  ];
  const url = URL.createObjectURL(new Blob([lines.join("\n")], { type: "text/plain" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `Second-opinion-${request.ref}.txt`;
  link.click();
  URL.revokeObjectURL(url);
}

function buildRequest(form, patient) {
  const plan = specialistPlan(form);
  const doctor = chosenDoctor(form);
  const condition = form.condition.trim();
  return {
    ref: makeReference(),
    title: `${form.specialty} - ${condition.slice(0, 40)}${condition.length > 40 ? "…" : ""}`,
    type: "Written review",
    orderedBy: form.doctor.trim() || "Self referred",
    department: form.specialty,
    date: new Date().toISOString().slice(0, 10),
    submitted: formatShortDate(new Date()),
    patient: patient.name,
    relation: patient.relation,
    status: "Under review",
    paid: priceFor(form.coupon).total,
    specialist: doctor
      ? {
          name: doctor.name,
          role: `${doctor.role}, ${doctor.field}`,
          chips: [`${doctor.years} yrs exp.`],
        }
      : null,
    documents: documentLabels(form).map((name, index) => ({
      name,
      meta: index < form.uploads.length ? "Uploaded by you" : "From your Lakshmee records",
    })),
    // Kept for the downloadable summary.
    condition,
    description: form.description.trim(),
    plan: plan.label,
  };
}

// initialStep ("case" | "history" | "documents" | "specialist" | "review" | "done")
// opens that step with sample data, for reviewing each page on its own URL.
export default function SecondOpinionFlow({ initialStep }) {
  const patients = usePatients();
  const preview = STEP_KEYS.includes(initialStep);
  const saved = preview ? null : getDraft();
  const [step, setStep] = useState(preview ? STEP_KEYS.indexOf(initialStep) : saved?.step ?? 0);
  const [form, setForm] = useState(() => {
    if (saved?.form) return saved.form;
    if (preview && initialStep !== "case") return SAMPLE_FORM;
    return { ...EMPTY_FORM, patientId: patients[0]?.id ?? null };
  });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  const patient = patients.find((item) => item.id === form.patientId) || patients[0];
  const patientAge = form.age !== "" ? Number(form.age) : patient?.age;

  const [submitted, setSubmitted] = useState(() =>
    initialStep === "done"
      ? { request: buildRequest(SAMPLE_FORM, patient), doctor: chosenDoctor(SAMPLE_FORM) }
      : null
  );

  // Keep the draft so leaving (e.g. to add a family member) doesn't lose it.
  // Preview pages don't touch the real draft.
  useEffect(() => {
    if (!preview && step < DONE_STEP) saveDraft({ step, form });
  }, [preview, step, form]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  const change = (changes) => {
    setForm((current) => ({ ...current, ...changes }));
    setErrors((current) => {
      const next = { ...current };
      Object.keys(changes).forEach((key) => delete next[key]);
      if ("mode" in changes || "doctorName" in changes || "planSpecialty" in changes) delete next.specialist;
      return next;
    });
  };

  const goTo = (target) => {
    setErrors({});
    setStep(target);
  };

  const next = (validate) => () => {
    const found = validate ? validate(form) : {};
    setErrors(found);
    if (Object.keys(found).length === 0) {
      // Prefill the quick details from the chosen family member.
      if (step === 0 && patient) {
        setForm((current) => ({
          ...current,
          age: current.age === "" ? String(patient.age) : current.age,
          gender: current.gender || patient.gender,
        }));
      }
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step === 0 || step === DONE_STEP) {
      navigateTo("home");
      return;
    }
    goTo(step - 1);
  };

  const handleSubmit = () => {
    setBusy(true);
    // Payment is simulated; the request is recorded once it "succeeds".
    setTimeout(() => {
      const request = buildRequest(form, patient);
      submitSecondOpinion(request);
      if (!preview) clearDraft();
      setSubmitted({ request, doctor: chosenDoctor(form) });
      setBusy(false);
      setStep(DONE_STEP);
    }, 900);
  };

  const addMember = () => {
    if (!preview) saveDraft({ step, form });
    navigateTo(patientPageFor("Family Members"));
  };

  const accountFirstName = getUser()?.firstName || patients[0]?.name.split(" ")[0] || "there";

  return (
    <>
      <Navbar />
      <main className="sof-page">
        <BackButton onClick={handleBack} />
        <Stepper current={step} onSelect={goTo} />

        {step === 0 && (
          <YourCase
            form={form}
            patients={patients}
            errors={errors}
            onChange={change}
            onAddMember={addMember}
            onContinue={next(validateCase)}
          />
        )}
        {step === 1 && (
          <History form={form} errors={errors} onChange={change} onContinue={next(validateHistory)} />
        )}
        {step === 2 && (
          <Documents
            uploads={form.uploads}
            recordIds={form.recordIds}
            onChange={change}
            onContinue={next()}
          />
        )}
        {step === 3 && (
          <Specialist form={form} errors={errors} onChange={change} onContinue={next(validateSpecialist)} />
        )}
        {step === 4 && (
          <Review
            form={form}
            patient={patient}
            patientAge={patientAge}
            onEdit={goTo}
            onChange={change}
            onSubmit={handleSubmit}
            busy={busy}
          />
        )}
        {step === DONE_STEP && submitted && (
          <RequestDone
            firstName={accountFirstName}
            reference={submitted.request.ref}
            doctor={submitted.doctor}
            onDownload={() => downloadSummary(submitted.request)}
            onTrack={() => navigateTo(patientPageFor("Second opinion"))}
          />
        )}
      </main>
      <Footer />
    </>
  );
}
