import React from "react";
import "./WhyChooseUs.css";

export default function WhyChooseUs({ features, loading }) {
  // Up to five fit on one row (as in the design); longer lists wrap four per row
  const columns = features.length <= 5 ? features.length : 4;

  return (
    <section className="about-section">
      <div className="page-section-head">
        <div className="page-section-title about-section-title">
          <p className="page-eyebrow">Why choose us</p>
          <h2>
            Healthcare that goes
            <br />
            beyond treatment.
          </h2>
        </div>
        <p className="page-section-note about-section-note">
          Every part of the patient experience is built around one belief:
          quality healthcare should be personal, connected and within reach.
        </p>
      </div>

      <div
        className="why-grid"
        style={{ "--why-columns": columns }}
        aria-busy={loading}
      >
        {features.map(({ title, text, icon: Icon }, i) => (
          <article
            className={`why-card ${(i + 1) % columns === 0 ? "row-end" : ""}`}
            key={loading ? i : title}
          >
            {loading ? (
              <>
                <span className="about-skeleton about-skeleton-icon" />
                <span className="about-skeleton about-skeleton-heading" />
              </>
            ) : (
              <>
                <Icon size={32} strokeWidth={1.25} className="why-icon" />
                <div>
                  <h3>{title}</h3>
                  {text && <p>{text}</p>}
                </div>
              </>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
