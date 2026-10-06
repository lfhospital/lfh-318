import { useState } from "react";
import "./DoctorsListing.css";
import { Search, X, ArrowRight, ArrowLeft, ChevronRight } from "lucide-react";

import doctor from "../../../asserts/doctors.jpg";

// Filter group definitions — each value must be unique within its group
// so a checkbox can be reliably toggled and represented as a tag.
const FILTER_GROUPS = {
  specialities: [
    "Cardiology",
    "Neurology",
    "Orthopedics",
    "Dermatology",
    "Pediatrics",
    "ENT",
  ],
  gender: ["Male", "Female", "Any"],
  language: ["Hindi", "English", "Telugu"],
  availability: ["Today", "This Week"],
  experience: ["5+ years", "10+ years", "15+ years", "Any"],
  consultationType: ["In-person", "Video"],
};

const EMPTY_SELECTION = {
  specialities: [],
  gender: [],
  language: [],
  availability: [],
  experience: [],
  consultationType: [],
};

export default function DoctorsListing() {
  const doctors = [1, 2, 3, 4, 5];

  const [selected, setSelected] = useState(EMPTY_SELECTION);

  const toggleFilter = (group, value) => {
    setSelected((prev) => {
      const current = prev[group];
      const isSelected = current.includes(value);
      return {
        ...prev,
        [group]: isSelected
          ? current.filter((v) => v !== value)
          : [...current, value],
      };
    });
  };

  const clearAll = () => setSelected(EMPTY_SELECTION);

  // Flat list of every selected tag, tagged with its group so it can be removed individually
  const selectedTags = Object.entries(selected).flatMap(([group, values]) =>
    values.map((value) => ({ group, value })),
  );

  const totalSelected = selectedTags.length;

  const isChecked = (group, value) => selected[group].includes(value);

  return (
    <section className="doctors-listing-section">
      <div className="listing-container">
        {/* FILTERS */}
        <div className="filters-panel">
          <div className="filter-header">
            <h2>Filters</h2>
            {totalSelected > 0 && (
              <button onClick={clearAll}>Clear all ({totalSelected})</button>
            )}
          </div>

          <div className="filter-divider"></div>

          {selectedTags.length > 0 && (
            <div className="selected-tags">
              {selectedTags.map(({ group, value }) => (
                <span key={`${group}-${value}`}>
                  {value}
                  <X
                    size={14}
                    onClick={() => toggleFilter(group, value)}
                    style={{ cursor: "pointer" }}
                  />
                </span>
              ))}
            </div>
          )}

          <div className="filter-group">
            <h3>Specialties</h3>

            <div className="speciality-search">
              <Search size={18} />
              <input placeholder="Search Speciality" />
            </div>

            {FILTER_GROUPS.specialities.map((name) => (
              <label key={name}>
                <input
                  type="checkbox"
                  checked={isChecked("specialities", name)}
                  onChange={() => toggleFilter("specialities", name)}
                />
                <span className="custom-checkbox"></span>
                {name}
              </label>
            ))}

            <a href="/">Show all 18 specialities</a>
          </div>

          <div className="filter-group">
            <h3>Gender</h3>
            {FILTER_GROUPS.gender.map((name) => (
              <label key={name}>
                <input
                  type="checkbox"
                  checked={isChecked("gender", name)}
                  onChange={() => toggleFilter("gender", name)}
                />
                <span className="custom-checkbox"></span>
                {name}
              </label>
            ))}
          </div>

          <div className="filter-group">
            <h3>Language</h3>
            {FILTER_GROUPS.language.map((name) => (
              <label key={name}>
                <input
                  type="checkbox"
                  checked={isChecked("language", name)}
                  onChange={() => toggleFilter("language", name)}
                />
                <span className="custom-checkbox"></span>
                {name}
              </label>
            ))}
            <a href="/">+7 more languages</a>
          </div>

          <div className="filter-group">
            <h3>Availability</h3>
            {FILTER_GROUPS.availability.map((name) => (
              <label key={name}>
                <input
                  type="checkbox"
                  checked={isChecked("availability", name)}
                  onChange={() => toggleFilter("availability", name)}
                />
                <span className="custom-checkbox"></span>
                {name}
              </label>
            ))}
          </div>

          <div className="filter-group">
            <h3>Experience</h3>
            {FILTER_GROUPS.experience.map((name) => (
              <label key={name}>
                <input
                  type="checkbox"
                  checked={isChecked("experience", name)}
                  onChange={() => toggleFilter("experience", name)}
                />
                <span className="custom-checkbox"></span>
                {name}
              </label>
            ))}
          </div>

          <div className="filter-group">
            <h3>Consultation Type</h3>
            {FILTER_GROUPS.consultationType.map((name) => (
              <label key={name}>
                <input
                  type="checkbox"
                  checked={isChecked("consultationType", name)}
                  onChange={() => toggleFilter("consultationType", name)}
                />
                <span className="custom-checkbox"></span>
                {name}
              </label>
            ))}
          </div>
        </div>

        {/* DOCTORS */}
        <div className="doctors-panel">
          {doctors.map((item) => (
            <div className="doctor-card" key={item}>
              <img src={doctor} alt="Doctor" />

              <div className="doctor-content">
                <div className="alldoctor-top">
                  <div>
                    <h2>
                      Dr. Rohan Pillai
                      <span> MBBS, MD - Cardiology</span>
                    </h2>

                    <h4>General Pediatrics & Neonatology</h4>

                    <p>
                      MBBS (Grant Medical College) · MD Pediatrics (JIPMER) ·
                      Fellowship Neonatology, Great Ormond Street Hospital,
                      London
                    </p>
                  </div>

                  <button className="profile-link">View Profile</button>
                </div>

                <div className="doctor-stats">
                  <div>
                    <span>EXPERIENCE</span>
                    <h5>22 years</h5>
                  </div>

                  <div>
                    <span>RATING</span>
                    <h5>4.8 (1200)</h5>
                  </div>

                  <div>
                    <span>CONSULTS</span>
                    <h5>In person · Video</h5>
                  </div>
                </div>

                <div className="language-section">
                  <span>LANGUAGES</span>

                  <div>
                    <p>English</p>
                    <p>Hindi</p>
                    <p>Telugu</p>
                  </div>
                </div>
              </div>

              <button className="book-btn">
                Book <ArrowRight size={24} />
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="bottom-bar">
        <p>Showing 1–6 of 18 doctors</p>

        <div className="pagination">
          <button>
            <ArrowLeft size={18} />
            Previous
          </button>

          <span className="active-page">1</span>
          <span>2</span>
          <span>3</span>
          <span>...</span>

          <button>
            Next
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* COMMON ASSISTANCE SECTION */}
      <div className="assistance-section">
        <div>
          <h2>Further Assistance</h2>
          <p>
            Additional information and guidance on appointments, insurance,
            second opinions, and more.
          </p>
        </div>

        <button>
          Visit help centre
          <ArrowRight size={22} />
        </button>
      </div>
    </section>
  );
}
