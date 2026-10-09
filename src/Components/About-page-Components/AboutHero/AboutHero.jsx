import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import "./AboutHero.css";

export default function AboutHero({ hero, loading }) {
  const navigate = useNavigate();

  return (
    <section className="about-hero" aria-busy={loading}>
      {loading ? (
        <span className="about-skeleton about-skeleton-eyebrow" />
      ) : (
        <p className="page-eyebrow about-hero-eyebrow">{hero.eyebrow}</p>
      )}

      <div className="about-hero-copy">
        {loading ? (
          <>
            <span className="about-skeleton about-skeleton-title" />
            <span className="about-skeleton about-skeleton-title short" />
            <span className="about-skeleton about-skeleton-text" />
            <span className="about-skeleton about-skeleton-text" />
          </>
        ) : (
          <>
            <h1>{hero.title}</h1>
            <p>{hero.description}</p>
          </>
        )}
      </div>

      <div className="about-hero-actions">
        <button type="button" className="about-btn-primary" onClick={() => navigate("/doctors")}>
          Find a Doctor
          <ArrowRight size={14} strokeWidth={2} />
        </button>
        <button type="button" className="about-btn-outline" onClick={() => navigate("/doctors")}>
          Book Appointment
        </button>
      </div>
    </section>
  );
}
