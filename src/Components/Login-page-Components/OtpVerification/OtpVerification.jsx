import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Clock } from "lucide-react";
import "./OtpVerification.css";
import { sendOtp, verifyOtp } from "../loginApi";
import { savePatientSession } from "../../../utils/patientSession";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;

// Only follow same-site paths (e.g. "/patient-info"), never "//evil.com"
const safeRedirect = (path) =>
  path && path.startsWith("/") && !path.startsWith("//") ? path : "/dashboard";

export default function OtpVerification({ phone, phno, onBack }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const [error, setError] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const inputsRef = useRef([]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  const focusBox = (index) => {
    const box = inputsRef.current[Math.max(0, Math.min(index, OTP_LENGTH - 1))];
    box?.focus();
    box?.select();
  };

  const fillFrom = (index, digits) => {
    const next = [...otp];
    digits.split("").forEach((d, i) => {
      if (index + i < OTP_LENGTH) next[index + i] = d;
    });
    setOtp(next);
    setError("");
    focusBox(index + digits.length);
  };

  const handleChange = (index, e) => {
    const digits = e.target.value.replace(/\D/g, "");
    if (!digits) {
      const next = [...otp];
      next[index] = "";
      setOtp(next);
      return;
    }
    // Typing over a filled box gives "old+new", so keep only the new digit
    fillFrom(index, digits.length > 1 && otp[index] ? digits.slice(-1) : digits);
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      e.preventDefault();
      const next = [...otp];
      next[index - 1] = "";
      setOtp(next);
      focusBox(index - 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      focusBox(index - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      focusBox(index + 1);
    }
  };

  const handlePaste = (index, e) => {
    const digits = e.clipboardData.getData("text").replace(/\D/g, "");
    if (!digits) return;
    e.preventDefault();
    fillFrom(index, digits.slice(0, OTP_LENGTH - index));
  };

  const handleResend = async () => {
    if (secondsLeft > 0 || resending) return;
    setResending(true);
    setError("");
    const result = await sendOtp(phno);
    setResending(false);
    if (!result.ok) {
      setError(result.message || "We couldn't resend the OTP. Please try again.");
      return;
    }
    setOtp(Array(OTP_LENGTH).fill(""));
    setSecondsLeft(RESEND_SECONDS);
    focusBox(0);
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (verifying) return;
    if (otp.some((d) => !d)) {
      setError(`Please enter the ${OTP_LENGTH}-digit code`);
      return;
    }
    setVerifying(true);
    setError("");
    const result = await verifyOtp(phno, otp.join(""));
    setVerifying(false);
    if (!result.ok) {
      setError(result.message || "That code is incorrect. Please try again.");
      setOtp(Array(OTP_LENGTH).fill(""));
      focusBox(0);
      return;
    }
    if (!result.data?.patientid) {
      setError("We verified your number but couldn't load your account. Please try again.");
      return;
    }
    savePatientSession(phno, result.data);
    navigate(safeRedirect(searchParams.get("redirect")), { replace: true });
  };

  const timerLabel = `0:${String(secondsLeft).padStart(2, "0")}`;

  return (
    <form className="login-panel-content otp-content" onSubmit={handleVerify} noValidate>
      <div className="otp-top">
        <button
          type="button"
          className="otp-back"
          onClick={onBack}
          aria-label="Change mobile number"
        >
          <ArrowLeft size={16} strokeWidth={1.8} />
        </button>

        <div className="login-heading">
          <h2>Enter the code.</h2>
          <p>
            We sent a {OTP_LENGTH}-digit code to <strong>{phone}</strong>
          </p>
        </div>
      </div>

      <div className="otp-field">
        <div className="otp-row">
          <div className="otp-boxes">
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputsRef.current[i] = el)}
                className={`otp-box ${error ? "has-error" : ""}`}
                type="text"
                inputMode="numeric"
                autoComplete={i === 0 ? "one-time-code" : "off"}
                maxLength={OTP_LENGTH}
                placeholder="0"
                value={digit}
                aria-label={`Digit ${i + 1}`}
                onChange={(e) => handleChange(i, e)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={(e) => handlePaste(i, e)}
                onFocus={(e) => e.target.select()}
              />
            ))}
          </div>

          <span className="otp-timer">
            <Clock size={12} strokeWidth={1.5} />
            Resend in {timerLabel}
          </span>
        </div>

        {error && (
          <p className="otp-error" role="alert">
            {error}
          </p>
        )}

        <button
          type="button"
          className="otp-resend"
          onClick={handleResend}
          disabled={secondsLeft > 0 || resending}
        >
          {resending ? "Sending..." : "Resend OTP"}
        </button>
      </div>

      <button
        type="submit"
        className="login-otp-btn otp-verify-btn"
        disabled={verifying}
      >
        {verifying ? "Verifying..." : "Verify & continue"}
      </button>
    </form>
  );
}
