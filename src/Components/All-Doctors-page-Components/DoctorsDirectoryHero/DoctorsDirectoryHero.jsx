import { Search, ChevronDown } from "lucide-react";
import "./DoctorsDirectoryHero.css";

export default function DoctorsDirectoryHero({
  doctorCount = 0,
  searchQuery = "",
  onSearchChange,
}) {
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

            <button className="sort-btn">
              Sort By: Recommended
              <ChevronDown size={22} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}