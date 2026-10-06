import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../Footer/DoctorFooter";
import Navbar from "../../Navbar/Navbar";
import dock from "../../../../asserts/doctor.png";
import "./PatientInfo.css";
import { ChevronLeft, Upload, FileText, X } from "lucide-react";

// Base URL reports are served from once uploaded — mirrors the pattern
// already used for doctor profile photos elsewhere in the app.
const S3_BASE_URL = "https://ishah.s3.ap-southeast-1.amazonaws.com/";

// Uploads a single file (image or PDF) to the hospital's AWS upload
// endpoint and returns the public URL for it.
async function uploadReportFile(file) {
  const formData = new FormData();
  formData.append("type", "patient");
  formData.append("file", file);

  const response = await fetch("https://ishah.in/api/lfhospital/awsupload", {
    method: "POST",
    body: formData,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok || !data || !data.success || !data.uploadedLinks || !data.uploadedLinks.length) {
    throw new Error((data && data.message) || "Upload failed");
  }

  const link = data.uploadedLinks[0];
  return { link, url: `${S3_BASE_URL}${link}` };
}

// Generates a 24-character hex string, mirroring the shape of a MongoDB
// ObjectId, so a new patient record can be created with a client-side id.
function generateObjectId() {
  const timestamp = Math.floor(Date.now() / 1000).toString(16).padStart(8, "0");
  let random = "";
  for (let i = 0; i < 16; i++) {
    random += Math.floor(Math.random() * 16).toString(16);
  }
  return timestamp + random;
}

// Converts a DD/MM/YYYY string (as typed in the Date of birth field) into
// an ISO YYYY-MM-DD string the backend expects. Returns null if the input
// isn't a complete/valid date.
function toIsoDate(ddmmyyyy) {
  if (!ddmmyyyy) return null;
  const match = ddmmyyyy.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!match) return null;
  const [, dd, mm, yyyy] = match;
  const day = dd.padStart(2, "0");
  const month = mm.padStart(2, "0");
  return `${yyyy}-${month}-${day}`;
}

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

