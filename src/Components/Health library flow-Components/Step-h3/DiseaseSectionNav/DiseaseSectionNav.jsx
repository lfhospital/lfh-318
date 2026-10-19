import React, { useEffect, useState } from "react";
import "../DiseaseOverview/DiseaseOverview.css";

// Sections of the condition article, in page order. `id` is the element id
// of the section the link scrolls to.
export const DISEASE_SECTIONS = [
  { id: "definition", label: "Definition" },
  { id: "symptoms", label: "Symptoms and causes" },
  { id: "risk-factors", label: "Risk factors" },
  { id: "diagnosis", label: "Diagnosis" },
  { id: "treatment", label: "Treatment options" },
  { id: "prevention", label: "Prevention" },
  { id: "doctor", label: "When see a doctor" },
  { id: "related", label: "Related conditions" },
];

// Fixed site navbar + this sticky bar, so a section heading is not hidden
// underneath them after scrolling.
const headerOffset = () => {
  const nav = document.querySelector(".disease-nav");
  return (document.querySelector(".navbar")?.offsetHeight || 0) + (nav?.offsetHeight || 0) + 16;
};

export default function DiseaseSectionNav() {
  const [activeId, setActiveId] = useState(DISEASE_SECTIONS[0].id);

  // Highlight the section currently being read.
  useEffect(() => {
    const update = () => {
      const offset = headerOffset() + 8;
      let current = DISEASE_SECTIONS[0].id;
      for (const { id } of DISEASE_SECTIONS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top - offset <= 0) current = id;
      }
      // At the very bottom the last sections may never reach the top.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        current = DISEASE_SECTIONS[DISEASE_SECTIONS.length - 1].id;
      }
      setActiveId(current);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  // Keep the active link visible when the bar scrolls sideways (small screens).
  useEffect(() => {
    const nav = document.querySelector(".disease-nav");
    const item = nav?.querySelector(`[data-section="${activeId}"]`);
    if (!nav || !item || nav.scrollWidth <= nav.clientWidth) return;
    const left = item.offsetLeft - nav.offsetLeft;
    if (left < nav.scrollLeft || left + item.offsetWidth > nav.scrollLeft + nav.clientWidth) {
      nav.scrollTo({ left: left - 24, behavior: "smooth" });
    }
  }, [activeId]);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - headerOffset();
    window.scrollTo({ top, behavior: "smooth" });
    setActiveId(id);
  };

  return (
    <nav className="disease-nav" aria-label="On this page">
      {DISEASE_SECTIONS.map(({ id, label }, index) => (
        <button
          type="button"
          key={id}
          data-section={id}
          className={`disease-nav-item${activeId === id ? " active" : ""}`}
          aria-current={activeId === id ? "true" : undefined}
          onClick={() => scrollToSection(id)}
        >
          <span>{String(index + 1).padStart(2, "0")}</span>
          {label}
        </button>
      ))}
    </nav>
  );
}
