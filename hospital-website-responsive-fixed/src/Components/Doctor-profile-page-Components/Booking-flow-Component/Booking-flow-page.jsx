import { useState, useEffect } from "react";

import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/DoctorFooter";
import DoctorProfile from "../DoctorProfile/DoctorProfile";
import DoctorAbout from "../About/DoctorAbout";

import PatientInfo from "./Step-1/PatientInfo";
import Review from "./Step-2/Review";
import AppointmentConfirmation from "./Step-3/AppointmentConfirmation";

import AppointmentSlot from "../Reschedule-booking-flow-Component/Step-4/AppointmentSlot";
import AppointmentConfirmation_rs from "../Reschedule-booking-flow-Component/Step-5/AppointmentConfirmation-rs";
import RAppointmentConfirmation from "../Reschedule-booking-flow-Component/Step-6/RAppointmentConfirmation";

import CancelAppointment from "../Cancel-appointment-Component/Step-7/CancelAppointment";
import CancellationComplete from "../Cancel-appointment-Component/Step-8/CancellationComplete";

// Views:
// "profile" (doctor profile page)
//   -> "step1" -> "step2" -> "step3" (booking flow)
//   -> "step4" -> "step5" -> "step6" (reschedule flow, entered from step3)
export default function BookingFlowPage() {
  const [step, setStep] = useState("profile");

  // Scroll to the top of the viewport every time the step (i.e. the
  // "page" within this booking/reschedule/cancel flow) changes, so the
  // person always lands at the start of the new screen instead of
  // wherever they happened to be scrolled to on the previous one.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  // Step 1 — Patient Info
  if (step === "step1") {
    return (
      <PatientInfo
        onContinue={() => setStep("step2")}
        onBack={() => setStep("profile")}
      />
    );
  }

  // Step 2 — Review
  if (step === "step2") {
    return (
      <Review
        onContinue={() => setStep("step3")}
        onBack={() => setStep("step1")}
      />
    );
  }

  // Step 3 — Appointment Confirmation
  if (step === "step3") {
    return (
      <AppointmentConfirmation
        onReschedule={() => setStep("step4")}
        onCancel={() => setStep("step7")}
      />
    );
  }

  // Step 4 — Choose new appointment slot
  if (step === "step4") {
    return (
      <AppointmentSlot
        onContinue={() => setStep("step5")}
        onBack={() => setStep("step3")}
      />
    );
  }

  // Step 5 — Confirm reschedule
  if (step === "step5") {
    return (
      <AppointmentConfirmation_rs
        onConfirm={() => setStep("step6")}
        onBack={() => setStep("step4")}
      />
    );
  }

  // Step 6 — Reschedule confirmed
  if (step === "step6") {
    return <RAppointmentConfirmation />;
  }

  // Step 7 — Cancel appointment
  if (step === "step7") {
    return <CancelAppointment onCancellationComplete={() => setStep("step8")} />;
  }

  // Step 8 — Cancellation complete / refund initiated
  if (step === "step8") {
    return <CancellationComplete />;
  }

  // Default — Doctor Profile page
  return (
    <>
      <Navbar />
      <DoctorProfile onBookAppointment={() => setStep("step1")} />
      <DoctorAbout />
      <Footer />
    </>
  );
}
