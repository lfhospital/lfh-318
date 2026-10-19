import { useEffect, useRef, useState } from "react";
import { Search, ChevronDown, Check } from "lucide-react";
import "./DoctorsDirectoryHero.css";

export const SORT_OPTIONS = [
  { value: "recommended", label: "Recommended" },
  { value: "experience", label: "Most experienced" },
  { value: "available", label: "Available soonest" },
  { value: "name", label: "Name (A–Z)" },
];

export default function DoctorsDirectoryHero({
  doctorCount = 0,
  searchQuery = "",
  onSearchChange,
  sortBy = "recommended",
  onSortChange,
}) {
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef(null);
  const sortLabel = SORT_OPTIONS.find((o) => o.value === sortBy)?.label;

  // Close the sort menu on an outside click or Escape
  useEffect(() => {
    if (!sortOpen) return;
    const handleClick = (e) => {
      if (!sortRef.current?.contains(e.target)) setSortOpen(false);
    };
    const handleKey = (e) => e.key === "Escape" && setSortOpen(false);
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [sortOpen]);

  return (
    <section className="doctors-directory-hero">
      <div className="directory-content">
        <span className="directory-tag">DOCTORS DIRECTORY</span>

        <h1 className="directory-title">
          Find your right
          <br />
          specialist
        </h1>

        <p className="directory-description">
          Experienced doctors and specialists across disciplines, all within one
          connected healthcare system.
        </p>

        <div className="directory-bottom">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by doctor name"
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
            />
            <Search size={20} strokeWidth={1.8} />
          </div>

          <div className="right-controls">
            <span className="doctor-count">
              {doctorCount} {doctorCount === 1 ? 'doctor' : 'doctors'} available today
            </span>

            <div className="doctor-sort" ref={sortRef}>
              <button
                className="sort-btn"
                aria-haspopup="listbox"
                aria-expanded={sortOpen}
                onClick={() => setSortOpen((open) => !open)}
              >
                Sort By: {sortLabel}
                <ChevronDown size={22} />
              </button>

              {sortOpen && (
                <ul className="doctor-sort-menu" role="listbox" aria-label="Sort doctors">
                  {SORT_OPTIONS.map((option) => (
                    <li
                      key={option.value}
                      role="option"
                      aria-selected={option.value === sortBy}
                      tabIndex={0}
                      onClick={() => {
                        onSortChange?.(option.value);
                        setSortOpen(false);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          onSortChange?.(option.value);
                          setSortOpen(false);
                        }
                      }}
                    >
                      {option.label}
                      {option.value === sortBy && <Check size={16} />}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}