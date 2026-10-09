import React from "react";
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
            <a href="/">Specialities</a>
            <a href="/">Find a Doctor</a>
            <a href="/">Health Packages</a>
            <a href="/">Lab Tests</a>
            <a href="/">Second Opinion</a>
          </div>

          <div className="home-footer-column">
            <h4>Patients</h4>
            <a href="/">Book Appointment</a>
            <a href="/">Patient Portal</a>
            <a href="/">Insurance & Billing</a>
            <a href="/">Visiting Hours</a>
          </div>

          <div className="home-footer-column">
            <h4>Hospital</h4>
            <a href="/about">About Us</a>
            <a href="/">Our Doctors</a>
            <a href="/">Careers</a>
            <a href="/">Press</a>
          </div>

          <div className="home-footer-column">
            <h4>CONTACT</h4>
            <a href="/">1800 1023 5050</a>
            <a href="/">care@lakshmee.org</a>
            <a href="/">Hyderabad</a>
          </div>

        </div>
      </div>

      <div className="home-footer-divider" />

      <div className="home-footer-bottom">
        <p>© Lakshmee Foundation Hospital</p>

        <div className="home-footer-bottom-links">
          <a href="/">Privacy</a>
          <a href="/">Terms of Use</a>
          <a href="/contact">Contact</a>
        </div>
      </div>

    </footer>
  );
}