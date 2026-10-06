import Footer from "../../Footer/DoctorFooter";
import Navbar from "../../Navbar/Navbar";
import dock from "../../../../asserts/doctor.png";
import "./Review.css";
import { Check, ChevronLeft } from "lucide-react";

export default function Review({ onContinue, onBack }) {
  return (
    <>
      <Navbar />

      <section className="re-review-page">

        {/* ================= PROGRESS ================= */}
        <div className="re-progress-section">

          <div className="re-progress-line re-progress-line-two"></div>
          <div className="re-progress-line re-progress-line-one"></div>

          <div className="re-progress-step re-completed">
            <div className="re-circle"></div>

            <h4>Patient Info</h4>

            <p>
              Let's begin with a few
              <br />
              details about you.
            </p>
          </div>

          <div className="re-progress-step re-active">
            <div className="re-circle"></div>

            <h4>Review</h4>

            <p>
              Please verify your
              <br />
              information before we
              <br />
              proceed.
            </p>
          </div>

          <div className="re-progress-step">
            <div className="re-circle"></div>

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


        {/* ================= MAIN CONTENT ================= */}
        <div className="re-review-content">

          {/* ================= LEFT COLUMN ================= */}
          <div className="re-review-left">

            {/* ================= REVIEW CARD ================= */}
            <div className="re-review-card">

              <button
                className="re-review-back-btn"
                onClick={onBack}
              >
                <ChevronLeft size={18} />
                <span>Back</span>
              </button>

              <h2>Quick review before payment.</h2>

              <p className="re-review-subtitle">
                Have a coupon? Apply it now — discounts can't be added after
                payment.
              </p>


              {/* ================= DOCTOR ================= */}
              <div className="re-review-row">

                <div className="re-review-label">
                  DOCTOR
                </div>

                <div className="re-review-value">
                  <strong>
                    Dr. Ananya Menon
                  </strong>

                  <span>
                    Cardiologist · Interventional · 18 yrs experience
                  </span>
                </div>

              </div>


              {/* ================= WHEN ================= */}
              <div className="re-review-row">

                <div className="re-review-label">
                  WHEN
                </div>

                <div className="re-review-value">
                  <strong>
                    Sunday, 10 May 2026 · 5:30 PM
                  </strong>

                  <span>
                    Evening slot · 30 minutes · IST
                  </span>
                </div>

              </div>


              {/* ================= VISIT TYPE ================= */}
              <div className="re-review-row">

                <div className="re-review-label">
                  VISIT TYPE
                </div>

                <div className="re-review-value">
                  <strong>
                    First consultation
                  </strong>

                  <span>
                    In-person
                  </span>
                </div>

              </div>


              {/* ================= PATIENT ================= */}
              <div className="re-review-row re-patient-review-row">

                <div className="re-review-label">
                  PATIENT
                </div>

                <div className="re-review-value">
                  <strong>
                    Rohan Iyer · 37 yrs · Male
                  </strong>

                  <span>
                    +91 98765 43210 · rohan.iyer@email.com
                  </span>
                </div>

              </div>

            </div>


            {/* ================= COUPON CARD ================= */}
            <div className="re-coupon-card">

              <div className="re-coupon-header">

                <h3>
                  Coupon & offers
                </h3>

                <span>
                  3 offers available
                </span>

              </div>


              {/* ================= COUPON INPUT ================= */}
              <div className="re-coupon-input-row">

                <input
                  type="text"
                  value="LFH20"
                  readOnly
                />

                <button>
                  Apply
                </button>

              </div>


              {/* ================= COUPON SUCCESS ================= */}
              <div className="re-coupon-success">

                <Check size={16} />

                <h1>
                  LFH20{" "}
                  <span>
                    applied — you saved ₹160 on this consultation.
                  </span>
                </h1>

              </div>


              {/* ================= OFFERS ================= */}
              <div className="re-offer-list">

                <button>
                  <strong>
                    FIRST10
                  </strong>

                  <span>
                    10% Off first consult
                  </span>
                </button>

                <button>
                  <strong>
                    SENIOR15
                  </strong>

                  <span>
                    15% off for age 60+
                  </span>
                </button>

                <button>
                  <strong>
                    CARDIOFREE
                  </strong>

                  <span>
                    Free ECG with consult
                  </span>
                </button>

              </div>

            </div>


            {/* ================= PAYMENT BUTTON ================= */}
            <div className="re-payment-button-area">

              <button
                className="re-payment-btn"
                onClick={onContinue}
              >
                Proceed to Payment

                <span>
                  →
                </span>
              </button>

            </div>

          </div>


          {/* ================= RIGHT SUMMARY ================= */}
          <div className="re-payment-summary">

            <h5>
              BOOKING SUMMARY
            </h5>


            {/* ================= DOCTOR ================= */}
            <div className="re-summary-doctor">

              <img
                src={dock}
                alt="Dr. Ananya Menon"
              />

              <div>

                <h3>
                  Dr. Ananya Menon
                </h3>

                <p>
                  Cardiologist · Interventional
                </p>

              </div>

            </div>


            <div className="re-summary-divider"></div>


            {/* ================= SUMMARY ITEMS ================= */}

            <div className="re-payment-summary-row">

              <span>
                Visit type
              </span>

              <strong>
                First consultation
              </strong>

            </div>


            <div className="re-payment-summary-row">

              <span>
                Patient
              </span>

              <strong>
                Rohan Iyer
              </strong>

            </div>


            <div className="re-summary-divider"></div>


            <div className="re-payment-summary-row">

              <span>
                Consultation fee
              </span>

              <strong>
                ₹800
              </strong>

            </div>


            <div className="re-payment-summary-row">

              <span>
                Booking platform fee
              </span>

              <strong>
                ₹49
              </strong>

            </div>


            <div className="re-payment-summary-row">

              <span>
                GST (18%)
              </span>

              <strong>
                ₹152
              </strong>

            </div>


            <div className="re-payment-summary-row re-discount">

              <span>
                Coupon - LFH20
              </span>

              <strong>
                −₹160
              </strong>

            </div>


            <div className="re-summary-divider"></div>


            {/* ================= TOTAL ================= */}
            <div className="re-payable-total">

              <span>
                TOTAL PAYABLE
              </span>

              <strong>
                ₹841
              </strong>

            </div>


            <div className="re-summary-divider"></div>


            {/* ================= NOTE ================= */}
            <div className="re-cash-note">

              <span>
                ★
              </span>

              <p>
                Cashless insurance accepted at the desk if you'd prefer to pay
                later.
              </p>

            </div>

          </div>

        </div>

      </section>

      <Footer />
    </>
  );
}