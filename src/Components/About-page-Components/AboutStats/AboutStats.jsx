import React from "react";
import "./AboutStats.css";

export default function AboutStats({ stats, loading }) {
  return (
    <section className="about-stats" aria-label="Hospital at a glance" aria-busy={loading}>
      {stats.map((s, i) => (
        <div className="about-stat" key={loading ? i : s.label}>
          {loading ? (
            <>
              <span className="about-skeleton about-skeleton-stat" />
              <span className="about-skeleton about-skeleton-text short" />
            </>
          ) : (
            <>
              <p className="about-stat-value">{s.value}</p>
              <p className="about-stat-label">{s.label}</p>
            </>
          )}
        </div>
      ))}
    </section>
  );
}
