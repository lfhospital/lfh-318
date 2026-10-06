import React, { useState, useEffect } from "react";
import HomePage from "./pages/Home-page";
import Doctors_Profile from "./pages/Doctor-profile-page";
import Specialty from "./pages/Specialty-page";
import Healthpackages from "./pages/Health-packages-page";
import All_Doctors from "./pages/All-Doctors-page";
import ComparePage from "./pages/Compare-page";
import PackageDetail1 from "./pages/Package-detail-page1";
import PackageDetail2 from "./pages/Package-detail-page2";
import PackageDetail3 from "./pages/Package-detail-page3";
import All_Specialties from "./pages/All-specility-page";
import HealthLibrary from "./pages/HealthLibrary-page";
import BookingFlowPage from "./Components/Doctor-profile-page-Components/Booking-flow-Component/Booking-flow-page";
import PatientInfo from "./Components/Doctor-profile-page-Components/Booking-flow-Component/Step-1/PatientInfo";
import Review from "./Components/Doctor-profile-page-Components/Booking-flow-Component/Step-2/Review";
import AppointmentConfirmation from "./Components/Doctor-profile-page-Components/Booking-flow-Component/Step-3/AppointmentConfirmation";
import AppointmentSlot from "./Components/Doctor-profile-page-Components/Reschedule-booking-flow-Component/Step-4/AppointmentSlot";
import AppointmentConfirmation_rs from "./Components/Doctor-profile-page-Components/Reschedule-booking-flow-Component/Step-5/AppointmentConfirmation-rs";
import RAppointmentConfirmation from "./Components/Doctor-profile-page-Components/Reschedule-booking-flow-Component/Step-6/RAppointmentConfirmation";
import CancelAppointment from "./Components/Doctor-profile-page-Components/Cancel-appointment-Component/Step-7/CancelAppointment";
import CancellationComplete from "./Components/Doctor-profile-page-Components/Cancel-appointment-Component/Step-8/CancellationComplete";
import NoRefundCancellation from "./Components/Doctor-profile-page-Components/Cancel window expired-Component/NoRefundCancellation";
import PartialRefund from "./Components/Doctor-profile-page-Components/Partial refund-Component/PartialRefund";
import ConnectionLost from "./Components/Doctor-profile-page-Components/Network failure during cancel-Component/ConnectionLost";
import AlreadyCancelled from "./Components/Doctor-profile-page-Components/Already cancelled/AlreadyCancelled";
import ServiceUnavailable from "./Components/Doctor-profile-page-Components/Error 404-Component/ServiceUnavailable";
import SlotTaken from "./Components/Doctor-profile-page-Components/Selected slot just got taken-Component/Step-9/SlotTaken";
import RescheduleConfirm from "./Components/Doctor-profile-page-Components/Selected slot just got taken-Component/Step-10/RescheduleConfirm";
import Doc_unavailable from "./Components/Doctor-profile-page-Components/Doc unavailable-Component/Doc_unavailable";
import PaymentFailed from "./Components/Doctor-profile-page-Components/Payment failed-Components/PaymentFailed";
import DoubleBooking from "./Components/Doctor-profile-page-Components/Double booking attempt-Component/DoubleBooking";

const pages = {
  home: <HomePage />,
  allDoctors: <All_Doctors />,
  doctorProfile: <BookingFlowPage />,
  // doctorProfile: <Doctors_Profile />,
  specialty: <Specialty />,
  healthPackages: <Healthpackages />,
  PackageDetail1: <PackageDetail1 />,
  PackageDetail2: <PackageDetail2 />,
  PackageDetail3: <PackageDetail3 />,
  compare: <ComparePage />,
  allSpecialty: <All_Specialties />,
  // healthLibrary: <HealthLibrary />,
  ///////////////////////////////////
  NoRefundCancellation: <NoRefundCancellation />,
  PartialRefund: <PartialRefund />,
  ConnectionLost: <ConnectionLost />,
  AlreadyCancelled: <AlreadyCancelled />,
  ServiceUnavailable: <ServiceUnavailable />,
  SlotTaken: <SlotTaken />,
  RescheduleConfirm: <RescheduleConfirm />,
  Doc_unavailable: <Doc_unavailable />,
  PaymentFailed: <PaymentFailed />,
  DoubleBooking: <DoubleBooking />,
  ///////////////////////////////////
};

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");

  // Whenever the visible "page" changes, jump the viewport back to the top.
  // Without this, navigating to a new page while scrolled down on the
  // previous one leaves the new page starting mid-way down, which feels broken.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  return (
    <>
      {/* Dev Navigation - remove in production */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "#1e293b",
          color: "#fff",
          padding: "8px 16px",
          display: "flex",
          gap: "8px",
          flexWrap: "wrap",
          zIndex: 9999,
          fontSize: "12px",
        }}
      >
        <span style={{ opacity: 0.6, alignSelf: "center" }}>Pages:</span>
        {Object.keys(pages).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            style={{
              background: currentPage === page ? "#3b82f6" : "#334155",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              padding: "4px 10px",
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            {page}
          </button>
        ))}
      </div>
      <div style={{ paddingBottom: "50px" }}>{pages[currentPage]}</div>
    </>
  );
}
