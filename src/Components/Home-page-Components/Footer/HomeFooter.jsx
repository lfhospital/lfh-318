import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import "./HomeFooter.css";

export default function Footer() {
  return (
    <footer className="home-footer">

      {/* Emergency Bar */}
      <div className="home-emergency-bar">
        <div className="home-emergency-left">
          <span className="home-emergency-title">24/7 Emergency</span>

          <span className="home-emergency-number">
            1800-123-1234
          </span>

          <span className="home-emergency-text">
            Round-the-clock medical assistance
          </span>
        </div>

        <a href="tel:18001231234" className="call-now">
          <span className="call-now-text">Call Now</span>
          <ArrowRight size={22} strokeWidth={1.8} />
        </a>
      </div>

      {/* Main Footer */}
      <div className="home-footer-main">

        <div className="home-footer-brand">
          <h2>
            A Legacy of Kindness,
            <br />
            <span>Guided by Care.</span>
          </h2>

          <p>
            Built on a legacy of kindness, Lakshmee
            Foundation Hospital is redefining
            accessible healthcare through modern
            infrastructure and expert care.
          </p>
        </div>

        <div className="home-home-footer-links">

          <div className="home-footer-column">
            <h4>Care</h4>
            <Link to="/all-specialties">Specialities</Link>
            <Link to="/doctors">Find a Doctor</Link>
            <Link to="/health-packages">Health Packages</Link>
            <a href="/">Lab Tests</a>
            <a href="/second-opinion">Second Opinion</a>
          </div>

          <div className="home-footer-column">
            <h4>Patients</h4>
            <Link to="/doctors">Book Appointment</Link>
            <Link to="/dashboard">Patient Portal</Link>
            <a href="/">Insurance & Billing</a>
            <a href="/">Visiting Hours</a>
          </div>

          <div className="home-footer-column">
            <h4>Hospital</h4>
            <Link to="/about">About Us</Link>
            <Link to="/doctors">Our Doctors</Link>
            <a href="/">Careers</a>
            <a href="/">Press</a>
          </div>

          <div className="home-footer-column">
            <h4>CONTACT</h4>
            <a href="tel:180010235050">1800 1023 5050</a>
            <a href="mailto:care@lakshmee.org">care@lakshmee.org</a>
            <a href="https://www.google.com/maps/search/?api=1&query=Lakshmee+Foundation+Hospital" target="_blank" rel="noopener noreferrer">Hyderabad</a>
          </div>

        </div>
      </div>

      <div className="home-footer-divider" />

      <div className="home-footer-bottom">
        <p>© Lakshmee Foundation Hospital</p>

        <div className="home-footer-bottom-links">
          <a href="/">Privacy</a>
          <a href="/">Terms of Use</a>
          <Link to="/contact">Contact</Link>
        </div>
      </div>

    </footer>
  );
}