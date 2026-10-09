import React, { useState } from "react";
import { ChevronDown, Lock } from "lucide-react";
import "./Login.css";
import googleIcon from "../../../asserts/google-icon.svg";
import OtpVerification from "../OtpVerification/OtpVerification";
import { sendOtp } from "../loginApi";

const countryCodes = [
  { code: "IND", dial: "+91", length: 10 },
  { code: "USA", dial: "+1", length: 10 },
  { code: "UAE", dial: "+971", length: 9 },
  { code: "UK", dial: "+44", length: 10 },
];

export default function Login() {
  const [country, setCountry] = useState(countryCodes[0]);
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState("phone");
  const [sending, setSending] = useState(false);

  const handleCountryChange = (e) => {
    setCountry(countryCodes.find((c) => c.code === e.target.value));
    setError("");
  };

  const handleMobileChange = (e) => {
    setMobile(e.target.value.replace(/\D/g, "").slice(0, country.length));
    setError("");
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (sending) return;
    if (mobile.length !== country.length) {
      setError(`Please enter a valid ${country.length}-digit mobile number`);
      return;
    }
    setSending(true);
    setError("");
    const result = await sendOtp(mobile);
    setSending(false);
    if (!result.ok) {
      setError(result.message || "We couldn't send the OTP. Please try again.");
      return;
    }
    setStep("otp");
  };

  const intro =
    step === "otp"
      ? {
          title: "One quick ",
          accent: "security step.",
          text: "Every sign in is verified to keep your account and health information safe, secure and private.",
        }
      : {
          title: "Your care, ",
          accent: "always within reach.",
          text: "Appointments, reports, prescriptions and payments for you and your family. All in one secure place.",
        };

  return (
    <section className="login-section">
      <div className="login-intro">
        <div className="login-intro-content">
          <h1 className="login-intro-title">
            {intro.title}
            <span>{intro.accent}</span>
          </h1>
          <p className="login-intro-text">{intro.text}</p>
        </div>
      </div>

      <div className="login-panel">
        {step === "otp" ? (
          <OtpVerification
            phone={`${country.dial} ${mobile}`}
            phno={mobile}
            onBack={() => setStep("phone")}
          />
        ) : (
          <div className="login-panel-content">
            <div className="login-heading">
              <h2>Welcome</h2>
              <p>
                Sign in securely with your registered mobile number. A one time
                password will be sent to you.
              </p>
            </div>

            <form className="login-form" onSubmit={handleSendOtp} noValidate>
              <label htmlFor="login-mobile" className="login-label">
                Mobile number
              </label>

              <div className="login-input-row">
                <div className={`login-input ${error ? "has-error" : ""}`}>
                  <div className="login-country">
                    <select
                      value={country.code}
                      onChange={handleCountryChange}
                      aria-label="Country code"
                    >
                      {countryCodes.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.code}
                        </option>
                      ))}
                    </select>
                    <span className="login-country-code">{country.code}</span>
                    <ChevronDown size={20} strokeWidth={1.67} />
                  </div>

                  <div className="login-phone">
                    <span className="login-dial">{country.dial}</span>
                    <input
                      id="login-mobile"
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel-national"
                      placeholder="00000 00000"
                      value={mobile}
                      onChange={handleMobileChange}
                    />
                  </div>
                </div>

                <button type="submit" className="login-otp-btn" disabled={sending}>
                  {sending ? "Sending..." : "Send OTP"}
                </button>
              </div>

              {error ? (
                <p className="login-hint login-error" role="alert">
                  {error}
                </p>
              ) : (
                <p className="login-hint">
                  <Lock size={12} strokeWidth={1.5} />
                  We never share your number. OTP valid for 10 minutes
                </p>
              )}
            </form>

            <div className="login-alt">
              <span className="login-label">Or</span>
              <button type="button" className="login-google-btn">
                <img src={googleIcon} alt="" width="24" height="24" />
                Sign in with Google
              </button>
            </div>

            <div className="login-signup">
              <p>New here?</p>
              <a href="#" className="login-signup-link">
                Create an account
              </a>
            </div>

            <p className="login-terms">
              By continuing you agree to our <a href="#">Terms</a> and{" "}
              <a href="#">Privacy Policy</a>. This portal is HIPAA-aligned and
              NABH compliant.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
