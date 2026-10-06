import React from "react";
import { ArrowRight } from "lucide-react";
import patientImg from "../../../asserts/image2.png";
import "./PatientStories.css";

const stories = [
  {
    text: "We were reassured at every step. The nursing team explained each test in a way we could understand, no jargon, no rush.",
    name: "Priya R.",
    role: "Oncology patient",
  },
  {
    text: "We were reassured at every step. The nursing team explained each test in a way we could understand, no jargon, no rush.",
    name: "Priya R.",
    role: "Oncology patient",
  },
  {
    text: "We were reassured at every step. The nursing team explained each test in a way we could understand, no jargon, no rush.",
    name: "Priya R.",
    role: "Oncology patient",
  },
];

export default function PatientStories() {
  return (
    <section className="patient-stories">
      <div className="stories-header">
        <h2 className="stories-title">
          From the people we've cared for
        </h2>

        <a href="/" className="stories-link">
          <span className="stories-link-text">All Stories</span>
          <ArrowRight size={18} />
        </a>
      </div>

      <div className="stories-image-wrapper">
        <img
          src={patientImg}
          alt="Patient Stories"
          className="stories-image"
        />
      </div>

      <div className="stories-divider"></div>

      <div className="stories-grid">
        {stories.map((story, index) => (
          <div className="story-card" key={index}>
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