import React, { useState, useEffect, useMemo, useRef } from "react";
import "./QuickIndex.css";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getPageItems } from "../../../utils/pagination";

const PAGE_SIZE = 21;

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
  const [activeLetter, setActiveLetter] = useState("All");
  const [page, setPage] = useState(1);
  const gridRef = useRef(null);

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

  const availableLetters = useMemo(
    () => new Set(conditions.map((c) => c.title.charAt(0).toUpperCase())),
    [conditions]
  );

  const filtered = useMemo(
    () =>
      activeLetter === "All"
        ? conditions
        : conditions.filter(
            (c) => c.title.charAt(0).toUpperCase() === activeLetter
          ),
    [conditions, activeLetter]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const selectLetter = (letter) => {
    setActiveLetter(letter);
    setPage(1);
  };

  const goToPage = (p) => {
    if (p < 1 || p > totalPages || p === page) return;
    setPage(p);
    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
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
                letter === activeLetter ? "qi-letter-active" : ""
              }`}
              onClick={() => selectLetter(letter)}
              disabled={
                letter !== "All" && !loading && !availableLetters.has(letter)
              }
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
      <section className="cg-section" ref={gridRef}>
        {loading && <p className="cg-status">Loading conditions...</p>}

        {!loading && error && (
          <p className="cg-status cg-status-error">{error}</p>
        )}

        {!loading && !error && filtered.length === 0 && (
          <p className="cg-status">No conditions found for this letter.</p>
        )}

        <div className="cg-grid">
          {!loading &&
            !error &&
            pageItems.map((condition, index) => (
              <div className="cg-card" key={condition.title + index}>
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
        {!loading && !error && totalPages > 1 && (
          <div className="hlf-pagination">
            <button
              className="hlf-pagination-prev"
              onClick={() => goToPage(page - 1)}
              disabled={page === 1}
            >
              <ArrowLeft size={16} strokeWidth={1.8} />
              <span>Previous</span>
            </button>

            {getPageItems(page, totalPages).map((item) =>
              typeof item === "number" ? (
                <button
                  key={item}
                  className={`hlf-page ${item === page ? "hlf-page-active" : ""}`}
                  onClick={() => goToPage(item)}
                >
                  {item}
                </button>
              ) : (
                <span key={item} className="hlf-dots">
                  ...
                </span>
              )
            )}

            <button
              className="hlf-pagination-next"
              onClick={() => goToPage(page + 1)}
              disabled={page === totalPages}
            >
              <span>Next</span>
              <ArrowRight size={16} strokeWidth={1.8} />
            </button>
          </div>
        )}

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
            <ArrowRight size={18} strokeWidth={1.7} />
          </a>
        </div>
      </section>
    </>
  );
}
