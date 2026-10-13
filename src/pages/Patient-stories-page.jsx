import React, { useEffect, useState } from "react";
import Navbar from "../Components/Home-page-Components/Navbar/Navbar";
import Footer from "../Components/Home-page-Components/Footer/HomeFooter";
import { fetchTestimonials } from "../Components/Home-page-Components/PatientStories/testimonials";
import "../Components/Home-page-Components/PatientStories/PatientStories.css";

export default function PatientStoriesPage() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTestimonials()
      .then(setStories)
      .catch((err) => {
        console.error("Error fetching testimonials:", err);
        setError("Failed to load patient stories");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <section className="patient-stories">
        <div className="stories-header">
          <h2 className="stories-title">
            From the people we've cared for
          </h2>
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
      <Footer />
    </>
  );
}
