import React from "react";
import "../PatientAppointments/PatientAppointments.css";
import "./AppointmentsEmpty.css";
import Navbar from "../../Home-page-Components/Navbar/Navbar";
import Footer from "../../Home-page-Components/Footer/HomeFooter";
import { Sidebar } from "../PatientAppointments/PatientAppointments";

export default function AppointmentsEmpty({ onFindDoctor }) {
  return (
    <>
      <Navbar />
      <div className="patient-appointments">
        <Sidebar />

        <main className="pa-main">
          <section className="ae-empty" aria-labelledby="ae-empty-title">
            <h1 id="ae-empty-title" className="ae-empty-title">
              No upcoming appointments
            </h1>
            <p className="ae-empty-text">
              You're all caught up. Book a visit with a specialist whenever you
              need, it only takes a minute.
            </p>
            <button type="button" className="ae-empty-button" onClick={onFindDoctor}>
              Find a doctor
            </button>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
}
