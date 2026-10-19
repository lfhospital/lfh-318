import React, { useState, useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import "./HealthArticle.css";
import { fetchPageDetails, getArticleHtml, getCategoryMeta } from "../healthLibraryApi";

export default function HealthArticle() {
  const { bookId, pageId } = useParams();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchPageDetails(bookId, pageId)
      .then((data) => {
        if (!cancelled) setDetails(data);
      })
      .catch((err) => {
        console.error("Error fetching article:", err);
        if (!cancelled) setError("Failed to load this article");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [bookId, pageId]);

  const html = useMemo(
    () => getArticleHtml(details?.content?.jsxString),
    [details]
  );

  const category = details?.title ? getCategoryMeta(details.title) : null;
  const backTo = category ? `/health-library/browse?type=${category.slug}` : "/health-library/browse";

  return (
    <section className="ha-section">
      <div className="ha-breadcrumb">
        <Link to="/health-library">HEALTH LIBRARY</Link>
        {details?.title && (
          <>
            <span>/</span>
            <Link to={backTo}>{details.title}</Link>
          </>
        )}
      </div>

      <Link className="ha-back" to={backTo}>
        <ArrowLeft size={16} strokeWidth={1.8} />
        Back to {details?.title || "Health Library"}
      </Link>

      {loading && <p className="ha-status">Loading article...</p>}

      {!loading && error && <p className="ha-status ha-status-error">{error}</p>}

      {!loading && !error && (
        // Sanitised in getArticleHtml: allow-listed tags/attributes only
        <div className="ha-content" dangerouslySetInnerHTML={{ __html: html }} />
      )}
    </section>
  );
}
