import React from "react";
import "./ConnectionLost.css";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/DoctorFooter";

export default function ConnectionLost() {
  return (
    <>
      <Navbar />
      <div className="connection-page">
        <div className="connection-content">
          <h1 className="connection-title">
            Connection lost. We couldn't reach our servers.
          </h1>

          <p className="connection-description">
            Don't worry, your appointment hasn't been changed. It's still
            confirmed. Please check your connection and try again. We tried to
            cancel your appointment but lost the connection mid-way. Nothing on
            your end has been changed your booking is still active.
          </p>

          <div className="connection-actions">
            <button className="retry-button">Retry cancellation</button>

            <button className="back-button">Back to appointment</button>
          </div>

          <div className="connection-notice">
            If this keeps happening, call 1800-MED-CARE and we'll cancel for
            you. Reference your booking ID LKM-26-A479-2207.
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
