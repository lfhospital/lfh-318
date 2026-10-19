import React, { useEffect, useRef } from "react";
import "./ConfirmDialog.css";
import { Icon } from "../PatientAppointments/PatientAppointments";

/*
 * Two-button confirmation dialog from the patient dashboard designs
 * (dark blurred backdrop, circled close icon, equal-width actions).
 */
export default function ConfirmDialog({
  title,
  subtitle,
  children,
  secondaryLabel,
  primaryLabel,
  onSecondary,
  onPrimary,
  onClose,
  width = 26.625,
}) {
  const primaryRef = useRef(null);

  useEffect(() => {
    primaryRef.current?.focus();
    const onKey = (event) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="cd-overlay" onClick={onClose}>
      <div
        className="cd-modal"
        style={{ maxWidth: `${width}rem` }}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="cd-title"
        aria-describedby={subtitle ? "cd-subtitle" : undefined}
        onClick={(event) => event.stopPropagation()}
      >
        <button className="cd-close" onClick={onClose} aria-label="Close">
          <Icon name="close" size={14} />
        </button>

        <div className="cd-heading">
          <h2 id="cd-title">{title}</h2>
          {subtitle && <p id="cd-subtitle">{subtitle}</p>}
        </div>

        {children && <div className="cd-body">{children}</div>}

        <div className="cd-actions">
          <button className="cd-button cd-button--outline" onClick={onSecondary}>
            {secondaryLabel}
          </button>
          <button
            ref={primaryRef}
            className="cd-button cd-button--primary"
            onClick={onPrimary}
          >
            {primaryLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
