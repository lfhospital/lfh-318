import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../Footer/DoctorFooter";
import Navbar from "../../Navbar/Navbar";
import dock from "../../../../asserts/doctor.png";
import "./Review.css";
import { Check, ChevronLeft } from "lucide-react";

function calculateAge(isoDob) {
  if (!isoDob) return null;
  const dobDate = new Date(isoDob);
  if (Number.isNaN(dobDate.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - dobDate.getFullYear();
  const monthDiff = today.getMonth() - dobDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
    age--;
  }
  return age;
}

// Parses a DD/MM/YYYY string into an ISO date, used only for age display.
function parseDobToIso(ddmmyyyy) {
  if (!ddmmyyyy) return null;
  const match = ddmmyyyy.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!match) return null;
  const [, dd, mm, yyyy] = match;
  return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
}

// Strips any non-numeric characters from a fee string like "₹800" and
// returns a number, defaulting to 800 if nothing usable is found.
function parseFee(feeString, fallback = 800) {
  if (!feeString) return fallback;
  const numeric = parseFloat(String(feeString).replace(/[^\d.]/g, ""));
  return Number.isNaN(numeric) ? fallback : numeric;
}

// Loads the Razorpay checkout script if it isn't already present on the
// page (it's normally pre-loaded via index.html, but this is a safe
// fallback in case that tag is ever removed).
function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function Review({ onContinue, onBack }) {
  const navigate = useNavigate();

  const [bookingDetails, setBookingDetails] = useState(null);
  const [patientInfo, setPatientInfo] = useState(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  useEffect(() => {
    const storedBooking = localStorage.getItem("bookingDetails");
    if (storedBooking) {
      try {
        setBookingDetails(JSON.parse(storedBooking));
      } catch (e) {
        console.error("Failed to parse bookingDetails from localStorage", e);
      }
    }

    const storedPatientInfo = localStorage.getItem("patientInfo");
    if (storedPatientInfo) {
      try {
        setPatientInfo(JSON.parse(storedPatientInfo));
      } catch (e) {
        console.error("Failed to parse patientInfo from localStorage", e);
      }
    }
  }, []);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate("/patient-info");
    }
  };

  const handleProceed = async () => {
    setPaymentError("");

    // Persist a combined "appointment" record so later steps (confirmation,
    // reschedule, cancel) have a single source of truth to read from.
    const appointment = {
      ...bookingDetails,
      patient: patientInfo,
      coupon: "LFH20",
      discount: 160,
      platformFee: 49,
      gstRate: 0.18,
      bookedAt: new Date().toISOString(),
    };
    localStorage.setItem("appointment", JSON.stringify(appointment));

    setIsProcessingPayment(true);

    try {
      // Create the order on the backend using the amount shown in the
      // review summary (₹ totalPayable, the amount the patient actually owes).
      const response = await fetch(
        "https://ishah.in/api/lfhospital/payments/createorder",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ price: totalPayable }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data?.success || !data?.order) {
        throw new Error(data?.message || "Failed to create payment order");
      }

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded || !window.Razorpay) {
        throw new Error("Unable to load payment gateway. Please try again.");
      }

      const options = {
        key: data.key_id,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "Lakshmee Foundation Hospital",
        description: `Consultation with ${doctorName}`,
        order_id: data.order.id,
        prefill: {
          name: patientInfo?.fullName || "",
          email: patientInfo?.email || "",
          contact: patientInfo?.mobileNumber || "",
        },
        notes: {
          doctor: doctorName,
          receipt: data.order.receipt,
        },
        theme: {
          color: "#2563eb",
        },
        handler: function (paymentResponse) {
          // Payment succeeded — persist payment details and move forward.
          const updatedAppointment = {
            ...appointment,
            payment: {
              orderId: data.order.id,
              paymentId: paymentResponse.razorpay_payment_id,
              signature: paymentResponse.razorpay_signature,
              amount: data.order.amount,
              status: "paid",
            },
          };
          localStorage.setItem(
            "appointment",
            JSON.stringify(updatedAppointment)
          );

          setIsProcessingPayment(false);

          // IMPORTANT: Razorpay's checkout script is still closing its own
          // overlay/iframe when this handler fires. Navigating (and thus
          // unmounting this page) in the same tick races with Razorpay's own
          // DOM cleanup and can throw a "removeChild" DOM exception that
          // crashes the whole React app. Deferring to the next tick lets
          // Razorpay finish closing itself first.
          setTimeout(() => {
            if (onContinue) {
              onContinue();
            } else {
              navigate("/appointment-confirmation");
            }
          }, 300);
        },
        modal: {
          ondismiss: function () {
            setIsProcessingPayment(false);
          },
        },
      };

      const razorpayInstance = new window.Razorpay(options);

      razorpayInstance.on("payment.failed", function (response) {
        // Surface Razorpay's actual failure reason instead of swallowing it,
        // so we can diagnose issues like amount mismatch, bad test card,
        // or key/order mismatch instead of a generic message.
        console.error("Razorpay payment.failed:", response?.error);
        setIsProcessingPayment(false);
        const reason =
          response?.error?.description ||
          response?.error?.reason ||
          "Payment failed. Please try again.";
        setPaymentError(reason);
        navigate("/payment-failed", { state: { error: response?.error } });
      });

      razorpayInstance.open();
    } catch (error) {
      console.error("Payment initiation failed", error);
      setPaymentError(
        error.message || "Something went wrong while initiating payment."
      );
      setIsProcessingPayment(false);
    }
  };

  // ---------- Derived display values ----------
  const doctorName = bookingDetails?.doctorName || "Dr. Ananya Menon";
  const doctorSpecialty =
    bookingDetails?.specialty || "Cardiologist · Interventional";
  const doctorImage = bookingDetails?.doctorImage || dock;

  const visitMode =
    bookingDetails?.selectedMode === "virtual" ? "Virtual" : "In-person";

  const formattedWhen = (() => {
    if (!bookingDetails?.selectedDate) return "Date & time not selected";
    try {
      const dateObj = new Date(bookingDetails.selectedDate);
      const dateStr = dateObj.toLocaleDateString("en-IN", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
      return `${dateStr} · ${bookingDetails.selectedTime || ""}`;
    } catch {
      return `${bookingDetails.selectedDate} · ${bookingDetails.selectedTime || ""}`;
    }
  })();

  const patientName = patientInfo?.fullName || "—";
  const patientGender = patientInfo?.gender || "";
  const patientAge = calculateAge(parseDobToIso(patientInfo?.dob));
  const patientPhone = patientInfo?.mobileNumber || "";
  const patientEmail = patientInfo?.email || "";

  const patientHeadline = [
    patientName,
    patientAge ? `${patientAge} yrs` : null,
    patientGender || null,
  ]
    .filter(Boolean)
    .join(" · ");

  const patientContact = [patientPhone, patientEmail].filter(Boolean).join(" · ");

  const consultationFee = parseFee(bookingDetails?.consultationFee, 800);
  const platformFee = 49;
  const discount = 160;
  const gst = Math.round((consultationFee + platformFee) * 0.18);
  const totalPayable = consultationFee + platformFee + gst - discount;

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
                onClick={handleBack}
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
                    {doctorName}
                  </strong>

                  <span>
                    {doctorSpecialty}
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
                    {formattedWhen}
                  </strong>

                  <span>
                    {visitMode} consultation
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
                    {visitMode}
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
                    {patientHeadline || "Patient details not available"}
                  </strong>

                  <span>
                    {patientContact}
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
                    applied — you saved ₹{discount} on this consultation.
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

              {paymentError && (
                <p
                  className="re-payment-error"
                  style={{ color: "#dc2626", marginBottom: 8, fontSize: 14 }}
                >
                  {paymentError}
                </p>
              )}

              <button
                className="re-payment-btn"
                onClick={handleProceed}
                disabled={isProcessingPayment}
              >
                {isProcessingPayment ? "Processing…" : "Proceed to Payment"}

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
                src={doctorImage}
                alt={doctorName}
                onError={(e) => { e.target.src = dock; }}
              />

              <div>

                <h3>
                  {doctorName}
                </h3>

                <p>
                  {doctorSpecialty}
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
                {patientName}
              </strong>

            </div>


            <div className="re-summary-divider"></div>


            <div className="re-payment-summary-row">

              <span>
                Consultation fee
              </span>

              <strong>
                ₹{consultationFee}
              </strong>

            </div>


            <div className="re-payment-summary-row">

              <span>
                Booking platform fee
              </span>

              <strong>
                ₹{platformFee}
              </strong>

            </div>


            <div className="re-payment-summary-row">

              <span>
                GST (18%)
              </span>

              <strong>
                ₹{gst}
              </strong>

            </div>


            <div className="re-payment-summary-row re-discount">

              <span>
                Coupon - LFH20
              </span>

              <strong>
                −₹{discount}
              </strong>

            </div>


            <div className="re-summary-divider"></div>


            {/* ================= TOTAL ================= */}
            <div className="re-payable-total">

              <span>
                TOTAL PAYABLE
              </span>

              <strong>
                ₹{totalPayable}
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