export default function PatientInfo({ onContinue, onBack }) {
  const navigate = useNavigate();

  const [bookingDetails, setBookingDetails] = useState(null);
  const [patientType, setPatientType] = useState("self");
  const [gender, setGender] = useState("");
  // Holds { name, url, type } for the uploaded report once the file has
  // finished uploading to S3 via the awsupload endpoint.
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    email: "",
    dob: "",
    reason: "",
  });

  // Load the doctor/slot selection saved in Step 0 (Doctor Profile page),
  // and any previously filled patient info if the user navigated back.
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
        const parsed = JSON.parse(storedPatientInfo);
        setFormData({
          fullName: parsed.fullName || "",
          mobileNumber: parsed.mobileNumber || "",
          email: parsed.email || "",
          dob: parsed.dob || "",
          reason: parsed.reason || "",
        });
        setGender(parsed.gender || "");
        setPatientType(parsed.patientType || "self");
        setConsentChecked(parsed.consentChecked || false);
        setUploadedFile(parsed.uploadedFile || null);
      } catch (e) {
        console.error("Failed to parse patientInfo from localStorage", e);
      }
    }
  }, []);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    setUploadError("");
    setUploadingFile(true);

    try {
      const { url } = await uploadReportFile(file);
      setUploadedFile({
        name: file.name,
        url,
        type: file.type,
      });
    } catch (err) {
      console.error("Error uploading report:", err);
      setUploadError("Upload failed. Please try again.");
    } finally {
      setUploadingFile(false);
      // Allow re-selecting the same file name later.
      e.target.value = "";
    }
  };

  const handleRemoveUploadedFile = () => {
    setUploadedFile(null);
    setPreviewOpen(false);
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = "Mobile number is required";
    } else if (!/^[0-9+\s-]{7,15}$/.test(formData.mobileNumber.trim())) {
      newErrors.mobileNumber = "Enter a valid mobile number";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Enter a valid email address";
    }

    if (!gender) {
      newErrors.gender = "Please select a gender";
    }

    if (!consentChecked) {
      newErrors.consent = "Please provide consent to continue";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = async () => {
    if (!validate()) {
      return;
    }

    const patientInfo = {
      ...formData,
      gender,
      patientType,
      consentChecked,
      uploadedFile,
    };

    localStorage.setItem("patientInfo", JSON.stringify(patientInfo));

    // Build the payload for the "create patient account" API call. A fresh
    // client-side id is generated (and reused if we already created one for
    // this visit, e.g. the user went Back and came forward again).
    const existingPatientId = localStorage.getItem("patientId");
    const patientId = existingPatientId || generateObjectId();

    const isoDob = toIsoDate(formData.dob);
    const age = calculateAge(isoDob);

    const payload = {
      patientid: patientId,
      name: formData.fullName.trim(),
      email: formData.email.trim(),
      gender: gender.toLowerCase(),
      dob: isoDob,
      age: age,
      phoneNumber: formData.mobileNumber.trim(),
      height: 0,
      weight: 0,
      imageurl: "",
      notifications: {
        appointments: true,
        reports_prescriptions: true,
        offers: false,
      },
    };

    setSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch(
        "https://ishah.in/api/lfhospital/patients/createaccount",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json().catch(() => null);

      if (response.ok && result && result.success) {
        localStorage.setItem("patientId", patientId);
        localStorage.setItem("patientAccount", JSON.stringify(result.data));
      } else {
        console.error("Create account API returned an error:", result);
        setSubmitError(
          (result && result.message) ||
            "We couldn't save your details right now, but you can continue."
        );
      }
    } catch (err) {
      console.error("Error calling createaccount API:", err);
      setSubmitError(
        "We couldn't reach the server, but your details are saved locally."
      );
    } finally {
      setSubmitting(false);
    }

    if (onContinue) {
      onContinue();
    } else {
      navigate("/review");
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const doctorName = bookingDetails?.doctorName || "Dr. Ananya Menon";
  const doctorSpecialty = bookingDetails?.specialty || "Cardiologist · Interventional";
  const doctorImage = bookingDetails?.doctorImage || dock;
  const consultationFee = bookingDetails?.consultationFee || "₹800";

  const formattedDateTime = (() => {
    if (!bookingDetails?.selectedDate) return "Select a date & time";
    try {
      const dateObj = new Date(bookingDetails.selectedDate);
      const dateStr = dateObj.toLocaleDateString("en-IN", {
        weekday: "short",
        day: "2-digit",
        month: "short",
      });
      return `${dateStr} · ${bookingDetails.selectedTime || ""}`;
    } catch {
      return `${bookingDetails.selectedDate} · ${bookingDetails.selectedTime || ""}`;
    }
  })();

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
            <button className="back-btn" onClick={handleBack}>
              <ChevronLeft size={18} />
              <span>Back</span>
            </button>
            <h2>Tell us about the patient.</h2>
            <p className="subtitle">
              We use this to prepare the consult and pre-fill your records. Five
              fields, no more.
            </p>
            {/* Patient type */}
            <div className="patient-type">
              <button
                type="button"
                className={patientType === "self" ? "active" : ""}
                onClick={() => setPatientType("self")}
              >
                For myself
              </button>
              <button
                type="button"
                className={patientType === "other" ? "active" : ""}
                onClick={() => setPatientType("other")}
              >
                For someone else
              </button>
            </div>

            <h5 className="bsection-title">Patient Information</h5>

            {/* ================= FORM ================= */}
            <div className="form-grid">
              <div className="field">
                <label>
                  FULL NAME <span>*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter name"
                  value={formData.fullName}
                  onChange={handleChange("fullName")}
                />
                {errors.fullName && (
                  <small style={{ color: "#c0392b" }}>{errors.fullName}</small>
                )}
              </div>
              <div className="field">
                <label>
                  MOBILE NUMBER <span>*</span>
                </label>
                <input
                  type="text"
                  placeholder="+91 00000 00000"
                  value={formData.mobileNumber}
                  onChange={handleChange("mobileNumber")}
                />
                {errors.mobileNumber && (
                  <small style={{ color: "#c0392b" }}>{errors.mobileNumber}</small>
                )}
              </div>
              <div className="field email-field">
                <label>
                  EMAIL <span>*</span>
                </label>
                <input
                  type="email"
                  placeholder="name@email.com"
                  value={formData.email}
                  onChange={handleChange("email")}
                />
                {errors.email && (
                  <small style={{ color: "#c0392b" }}>{errors.email}</small>
                )}
              </div>
              <div className="field dob-field">
                <label>DATE OF BIRTH</label>
                <input
                  type="text"
                  placeholder="DD/MM/YYYY"
                  value={formData.dob}
                  onChange={handleChange("dob")}
                />
              </div>
              <div className="field gender">
                <label>
                  GENDER <span>*</span>
                </label>
                <div className="gender-buttons">
                  <button
                    type="button"
                    className={gender === "Male" ? "active" : ""}
                    onClick={() => {
                      setGender("Male");
                      setErrors((prev) => ({ ...prev, gender: undefined }));
                    }}
                  >
                    Male
                  </button>
                  <button
                    type="button"
                    className={gender === "Female" ? "active" : ""}
                    onClick={() => {
                      setGender("Female");
                      setErrors((prev) => ({ ...prev, gender: undefined }));
                    }}
                  >
                    Female
                  </button>
                  <button
                    type="button"
                    className={gender === "Other" ? "active" : ""}
                    onClick={() => {
                      setGender("Other");
                      setErrors((prev) => ({ ...prev, gender: undefined }));
                    }}
                  >
                    Other
                  </button>
                </div>
                {errors.gender && (
                  <small style={{ color: "#c0392b" }}>{errors.gender}</small>
                )}
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
              <textarea
                placeholder="Enter reason"
                value={formData.reason}
                onChange={handleChange("reason")}
              ></textarea>
            </div>
            {/* ================= UPLOAD ================= */}
            <div className="upload">
              <label>UPLOAD REPORTS (ECG, ECHO, PRESCRIPTIONS)</label>

              {!uploadedFile && (
                <label
                  className="upload-box"
                  style={{ cursor: uploadingFile ? "not-allowed" : "pointer" }}
                >
                  <div className="upload-content">
                    <Upload size={13} />
                    <span>
                      {uploadingFile
                        ? "Uploading..."
                        : "Drag PDFs or images here, or browse"}
                    </span>
                  </div>
                  <small>PDF, JPG · Max 10 MB</small>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                    disabled={uploadingFile}
                  />
                </label>
              )}

              {uploadedFile && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.6rem",
                    marginTop: "0.5rem",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setPreviewOpen(true)}
                    title="Click to preview"
                    style={{
                      width: "3rem",
                      height: "3rem",
                      flexShrink: 0,
                      padding: 0,
                      border: "0.05rem solid #d9d9d9",
                      borderRadius: "0.3rem",
                      overflow: "hidden",
                      cursor: "pointer",
                      background: "#F7F5F0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {uploadedFile.type && uploadedFile.type.startsWith("image/") ? (
                      <img
                        src={uploadedFile.url}
                        alt={uploadedFile.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <FileText size={20} color="#7A7D80" />
                    )}
                  </button>

                  <span
                    onClick={() => setPreviewOpen(true)}
                    style={{
                      fontSize: "0.6875rem",
                      color: "#4A4A4A",
                      cursor: "pointer",
                      textDecoration: "underline",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      maxWidth: "12rem",
                    }}
                  >
                    {uploadedFile.name}
                  </span>

                  <button
                    type="button"
                    onClick={handleRemoveUploadedFile}
                    title="Remove file"
                    style={{
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      color: "#999",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <X size={16} />
                  </button>
                </div>
              )}

              {uploadError && (
                <small style={{ color: "#c0392b", display: "block", marginTop: "0.4rem" }}>
                  {uploadError}
                </small>
              )}
            </div>

            {/* ================= FILE PREVIEW MODAL ================= */}
            {previewOpen && uploadedFile && (
              <div
                onClick={() => setPreviewOpen(false)}
                style={{
                  position: "fixed",
                  inset: 0,
                  background: "rgba(0,0,0,0.6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1000,
                }}
              >
                <div
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    background: "#fff",
                    borderRadius: "0.4rem",
                    padding: "1rem",
                    maxWidth: "90vw",
                    maxHeight: "90vh",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <strong style={{ fontSize: "0.85rem", color: "#333" }}>
                      {uploadedFile.name}
                    </strong>
                    <button
                      type="button"
                      onClick={() => setPreviewOpen(false)}
                      style={{
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        color: "#555",
                      }}
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {uploadedFile.type && uploadedFile.type.startsWith("image/") ? (
                    <img
                      src={uploadedFile.url}
                      alt={uploadedFile.name}
                      style={{
                        maxWidth: "80vw",
                        maxHeight: "75vh",
                        objectFit: "contain",
                      }}
                    />
                  ) : (
                    <iframe
                      src={uploadedFile.url}
                      title={uploadedFile.name}
                      style={{ width: "80vw", height: "75vh", border: "none" }}
                    />
                  )}
                </div>
              </div>
            )}
            {/* ================= CONSENT ================= */}
            <label className="checkbox">
              <input
                type="checkbox"
                checked={consentChecked}
                onChange={(e) => {
                  setConsentChecked(e.target.checked);
                  setErrors((prev) => ({ ...prev, consent: undefined }));
                }}
              />
              <span>
                I consent to share my information with {doctorName} and the
                Lakshmee care team for the purpose of this consultation.
                <b> Privacy policy</b>
              </span>
            </label>
            {errors.consent && (
              <small style={{ color: "#c0392b" }}>{errors.consent}</small>
            )}
            {submitError && (
              <small style={{ color: "#c0392b", display: "block", marginTop: "0.5rem" }}>
                {submitError}
              </small>
            )}
            {/* ================= BUTTON ================= */}
            <div className="btn-area">
              <button
                className="continue-btn"
                onClick={handleContinue}
                disabled={submitting || !consentChecked}
                style={
                  submitting || !consentChecked
                    ? { opacity: 0.5, cursor: "not-allowed" }
                    : undefined
                }
              >
                {submitting ? "Saving..." : "Continue to review"}
                <span>→</span>
              </button>
            </div>
          </div>
          {/* ================= RIGHT SUMMARY ================= */}
          <div className="summary-card">
            <h5>BOOKING SUMMARY</h5>
            <div className="doctor">
              <img src={doctorImage} alt={doctorName} onError={(e) => { e.target.src = dock; }} />
              <div>
                <h3>{doctorName}</h3>
                <p>{doctorSpecialty}</p>
              </div>
            </div>
            <div className="summary-divider"></div>
            <div className="summary-row">
              <span className="title">Patient</span>
              <p>
                {formData.fullName || "—"}
                {formData.mobileNumber ? `\u00A0·\u00A0${formData.mobileNumber}` : ""}
              </p>
            </div>
            <div className="summary-row">
              <span className="title">Date & time</span>
              <p>{formattedDateTime}</p>
            </div>
            <div className="summary-row">
              <span className="title">Visit type</span>
              <p>
                First consultation&nbsp; · &nbsp;
                {bookingDetails?.selectedMode === "virtual" ? "Virtual" : "In person"}
              </p>
            </div>
            <div className="summary-divider"></div>
            <div className="total">
              <span>TOTAL</span>
              <h2>{consultationFee}</h2>
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
