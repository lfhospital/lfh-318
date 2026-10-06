import React from "react";
import "./ServiceUnavailable.css";
import Footer from "../Footer/DoctorFooter";
import Navbar from "../Navbar/Navbar";

export default function ServiceUnavailable() {
  return (
    <>
      <Navbar />
      <div className="service-unavailable-page">
        <div className="service-unavailable-content">
          <h1>
            Something on our end didn't work. Service temporarily unavailable
          </h1>

          <p>
            A short hiccup with our booking service. Your appointment is still
            confirmed and untouched. Our team has been alerted automatically and
            is on it. You can try again in a moment, or call us and we'll handle
            it for you.
          </p>

          <div className="service-unavailable-actions">
            <button className="service-try-again-button">Try again</button>

            <button className="service-back-button">Back to appointment</button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
