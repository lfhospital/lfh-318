import { useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import "./DoctorsDirectoryHero.css";

export default function DoctorsDirectoryHero() {
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState("Recommended");

  const sortOptions = [
    "Recommended",
    "Experience: High to Low",
    "Experience: Low to High",
    "Name: A–Z",
    "Name: Z–A",
    "Highest Rated",
    "Most Booked",
  ];

  return (
    <section className="doctors-directory-hero">
      <div className="directory-content">
        <span className="directory-tag">DOCTORS DIRECTORY</span>

        <h1 className="directory-title">
          Find your right
          <br />
          specialist.
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
            />
            <Search size={19} strokeWidth={1.8} />
          </div>

          <div className="right-controls">
            <span className="doctor-count">
              18 doctors available today
            </span>

            <div className="sort-dropdown">
              <button
                className="sort-btn"
                onClick={() => setSortOpen(!sortOpen)}
              >
                Sort By: <strong>{selectedSort}</strong>
                <ChevronDown
                  size={20}
                  className={sortOpen ? "rotate" : ""}
                />
              </button>

              {sortOpen && (
                <div className="sort-menu">
                  {sortOptions.map((option) => (
                    <div
                      key={option}
                      className={`sort-item ${
                        selectedSort === option ? "active" : ""
                      }`}
                      onClick={() => {
                        setSelectedSort(option);
                        setSortOpen(false);
                      }}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}