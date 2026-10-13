import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import "./MissionSection.css";

export default function MissionSection() {
  return (
    <section className="mission-section">
      <div className="mission-dot"></div>

      <div className="mission-content">
        <h1 className="mission-title">
          We believe healthcare
          <br />
          should be <span className="underline">accessible</span>,
          <br />
          <span className="underline">equitable</span>, and centred
          <br />
          around people.
        </h1>
        
        <p className="mission-description">
          For over two decades, Lakshmee Foundation has worked to deliver
          trusted medical care across communities. Today, that mission
          continues through a multispeciality hospital expanding access
          through modern infrastructure, experienced specialists, and
          people-centered care.
        </p>

        <Link to="/about" className="mission-link">
          <span>Our Story</span>
          <ArrowRight size={20} />
        </Link>
      </div>
    </section>
  );
}