import "./DoctorFooter.css";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Left Content */}
        <div className="footer-brand">
          <h2>
            Driven by Giving,
            <br />
            <span>Guided by Empathy.</span>
          </h2>

          <p>
            Lakshmee Foundation Hospital is a multi-specialty hospital and
            research institute serving families across India since 1984.
          </p>
        </div>

        {/* Links */}
        <div className="footer-links">
          <div className="footer-column">
            <h4>Care</h4>
            <Link to="/all-specialties">Specialities</Link>
            <Link to="/doctors">Find a Doctor</Link>
            <Link to="/health-packages">Health Packages</Link>
            <a href="/">Lab Tests</a>
            <a href="/">Second Opinion</a>
          </div>

          <div className="footer-column">
            <h4>Patients</h4>
            <Link to="/doctors">Book Appointment</Link>
            <Link to="/dashboard">Patient Portal</Link>
            <a href="/">Insurance & Billing</a>
            <a href="/">Visiting Hours</a>
          </div>
          
          <div className="footer-column">
            <h4>Hospital</h4>
            <Link to="/about">About Us</Link>
            <Link to="/doctors">Our Doctors</Link>
            <a href="/">Careers</a>
            <a href="/">Press</a>
          </div>

          <div className="footer-column">
            <h4>CONTACT</h4>
            <a href="tel:180010235050">1800 1023 5050</a>
            <a href="mailto:care@lakshmee.org">care@lakshmee.org</a>
            <a href="https://www.google.com/maps/search/?api=1&query=Lakshmee+Foundation+Hospital" target="_blank" rel="noopener noreferrer">Hyderabad</a>
          </div>
        </div>

        {/* Divider */}
        <div className="footer-divider"></div>

        {/* Bottom */}
        <div className="footer-bottom">
          <p>© Lakshmee Foundation Hospital</p>

          <div className="footer-bottom-links">
            <a href="/">Privacy</a>
            <a href="/">Terms of Use</a>
            <Link to="/contact">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}