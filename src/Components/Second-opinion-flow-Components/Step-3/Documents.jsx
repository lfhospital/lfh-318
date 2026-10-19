import React, { useRef, useState } from "react";
import { Check, FileText, UploadCloud, X } from "lucide-react";
import googleDriveLogo from "../../../asserts/google-drive.svg";
import { ContinueButton, StepIntro } from "../FlowParts";
import { ACCEPTED_TYPES, LAKSHMEE_RECORDS, MAX_FILE_BYTES } from "../flowData";

const formatSize = (bytes) =>
  bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;

export default function Documents({ uploads, recordIds, onChange, onContinue }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [notice, setNotice] = useState("");

  const addFiles = (fileList) => {
    const files = Array.from(fileList || []);
    const rejected = [];
    const accepted = files.filter((file) => {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        rejected.push(`${file.name} isn't a PNG, JPEG or PDF.`);
        return false;
      }
      if (file.size > MAX_FILE_BYTES) {
        rejected.push(`${file.name} is larger than 1 MB.`);
        return false;
      }
      return true;
    });
    setNotice(rejected.join(" "));
    if (accepted.length) {
      onChange({
        uploads: [
          ...uploads,
          ...accepted.map((file) => ({
            id: `${file.name}-${file.size}-${file.lastModified}`,
            name: file.name,
            meta: `Uploaded by you · ${formatSize(file.size)}`,
          })),
        ].filter((file, index, list) => list.findIndex((item) => item.id === file.id) === index),
      });
    }
  };

  const toggleRecord = (id) =>
    onChange({
      recordIds: recordIds.includes(id)
        ? recordIds.filter((item) => item !== id)
        : [...recordIds, id],
    });

  return (
    <div className="sof-layout">
      <StepIntro
        title={<>Upload the reports<br />you'd like reviewed.</>}
        text="Add scans, prescriptions and lab reports. Share what you have — you can always add more later."
      />

      <div className="sof-content sof-content--tight">
        <div
          className={`sof-dropzone ${dragging ? "is-dragging" : ""}`}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            addFiles(event.dataTransfer.files);
          }}
        >
          <span className="sof-dropzone-icon" aria-hidden="true">
            <UploadCloud size={18} />
          </span>
          <p>
            Drag and drop or{" "}
            <button type="button" className="sof-link" onClick={() => inputRef.current?.click()}>
              click here
            </button>
          </p>
          <span className="sof-dropzone-note">PNG/ JPEG/ PDF formats (max size 1 MB)</span>
          <input
            ref={inputRef}
            type="file"
            accept=".png,.jpg,.jpeg,.pdf"
            multiple
            hidden
            onChange={(event) => {
              addFiles(event.target.files);
              event.target.value = "";
            }}
          />
        </div>

        <div className="sof-or" aria-hidden="true">
          <span>or</span>
        </div>

        <div className="sof-drive">
          <span>Upload from</span>
          <button
            type="button"
            className="sof-drive-button"
            onClick={() => setNotice("Google Drive isn't connected yet. Please upload from your device.")}
          >
            <img src={googleDriveLogo} alt="" width="22" height="20" />
            Google Drive
          </button>
        </div>

        {notice && (
          <p className="sof-notice" role="alert">
            {notice}
          </p>
        )}

        {uploads.length > 0 && (
          <ul className="sof-files" aria-label="Uploaded files">
            {uploads.map((file) => (
              <li key={file.id}>
                <FileText size={16} />
                <span className="sof-file-text">
                  <strong>{file.name}</strong>
                  <span>{file.meta}</span>
                </span>
                <button
                  type="button"
                  className="sof-icon-button"
                  aria-label={`Remove ${file.name}`}
                  onClick={() => onChange({ uploads: uploads.filter((item) => item.id !== file.id) })}
                >
                  <X size={16} />
                </button>
              </li>
            ))}
          </ul>
        )}

        <section className="sof-records">
          <div className="sof-section-heading">
            <h2>From your Lakshmee records</h2>
            <p>Attach reports already stored in your patient portal, no re-uploading.</p>
          </div>
          <ul className="sof-record-list">
            {LAKSHMEE_RECORDS.map((record) => {
              const checked = recordIds.includes(record.id);
              return (
                <li key={record.id}>
                  <label className={`sof-record ${checked ? "is-selected" : ""}`}>
                    <span className="sof-file-text">
                      <strong>{record.name}</strong>
                      <span>{record.meta}</span>
                    </span>
                    <input type="checkbox" checked={checked} onChange={() => toggleRecord(record.id)} />
                    <span className="sof-checkbox" aria-hidden="true">
                      {checked && <Check size={14} />}
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        </section>

        <ContinueButton onClick={onContinue} />
      </div>
    </div>
  );
}
