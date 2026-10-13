import React from "react";
import { ChevronDown } from "lucide-react";

// Outlined dropdown; a transparent native <select> sits on top for accessibility
export function FilterSelect({ label, value, options, onChange, alwaysShowValue = false }) {
  const current = options.find((o) => o.value === value);
  const showValue = current && (value !== "all" || alwaysShowValue);
  return (
    <label className="dash-filter">
      <span>
        {label}
        {showValue && (
          <>
            : <strong>{current.label}</strong>
          </>
        )}
      </span>
      <ChevronDown size={20} strokeWidth={1.5} />
      <select value={value} onChange={(e) => onChange(e.target.value)} aria-label={label}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

// Segmented toggle; `options` is a list of [value, label] pairs
export function SegmentedTabs({ options, value, onChange, label, className = "" }) {
  return (
    <div className={`dash-tabs ${className}`} role="group" aria-label={label}>
      {options.map(([key, text]) => (
        <button
          key={key}
          type="button"
          className={value === key ? "active" : ""}
          aria-pressed={value === key}
          onClick={() => onChange(key)}
        >
          {text}
        </button>
      ))}
    </div>
  );
}
