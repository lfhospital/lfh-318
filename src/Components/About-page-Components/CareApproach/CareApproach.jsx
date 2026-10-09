import React from "react";
import "./CareApproach.css";

export default function CareApproach({ pillars, loading }) {
  return (
    <section className="about-section">
      <div className="page-section-head">
        <div className="page-section-title about-section-title">
          <p className="page-eyebrow">Our approach to care</p>
          <h2>
            Comprehensive care,
            <br />
            thoughtfully connected.
          </h2>
        </div>
        <p className="page-section-note about-section-note">
          Designed as a 200-bed multi-specialty hospital, we bring together
          experienced doctors, advanced medical infrastructure and
          comprehensive clinical services to create an integrated ecosystem of
          care that supports every stage of your health journey.
        </p>
      </div>

      <div className="care-approach-grid" aria-busy={loading}>
        {pillars.map(({ title, text, icon: Icon }, i) => (
          <article className="care-approach-card" key={loading ? i : title}>
            {loading ? (
              <>
                <span className="about-skeleton about-skeleton-icon" />
                <div>
                  <span className="about-skeleton about-skeleton-heading" />
                  <span className="about-skeleton about-skeleton-text" />
                  <span className="about-skeleton about-skeleton-text short" />
                </div>
              </>
            ) : (
              <>
                <Icon size={24} strokeWidth={1.5} className="care-approach-icon" />
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
