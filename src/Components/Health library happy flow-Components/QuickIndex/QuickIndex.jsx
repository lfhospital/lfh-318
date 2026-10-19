import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import "./QuickIndex.css";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getPageItems } from "../../../utils/pagination";
import { fetchArticles } from "../healthLibraryApi";

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

  // Every health library article, alphabetically
  useEffect(() => {
    let cancelled = false;
    fetchArticles()
      .then((articles) => {
        if (cancelled) return;
        setConditions(
          articles
            .filter((article) => article.title)
            .sort((a, b) => a.title.localeCompare(b.title))
            .map((article) => ({
              key: article.pageId,
              title: article.title.trim(),
              description: article.categoryLabel,
              to: `/health-library/article/${article.bookId}/${article.pageId}`,
            }))
        );
      })
      .catch((err) => {
        console.error("Error fetching health library articles:", err);
        if (!cancelled) setError("Failed to load the A to Z index");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
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
              A TO Z
            </div>

            <h2 className="qi-condition-title">Every topic, A to Z</h2>
          </div>

          <div className="qi-condition-right">
            <p className="qi-condition-description">
              Diseases, treatments, symptoms, medicines, tests and health
              technology — every article in the library, in one list.
            </p>
          </div>
        </div>
      </section>
      <section className="cg-section" ref={gridRef}>
        {loading && <p className="cg-status">Loading topics...</p>}

        {!loading && error && (
          <p className="cg-status cg-status-error">{error}</p>
        )}

        {!loading && !error && filtered.length === 0 && (
          <p className="cg-status">No topics start with this letter.</p>
        )}

        <div className="cg-grid">
          {!loading &&
            !error &&
            pageItems.map((condition, index) => (
              <Link className="cg-card" key={condition.key} to={condition.to}>
                <div className="cg-number">
                  {String((page - 1) * PAGE_SIZE + index + 1).padStart(2, "0")}
                </div>

                <div className="cg-card-content">
                  <h3 className="cg-title">{condition.title}</h3>

                  <p className="cg-description">{condition.description}</p>
                </div>
              </Link>
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

          <Link to="/contact" className="hlf-help-link">
            <span>Visit help centre</span>
            <ArrowRight size={18} strokeWidth={1.7} />
          </Link>
        </div>
      </section>
    </>
  );
}
