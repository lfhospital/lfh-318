import React, { useState, useEffect } from "react";
import "./QuickIndex.css";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function QuickIndex() {
  const letters = [
    "All",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ];

  const [conditions, setConditions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://www.lfh.care/api/lfhospital/specialities/departments"
        );
        const data = await response.json();

        if (data.success && Array.isArray(data.specialist)) {
          const transformed = data.specialist
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((dept) => ({
              number: String(dept.sortOrder).padStart(2, "0"),
              title: dept.name,
              description:
                "Find doctors, treatments and guidance related to " +
                dept.name +
                ".",
            }));

          setConditions(transformed);
        }
      } catch (err) {
        console.error("Error fetching departments:", err);
        setError("Failed to load conditions");
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);
  return (
    <>
      <section className="qi-section">
        {/* ================= QUICK INDEX ================= */}
        <div className="qi-label">QUICK INDEX</div>

        {/* ================= TITLE ================= */}
        <h1 className="qi-title">Jump to a letter</h1>

        {/* ================= DESCRIPTION ================= */}
        <p className="qi-description">
          Select a letter to browse all diseases, treatments, medicines and
          tests starting with it.
        </p>

        {/* ================= LETTER INDEX ================= */}
        <div className="qi-letters">
          {letters.map((letter) => (
            <button
              key={letter}
              className={`qi-letter ${
                letter === "All" ? "qi-letter-active" : ""
              }`}
              disabled={letter === "X"}
            >
              {letter}
            </button>
          ))}
        </div>

        {/* ================= CONDITIONS SECTION ================= */}
        <div className="qi-conditions">
          <div className="qi-condition-left">
            <div className="qi-condition-label">
              03 · PROCEDURES &amp; TREATMENTS
            </div>

            <h2 className="qi-condition-title">Every condition, A to Z</h2>
          </div>

          <div className="qi-condition-right">
            <p className="qi-condition-description">
              From diagnostic imaging to complex interventional procedures,
              every case is planned by a heart team and executed in our hybrid
              cath labs.
            </p>
          </div>
        </div>
      </section>
      <section className="cg-section">
        <div className="cg-grid">
          {loading && (
            <p style={{ textAlign: "center", padding: "2rem", fontSize: "1.2rem" }}>
              Loading conditions...
            </p>
          )}

          {!loading && error && (
            <p
              style={{
                textAlign: "center",
                padding: "2rem",
                fontSize: "1.2rem",
                color: "red",
              }}
            >
              {error}
            </p>
          )}

          {!loading &&
            !error &&
            conditions.map((condition, index) => (
              <div className="cg-card" key={index}>
                <div className="cg-number">{condition.number}</div>

                <div className="cg-card-content">
                  <h3 className="cg-title">{condition.title}</h3>

                  <p className="cg-description">{condition.description}</p>
                </div>
              </div>
            ))}
        </div>
      </section>
      <section className="hlf-section">
        {/* ================= PAGINATION ================= */}
        <div className="hlf-pagination">
          <button className="hlf-pagination-prev">
            <ArrowLeft size={20} strokeWidth={1.7} />
            <span>Previous</span>
          </button>

          <button className="hlf-page hlf-page-active">1</button>

          <button className="hlf-page">2</button>

          <button className="hlf-page">3</button>

          <span className="hlf-dots">...</span>

          <button className="hlf-pagination-next">
            <span>Next</span>
            <ArrowRight size={20} strokeWidth={1.7} />
          </button>
        </div>

        {/* ================= HELP CENTRE ================= */}
        <div className="hlf-help">
          <div className="hlf-help-content">
            <h2 className="hlf-help-title">Got questions about booking?</h2>

            <p className="hlf-help-description">
              Booking guidance, insurance, second opinion. All in one place
            </p>
          </div>

          <a href="#" className="hlf-help-link">
            <span>Visit help centre</span>
            <ArrowRight size={23} strokeWidth={1.7} />
          </a>
        </div>
      </section>
    </>
  );
}
