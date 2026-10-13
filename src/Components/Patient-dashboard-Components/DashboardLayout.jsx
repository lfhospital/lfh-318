import React from "react";
import { Navigate } from "react-router-dom";
import Navbar from "../Home-page-Components/Navbar/Navbar";
import Footer from "../Home-page-Components/Footer/HomeFooter";
import DashboardSidebar from "./DashboardSidebar/DashboardSidebar";
import { getPatientSession } from "../../utils/patientSession";
import "./DashboardLayout.css";

// Wraps every patient dashboard page; `children` receives the logged-in session
export default function DashboardLayout({ active, children }) {
  const session = getPatientSession();
  if (!session?.patientId) return <Navigate to="/login" replace />;

  return (
    <>
      <Navbar />
      <div className="dash-layout">
        <DashboardSidebar active={active} />
        {children(session)}
      </div>
      <Footer />
    </>
  );
}
