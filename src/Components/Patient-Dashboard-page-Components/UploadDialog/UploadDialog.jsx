import React, { useEffect, useRef, useState } from "react";
import "./UploadDialog.css";
import googleDriveLogo from "../../../asserts/google-drive.svg";
import { Icon } from "../PatientAppointments/PatientAppointments";

export const ACCEPTED_TYPES = ["application/pdf", "image/jpeg", "image/png"];
export const MAX_FILE_SIZE = 1024 * 1024; // 1 MB

export const UPLOAD_ERRORS = {
  missing: "Please choose a file to upload",
  format: "Unsupported format. Please upload a different format",
  size: "File too large. Please upload a file within 1MB",
  failed: "Upload failed. Please try again",
  retry: "An error occurred. Retry upload",
};

// Stand-in for the real upload API call.
export const defaultUpload = () =>
  new Promise((resolve) => setTimeout(resolve, 700));

/*
 * Single-file upload dialog from the patient dashboard designs
 * ("Add your prescription", "Upload your medical reports").
 * upload(file, attempt) should reject with an error named "NetworkError"
 * for connection failures; any other rejection shows the generic retry message.
 */
export default function UploadDialog({
  title,
  subtitle,
  onClose,
  onUploaded,
  upload = defaultUpload,
  onGoogleDrive,
}) {
  const fileInput = useRef(null);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const onKey = (event) => event.key === "Escape" && !uploading && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, uploading]);

  const pickFile = (selected) => {
    if (!selected) return;
    setNotice("");
    if (!ACCEPTED_TYPES.includes(selected.type)) {
      setFile(null);
      setError(UPLOAD_ERRORS.format);
      return;
    }
    if (selected.size > MAX_FILE_SIZE) {
      setFile(null);
      setError(UPLOAD_ERRORS.size);
      return;
    }
    setError("");
    setFile(selected);
  };

  const handleUpload = async () => {
    if (!file) {
      setError(UPLOAD_ERRORS.missing);
      return;
    }
    setUploading(true);
    setError("");
    try {
      await upload(file, attempt);
      onUploaded(file);
    } catch (uploadError) {
      setError(
        uploadError?.name === "NetworkError" ? UPLOAD_ERRORS.failed : UPLOAD_ERRORS.retry
      );
      setAttempt((count) => count + 1);
      setUploading(false);
    }
  };

  const handleDrive = () => {
    setError("");
    if (onGoogleDrive) {
      onGoogleDrive();
      return;
    }
    setNotice("Google Drive isn't connected yet. Please upload from your device.");
  };

  return (
    <div className="ud-overlay" onClick={() => !uploading && onClose()}>
      <div
        className="ud-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ud-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="ud-close"
          onClick={onClose}
          disabled={uploading}
          aria-label="Close"
        >
          <Icon name="close" size={24} />
        </button>

        <div className="ud-head">
          <h2 id="ud-title">{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>

        <div className="ud-body">
          <div
            className={`ud-drop ${dragging ? "is-dragging" : ""} ${file ? "has-file" : ""}`}
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(event) => {
              event.preventDefault();
              setDragging(false);
              pickFile(event.dataTransfer.files[0]);
            }}
          >
            <span className="ud-drop-icon" aria-hidden="true">
              <Icon name={file ? "checkCircle" : "upload"} size={20} />
            </span>

            {file ? (
              <>
                <p className="ud-drop-text">
                  <strong>{file.name}</strong>
                </p>
                <p className="ud-drop-hint">
                  {Math.max(1, Math.round(file.size / 1024))} KB ·{" "}
                  <button
                    type="button"
                    className="ud-link"
                    onClick={() => fileInput.current.click()}
                    disabled={uploading}
                  >
                    Choose another
                  </button>
                </p>
              </>
            ) : (
              <>
                <p className="ud-drop-text">
                  Drag and drop or{" "}
                  <button
                    type="button"
                    className="ud-link"
                    onClick={() => fileInput.current.click()}
                  >
                    click here
                  </button>
                </p>
                <p className="ud-drop-hint">PNG/ JPEG/ PDF formats (max size 1 MB)</p>
              </>
            )}

            <input
              ref={fileInput}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              hidden
              onChange={(event) => {
                pickFile(event.target.files[0]);
                event.target.value = "";
              }}
            />
          </div>

          <div className="ud-divider">
            <span>or</span>
          </div>

          <div className="ud-drive">
            <p>Upload from</p>
            <button
              type="button"
              className="ud-drive-button"
              onClick={handleDrive}
              disabled={uploading}
            >
              <img src={googleDriveLogo} alt="" width="27" height="24" />
              Google Drive
            </button>
          </div>

          {error && (
            <p className="ud-error" role="alert">
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              {error}
            </p>
          )}
          {notice && !error && <p className="ud-notice">{notice}</p>}
        </div>

        <div className="ud-actions">
          <button
            type="button"
            className="ud-button ud-button--outline"
            onClick={onClose}
            disabled={uploading}
          >
            Cancel
          </button>
          <button
            type="button"
            className="ud-button ud-button--primary"
            onClick={handleUpload}
            disabled={uploading}
          >
            {uploading ? "Uploading…" : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
}
