import Footer from "../../Footer/DoctorFooter";
import Navbar from "../../Navbar/Navbar";
import dock from "../../../../asserts/doctor.png";
import "./PatientInfo.css";
import {  ChevronLeft, Upload } from "lucide-react";

export default function PatientInfo({ onContinue, onBack }) {
  return (
    <>
      <Navbar />

      <section className="patient-page">
        {/* ================= PROGRESS ================= */}
        <div className="progress-section">
          <div className="progress-line progress-line-one"></div>
          <div className="progress-line progress-line-two"></div>
          <div className="progress-step active">
            <div className="circle"></div>
            <h4>Patient Info</h4>
            <p>
              Let's begin with a few
              <br />
              details about you.
            </p>
          </div>
          <div className="progress-step">
            <div className="circle"></div>
            <h4>Review</h4>
            <p>
              Please verify your
              <br />
              information before we
              <br />
              proceed.
            </p>
          </div>
          <div className="progress-step">
            <div className="circle"></div>
            <h4>Done</h4>
            <p>
              You're all set. Your
              <br />
              appointment has been
              <br />
              successfully booked.
            </p>
          </div>
        </div>
        {/* ================= CONTENT ================= */}
        <div className="content">
          {/* ================= LEFT CARD ================= */}
          <div className="left-card">
            <button className="back-btn" onClick={onBack}>
              <ChevronLeft  size={18} />
              <span>Back</span>
            </button>
            <h2>Tell us about the patient.</h2>
            <p className="subtitle">
              We use this to prepare the consult and pre-fill your records. Five
              fields, no more.
            </p>
            {/* Patient type */}
            <div className="patient-type">
              <button className="active">For myself</button>
              <button>For someone else</button>
            </div>

            <h5 className="bsection-title">Patient Information</h5>

            {/* ================= FORM ================= */}
            <div className="form-grid">
              <div className="field">
                <label>
                  FULL NAME <span>*</span>
                </label>
                <input type="text" placeholder="Enter name" />
              </div>
              <div className="field">
                <label>
                  MOBILE NUMBER <span>*</span>
                </label>
                <input type="text" placeholder="+91 00000 00000" />
              </div>
              <div className="field email-field">
                <label>
                  EMAIL <span>*</span>
                </label>
                <input type="email" placeholder="name@email.com" />
              </div>
              <div className="field dob-field">
                <label>DATE OF BIRTH</label>
                <input type="text" placeholder="DD/MM/YYYY" />
              </div>
              <div className="field gender">
                <label>
                  GENDER <span>*</span>
                </label>
                <div className="gender-buttons">
                  <button>Male</button>
                  <button>Female</button>
                  <button>Other</button>
                </div>
              </div>
            </div>
            <div className="divider"></div>
            {/* ================= MEDICAL CONTEXT ================= */}
            <h5 className="bsection-title">Medical context</h5>
            <div className="field reason">
              <div className="reason-head">
                <label>REASON FOR VISIT (IN YOUR WORDS)</label>

                <span>Optional · helps the doctor prepare</span>
              </div>
              <textarea placeholder="Enter reason"></textarea>
            </div>
            {/* ================= UPLOAD ================= */}
            <div className="upload">
              <label>UPLOAD REPORTS (ECG, ECHO, PRESCRIPTIONS)</label>
              <div className="upload-box">
                <div className="upload-content">
                  <Upload size={13} />
                  <span>Drag PDFs or images here, or browse</span>
                </div>
                <small>PDF, JPG · Max 10 MB</small>
              </div>
            </div>
            {/* ================= CONSENT ================= */}
            <label className="checkbox">
              <input type="checkbox" />
              <span>
                I consent to share my information with Dr. Menon and the
                Lakshmee care team for the purpose of this consultation.
                <b> Privacy policy</b>
              </span>
            </label>
            {/* ================= BUTTON ================= */}
            <div className="btn-area">
              <button className="continue-btn" onClick={onContinue}>
                Continue to review
                <span>→</span>
              </button>
            </div>
          </div>
          {/* ================= RIGHT SUMMARY ================= */}
          <div className="summary-card">
            <h5>BOOKING SUMMARY</h5>
            <div className="doctor">
              <img src={dock} alt="Dr. Ananya Menon" />
              <div>
                <h3>Dr. Ananya Menon</h3>
                <p>Cardiologist · Interventional</p>
              </div>
            </div>
            <div className="summary-divider"></div>
            <div className="summary-row">
              <span className="title">Patient</span>
              <p>Rohan Iyer&nbsp; · &nbsp;+91 98765 43210</p>
            </div>
            <div className="summary-row">
              <span className="title">Date & time</span>
              <p>Sun, 10 May&nbsp; · &nbsp;5:30 PM</p>
            </div>
            <div className="summary-row">
              <span className="title">Visit type</span>
              <p>First consultation&nbsp; · &nbsp;25–30 min</p>
            </div>
            <div className="summary-divider"></div>
            <div className="total">
              <span>TOTAL</span>
              <h2>₹800</h2>
            </div>
            <div className="summary-divider"></div>
            <div className="note">
              <span>★</span>
              <p>
                Your details are encrypted and stored only for this care
                <br />
                relationship.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
