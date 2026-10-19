import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, X, ArrowLeft, ArrowRight } from "lucide-react";
import "../Health library home page-Components/HealthLibrary.css";
import "../QuickIndex/QuickIndex.css";
import "./HealthLibraryBrowse.css";
import { getPageItems } from "../../../utils/pagination";
import {
  CATEGORY_META,
  fetchArticles,
  fetchDepartments,
  fetchPageDetails,
  getArticleSummary,
} from "../healthLibraryApi";

const PAGE_SIZE = 10;
const VISIBLE_SPECIALTIES = 6;

const CATEGORY_OPTIONS = Object.entries(CATEGORY_META).map(([title, meta]) => ({
  title,
  ...meta,
}));

// Toggle a value in an array state
const toggleIn = (setter) => (value) =>
  setter((prev) =>
    prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
  );

export default function HealthLibraryBrowse() {
  const [searchParams, setSearchParams] = useSearchParams();
  const typeParam = searchParams.get("type");

  const [articles, setArticles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Card summaries keyed by pageId; null while loading
  const [summaries, setSummaries] = useState({});

  const [query, setQuery] = useState(() => searchParams.get("q") || "");
  // Bumped by "Try again" to reload after a network failure
  const [reloadKey, setReloadKey] = useState(0);
  const [selectedTypes, setSelectedTypes] = useState(
    typeParam ? typeParam.split(",") : []
  );
  const [typeSearch, setTypeSearch] = useState("");
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [departmentSearch, setDepartmentSearch] = useState("");
  const [showAllDepartments, setShowAllDepartments] = useState(false);
  const [page, setPage] = useState(1);
  const gridRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const [articleList, departmentList] = await Promise.all([
          fetchArticles(),
          fetchDepartments(),
        ]);
        setArticles(articleList);
        setDepartments(departmentList);
      } catch (err) {
        console.error("Error fetching health library:", err);
        setError("Failed to load the health library");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [reloadKey]);

  // Keep the category filter and search in the URL so links/back button work
  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    if (selectedTypes.length) next.set("type", selectedTypes.join(","));
    else next.delete("type");
    if (query.trim()) next.set("q", query.trim());
    else next.delete("q");
    if (next.toString() !== searchParams.toString()) {
      setSearchParams(next, { replace: true });
    }
  }, [selectedTypes, query]);

  useEffect(() => {
    setPage(1);
  }, [query, selectedTypes, selectedDepartments]);

  const departmentsById = useMemo(
    () => Object.fromEntries(departments.map((dept) => [dept._id, dept])),
    [departments]
  );

  // Only offer specialties that have at least one article
  const specialtyOptions = useMemo(() => {
    const used = new Set(articles.map((a) => a.departmentId).filter(Boolean));
    return departments.filter((dept) => used.has(dept._id));
  }, [articles, departments]);

  const filteredArticles = useMemo(() => {
    const q = query.trim().toLowerCase();
    return articles.filter((article) => {
      if (selectedTypes.length && !selectedTypes.includes(article.categorySlug)) return false;
      if (selectedDepartments.length && !selectedDepartments.includes(article.departmentId)) return false;
      if (!q) return true;
      const specialty = departmentsById[article.departmentId]?.name || "";
      return [article.title, article.categoryTitle, specialty, summaries[article.pageId] || ""]
        .some((text) => text.toLowerCase().includes(q));
    });
  }, [articles, selectedTypes, selectedDepartments, query, departmentsById, summaries]);

  const totalPages = Math.max(1, Math.ceil(filteredArticles.length / PAGE_SIZE));
  const pageStart = (page - 1) * PAGE_SIZE;
  const pageArticles = useMemo(
    () => filteredArticles.slice(pageStart, pageStart + PAGE_SIZE),
    [filteredArticles, pageStart]
  );

  // Summaries come from each article's page details; fetch only visible cards
  useEffect(() => {
    pageArticles
      .filter((article) => !(article.pageId in summaries))
      .forEach((article) => {
        setSummaries((prev) => ({ ...prev, [article.pageId]: null }));
        fetchPageDetails(article.bookId, article.pageId)
          .then((details) => getArticleSummary(details?.content?.jsxString))
          .catch((err) => {
            console.error("Error fetching article summary:", err);
            return "";
          })
          .then((summary) =>
            setSummaries((prev) => ({ ...prev, [article.pageId]: summary }))
          );
      });
  }, [pageArticles]);

  const toggleType = toggleIn(setSelectedTypes);
  const toggleDepartment = toggleIn(setSelectedDepartments);

  const activeFilterCount = selectedTypes.length + selectedDepartments.length;

  const clearAllFilters = () => {
    setSelectedTypes([]);
    setTypeSearch("");
    setSelectedDepartments([]);
    setDepartmentSearch("");
  };

  const visibleTypes = CATEGORY_OPTIONS.filter((option) =>
    option.filter.toLowerCase().includes(typeSearch.toLowerCase())
  );
  const matchingDepartments = specialtyOptions.filter((dept) =>
    dept.name.toLowerCase().includes(departmentSearch.toLowerCase())
  );
  const visibleDepartments = showAllDepartments
    ? matchingDepartments
    : matchingDepartments.slice(0, VISIBLE_SPECIALTIES);
  const hiddenDepartmentCount = matchingDepartments.length - VISIBLE_SPECIALTIES;

  // Breadcrumb names the category when exactly one is selected
  const breadcrumbCategory =
    selectedTypes.length === 1
      ? CATEGORY_OPTIONS.find((option) => option.slug === selectedTypes[0])?.title
      : null;

  const goToPage = (p) => {
    if (p < 1 || p > totalPages || p === page) return;
    setPage(p);
    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      {/* ================= HERO ================= */}
      <section className="hl-library hlb-hero">
        <div className="hl-container">
          <div className="hl-label hlb-breadcrumb">
            <Link to="/health-library">HEALTH LIBRARY</Link>
            <span className="hlb-breadcrumb-sep">/</span>
            <span className="hlb-breadcrumb-current">
              {breadcrumbCategory || "ALL TOPICS"}
            </span>
          </div>

          <h1 className="hl-title">
            The Health
            <br />
            Library.
          </h1>

          <p className="hl-description">
            Clear, doctor-reviewed answers about conditions, treatments,
            medicines and tests, so you can
            <br />
            understand your health and confidently take the next step.
          </p>

          <form
            className="hl-search-box"
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          >
            <input
              type="text"
              placeholder="Search conditions, treatment, symptoms and more"
              aria-label="Search the health library"
              className="hl-search-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            <button type="submit" className="hl-search-button" aria-label="Search">
              <Search size={16} strokeWidth={1.8} />
            </button>
          </form>
        </div>
      </section>

      {/* ================= LISTING ================= */}
      <section className="hlb-listing" ref={gridRef}>
        <aside className="hlb-filters">
          <div className="hlb-filter-header">
            <h2>Filters</h2>
            {activeFilterCount > 0 && (
              <button onClick={clearAllFilters}>Clear all ({activeFilterCount})</button>
            )}
          </div>

          <div className="hlb-filter-divider"></div>

          <div className="hlb-filter-group">
            <h3>Condition type</h3>

            <div className="hlb-filter-search">
              <Search size={14} />
              <input
                placeholder="Search condition"
                value={typeSearch}
                onChange={(e) => setTypeSearch(e.target.value)}
              />
            </div>

            {selectedTypes.length > 0 && (
              <div className="hlb-selected-tags">
                {CATEGORY_OPTIONS.filter((o) => selectedTypes.includes(o.slug)).map((option) => (
                  <button key={option.slug} onClick={() => toggleType(option.slug)}>
                    {option.filter} <X size={12} />
                  </button>
                ))}
              </div>
            )}

            {visibleTypes.map((option) => (
              <label key={option.slug}>
                <input
                  type="checkbox"
                  checked={selectedTypes.includes(option.slug)}
                  onChange={() => toggleType(option.slug)}
                />
                {option.filter}
              </label>
            ))}
          </div>

          <div className="hlb-filter-group">
            <h3>Specialty</h3>

            <div className="hlb-filter-search">
              <Search size={14} />
              <input
                placeholder="Search speciality"
                value={departmentSearch}
                onChange={(e) => setDepartmentSearch(e.target.value)}
              />
            </div>

            {selectedDepartments.length > 0 && (
              <div className="hlb-selected-tags">
                {selectedDepartments.map((id) => (
                  <button key={id} onClick={() => toggleDepartment(id)}>
                    {departmentsById[id]?.name} <X size={12} />
                  </button>
                ))}
              </div>
            )}

            {visibleDepartments.map((dept) => (
              <label key={dept._id}>
                <input
                  type="checkbox"
                  checked={selectedDepartments.includes(dept._id)}
                  onChange={() => toggleDepartment(dept._id)}
                />
                {dept.name}
              </label>
            ))}

            {hiddenDepartmentCount > 0 && (
              <button
                className="hlb-show-more"
                onClick={() => setShowAllDepartments(!showAllDepartments)}
              >
                {showAllDepartments
                  ? "Show less"
                  : `+${hiddenDepartmentCount} more ${hiddenDepartmentCount === 1 ? "specialty" : "specialties"}`}
              </button>
            )}
          </div>
        </aside>

        <div className="hlb-results">
          {loading && <p className="hlb-status">Loading articles...</p>}

          {!loading && error && (
            <div className="hlb-empty" role="alert">
              <h2>Search is temporarily unavailable</h2>
              <p>
                We couldn't reach the library right now. This is usually a brief
                network issue — please try again in a moment.
              </p>
              <div className="hlb-empty-actions">
                <button
                  type="button"
                  className="hlb-empty-primary"
                  onClick={() => setReloadKey((key) => key + 1)}
                >
                  Try again
                </button>
                <Link to="/health-library" className="hlb-empty-secondary">
                  Back to library home
                </Link>
              </div>
            </div>
          )}

          {!loading && !error && filteredArticles.length === 0 && (
            <div className="hlb-empty">
              <h2>
                {query.trim()
                  ? `No results for “${query.trim()}”`
                  : "No articles match these filters"}
              </h2>
              <p>
                We couldn't find any matching topics. Check your spelling, try a
                broader term, or browse by category.
              </p>
              <div className="hlb-empty-actions">
                {query.trim() && activeFilterCount > 0 && (
                  <button type="button" className="hlb-empty-primary" onClick={clearAllFilters}>
                    Search “{query.trim()}” in all topics
                  </button>
                )}
                {query.trim() && (
                  <button type="button" className="hlb-empty-secondary" onClick={() => setQuery("")}>
                    Clear search
                  </button>
                )}
                {!query.trim() && activeFilterCount > 0 && (
                  <button type="button" className="hlb-empty-primary" onClick={clearAllFilters}>
                    Clear filters
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="hlb-grid">
            {!loading &&
              !error &&
              pageArticles.map((article) => {
                const specialty = departmentsById[article.departmentId]?.name;
                const summary = summaries[article.pageId];

                return (
                  <article className="hlb-card" key={article.pageId}>
                    <div className="hlb-card-category">{article.categoryLabel}</div>

                    {specialty && <span className="hlb-card-pill">{specialty}</span>}

                    <h3 className="hlb-card-title">{article.title}</h3>

                    {summary == null ? (
                      <div className="hlb-card-summary hlb-card-summary-loading" aria-hidden="true">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    ) : (
                      <p className="hlb-card-summary">{summary}</p>
                    )}

                    <div className="hlb-card-footer">
                      <Link
                        className="hlb-read-more"
                        to={`/health-library/article/${article.bookId}/${article.pageId}`}
                      >
                        Read more <ArrowRight size={16} strokeWidth={1.8} />
                      </Link>
                    </div>
                  </article>
                );
              })}
          </div>
        </div>
      </section>

      {/* ================= PAGINATION + HELP ================= */}
      <section className="hlf-section">
        {!loading && !error && filteredArticles.length > 0 && (
          <div className="hlb-bottom-bar">
            <p>
              Showing {pageStart + 1}–{pageStart + pageArticles.length} of{" "}
              {filteredArticles.length} articles
            </p>

            {totalPages > 1 && (
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
          </div>
        )}

        <div className="hlf-help hlb-help">
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
