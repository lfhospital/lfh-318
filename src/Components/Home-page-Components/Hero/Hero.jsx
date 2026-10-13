import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Calendar,
  Home,
  Users,
  ScanText,
  Shield,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import img from "../../../asserts/image.png";
import "./Hero.css";

const staticSearchData = {
  "Top Results": [
    "CBC (Complete Blood Count)",
    "Cardiology",
    "Chest Pain",
    "Cold & Flu",
    "Cardiac Risk Profile",
    "Critical Care",
    "Diabetes",
    "Heart Checkup",
  ],
  Tests: [
    "CBC (Complete Blood Count)",
    "Lipid Profile",
    "Liver Function Test",
    "Blood Sugar",
    "HbA1c",
    "Vitamin D",
    "Thyroid Profile",
  ],
  Symptoms: [
    "Chest Pain",
    "Cold & Flu",
    "Fever",
    "Headache",
    "Cough",
    "Body Pain",
  ],
};

export default function Hero() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeTab, setActiveTab] = useState("Top Results");
  const [doctors, setDoctors] = useState([]);
  const [doctorsLoading, setDoctorsLoading] = useState(false);
  const [packages, setPackages] = useState([]);
  const [packagesLoading, setPackagesLoading] = useState(false);
  const [specialties, setSpecialties] = useState([]);
  const [specialtiesLoading, setSpecialtiesLoading] = useState(false);

  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch doctors from the same API used on the /doctors page
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setDoctorsLoading(true);

        const response = await fetch(
          "https://ishah.in/api/lfhospital/doctor/getdoctors",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({}),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success && data.doctors) {
          setDoctors(data.doctors);
        }
      } catch (err) {
        console.error("Error fetching doctors for search:", err);
      } finally {
        setDoctorsLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Fetch packages from the same API used on the /health-packages page
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setPackagesLoading(true);

        const response = await fetch(
          "https://ishah.in/api/lfhospital/packages"
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success && data.packages) {
          setPackages(data.packages);
        }
      } catch (err) {
        console.error("Error fetching packages for search:", err);
      } finally {
        setPackagesLoading(false);
      }
    };

    fetchPackages();
  }, []);

  // Fetch specialties from the same API used on the /all-specialties page
  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        setSpecialtiesLoading(true);

        const response = await fetch(
          "https://ishah.in/api/lfhospital/specialities"
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success && data.specialist) {
          setSpecialties(data.specialist);
        }
      } catch (err) {
        console.error("Error fetching specialties for search:", err);
      } finally {
        setSpecialtiesLoading(false);
      }
    };

    fetchSpecialties();
  }, []);

  // Build the list of doctor display names + keep reference to the doctor object
  const doctorEntries = doctors.map((doc) => ({
    id: doc.doctorId || doc._id,
    label: `Dr. ${doc.firstName} ${doc.lastName}`,
  }));

  // Build the list of package display names + keep reference to the package id
  const packageEntries = packages.map((pkg) => ({
    id: pkg._id,
    label: pkg.package_name,
  }));

  // Specialty labels from the API carry stray whitespace/commas
  const specialtyEntries = specialties
    .filter((spec) => spec.departmentId)
    .map((spec) => ({
      id: spec._id,
      label: (spec.label || spec.value || "").trim().replace(/,$/, ""),
    }))
    .filter((spec) => spec.label);

  const searchData = {
    ...staticSearchData,
    Specialties: specialtyEntries.map((s) => s.label),
    Doctors: doctorEntries.map((d) => d.label),
    Packages: packageEntries.map((p) => p.label),
  };

  const tabOrder = [
    "Top Results",
    "Specialties",
    "Tests",
    "Doctors",
    "Packages",
    "Symptoms",
  ];

  const normalizedQuery = query.toLowerCase().trim();

  // Doctors matching the current query (used to surface doctor names in
  // "Top Results" too, so typing a doctor's name shows them even on that tab)
  const matchingDoctorLabels = normalizedQuery
    ? doctorEntries
        .filter((d) => d.label.toLowerCase().includes(normalizedQuery))
        .map((d) => d.label)
    : [];

  // Packages matching the current query, surfaced in "Top Results" as well
  const matchingPackageLabels = normalizedQuery
    ? packageEntries
        .filter((p) => p.label.toLowerCase().includes(normalizedQuery))
        .map((p) => p.label)
    : [];

  // Specialties matching the current query, surfaced in "Top Results" as well
  const matchingSpecialtyLabels = normalizedQuery
    ? specialtyEntries
        .filter((s) => s.label.toLowerCase().includes(normalizedQuery))
        .map((s) => s.label)
    : [];

  let filteredResults;

  if (activeTab === "Top Results") {
    const baseTopResults = staticSearchData["Top Results"].filter((item) =>
      item.toLowerCase().includes(normalizedQuery)
    );

    // Merge matching specialties, doctors & packages into Top Results (dedup)
    const merged = [
      ...matchingSpecialtyLabels,
      ...matchingDoctorLabels,
      ...matchingPackageLabels,
      ...baseTopResults,
    ];
    filteredResults = merged.filter(
      (item, index) => merged.indexOf(item) === index
    );
  } else {
    filteredResults = (searchData[activeTab] || []).filter((item) =>
      item.toLowerCase().includes(normalizedQuery)
    );
  }

  const handleResultClick = (item) => {
    setQuery(item);
    setShowSuggestions(false);

    const matchedDoctor = doctorEntries.find((d) => d.label === item);
    if (matchedDoctor) {
      navigate(`/doctor-profile/${matchedDoctor.id}`);
      return;
    }

    const matchedPackage = packageEntries.find((p) => p.label === item);
    if (matchedPackage) {
      navigate(`/package-detail-1?package_id=${matchedPackage.id}`);
      return;
    }

    const matchedSpecialty = specialtyEntries.find((s) => s.label === item);
    if (matchedSpecialty) {
      navigate(`/doctors?specialty=${encodeURIComponent(matchedSpecialty.label)}`);
    }
  };

  return (
    <section className="hero">
      <div className="hero-bg">
        <img src={img} alt="Hospital" className="hero-img" />
        <div className="hero-overlay" />
      </div>

      <div className="hero-content">
        <p className="hero-trust">
          <span><Shield size={16} /> </span> Trusted by 10,000+ patients
        </p>

        <h1 className="hero-headline">
          Expert care you
          <br />
          can trust.
        </h1>

        <p className="hero-sub">
          Trusted healthcare backed by leading medical specialists. 200+
          doctors across 15+ departments, available when you need them.
        </p>

        <div className="hero-search-wrapper" ref={searchRef}>
          <div className="hero-search">
            <input
              type="text"
              className="search-input"
              placeholder="Search doctors, specialities, or symptoms"
              value={query}
              onFocus={() => setShowSuggestions(true)}
              onChange={(e) => setQuery(e.target.value)}
            />

            <Search className="search-icon" />
          </div>

          {showSuggestions && (
            <div className="search-suggestions">
              <div className="search-tabs">
                {tabOrder.map((tab) => (
                  <button
                    key={tab}
                    className={activeTab === tab ? "active-tab" : ""}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="search-results">
                {activeTab === "Specialties" && specialtiesLoading ? (
                  <div className="no-result">Loading specialties...</div>
                ) : activeTab === "Doctors" && doctorsLoading ? (
                  <div className="no-result">Loading doctors...</div>
                ) : activeTab === "Packages" && packagesLoading ? (
                  <div className="no-result">Loading packages...</div>
                ) : filteredResults.length ? (
                  filteredResults.map((item) => (
                    <div
                      key={item}
                      className="search-result-item"
                      onClick={() => handleResultClick(item)}
                    >
                      {item}
                    </div>
                  ))
                ) : (
                  <div className="no-result">
                    No results found
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="hero-actions">
        <a href="#" className="hero-action-btn">
          <Calendar size={18} />
          Book Appointment
        </a>

        <a href="#" className="hero-action-btn">
          <Users size={18} />
          Second Opinion
        </a>

        <a href="#" className="hero-action-btn">
          <Home size={18} />
          Home Care
        </a>

        <a href="#" className="hero-action-btn">
          <ScanText size={18} />
          Lab Tests
        </a>
      </div>
    </section>
  );
}
