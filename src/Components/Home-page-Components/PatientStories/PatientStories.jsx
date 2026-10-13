import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import patientImg from "../../../asserts/image2.png";
import { fetchTestimonials } from "./testimonials";
import "./PatientStories.css";

const VISIBLE_COUNT = 3;

export default function PatientStories() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTestimonials()
      .then((all) => setStories(all.slice(0, VISIBLE_COUNT)))
      .catch((err) => {
        console.error("Error fetching testimonials:", err);
        setError("Failed to load patient stories");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="patient-stories">
      <div className="stories-header">
        <h2 className="stories-title">
          From the people we've cared for
        </h2>

        <Link to="/patient-stories" className="stories-link">
          <span className="stories-link-text">All Stories</span>
          <ArrowRight size={18} />
        </Link>
      </div>

      <div className="stories-image-wrapper">
        <img
          src={patientImg}
          alt="Patient Stories"
          className="stories-image"
        />
      </div>

      <div className="stories-divider"></div>

      {loading && <p className="stories-status">Loading patient stories...</p>}
      {!loading && error && <p className="stories-status">{error}</p>}

      <div className="stories-grid">
        {stories.map((story) => (
          <div className="story-card" key={story.id}>
            <p className="story-text">{story.text}</p>

            <div className="story-author">
              <h4>{story.name}</h4>
              <span>{story.role}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
