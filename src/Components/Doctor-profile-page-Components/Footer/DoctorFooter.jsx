import "./DoctorFooter.css";

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
            <a href="/">Specialities</a>
            <a href="/">Find a Doctor</a>
            <a href="/">Health Packages</a>
            <a href="/">Lab Tests</a>
            <a href="/">Second Opinion</a>
          </div>

          <div className="footer-column">
            <h4>Patients</h4>
            <a href="/">Book Appointment</a>
            <a href="/">Patient Portal</a>
            <a href="/">Insurance & Billing</a>
            <a href="/">Visiting Hours</a>
          </div>
          
          <div className="footer-column">
            <h4>Hospital</h4>
            <a href="/">About Us</a>
            <a href="/">Our Doctors</a>
            <a href="/">Careers</a>
            <a href="/">Press</a>
          </div>

          <div className="footer-column">
            <h4>CONTACT</h4>
            <a href="/">1800 1023 5050</a>
            <a href="/">care@lakshmee.org</a>
            <a href="/">Hyderabad</a>
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
            <a href="/">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}