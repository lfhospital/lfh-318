import React, { useEffect, useId, useRef, useState } from "react";
import "./FilterMenu.css";

/*
 * Dropdown filter button from the patient dashboard designs
 * ("Status ⌄", "Patient: Me ⌄", "Sort: All ⌄").
 * options: [{ value, label }]; the first option is the "all" choice and is
 * separated from the rest. With hideAllValue the button shows just the label
 * while that first option is selected (e.g. "Status").
 */
export default function FilterMenu({
  label,
  value,
  options,
  onChange,
  hideAllValue = false,
  align = "left",
  className = "",
}) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const wrapRef = useRef(null);
  const listRef = useRef(null);
  const listId = useId();

  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value)
  );
  const selected = options[selectedIndex];
  const showValue = !(hideAllValue && selectedIndex === 0);

  useEffect(() => {
    if (!open) return undefined;
    const onPointer = (event) => {
      if (!wrapRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, [open]);

  useEffect(() => {
    if (open) listRef.current?.children[activeIndex]?.focus();
  }, [open, activeIndex]);

  const openMenu = () => {
    setActiveIndex(selectedIndex);
    setOpen(true);
  };

  const choose = (option) => {
    onChange(option.value);
    setOpen(false);
    wrapRef.current?.querySelector(".fm-trigger")?.focus();
  };

  const onListKey = (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => Math.min(options.length - 1, index + 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(0, index - 1));
    } else if (event.key === "Escape" || event.key === "Tab") {
      setOpen(false);
    }
  };

  return (
    <div className={`fm ${className}`} ref={wrapRef}>
      <button
        type="button"
        className={`fm-trigger ${open ? "is-open" : ""}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" && !open) {
            event.preventDefault();
            openMenu();
          }
        }}
      >
        <span>
          {label}
          {showValue && (
            <>
              : <strong>{selected.label}</strong>
            </>
          )}
        </span>
        <svg
          className="fm-chevron"
          viewBox="0 0 24 24"
          width="18"
          height="18"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <ul
          className={`fm-list fm-list--${align}`}
          id={listId}
          role="listbox"
          aria-label={label}
          ref={listRef}
          onKeyDown={onListKey}
        >
          {options.map((option, index) => (
            <li
              key={option.value}
              role="option"
              tabIndex={-1}
              aria-selected={option.value === value}
              className={`fm-option ${option.value === value ? "is-selected" : ""} ${
                index === 0 ? "is-first" : ""
              }`}
              onClick={() => choose(option)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  choose(option);
                }
              }}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
