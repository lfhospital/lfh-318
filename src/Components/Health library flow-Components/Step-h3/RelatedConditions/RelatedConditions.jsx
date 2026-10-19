import React from "react";
import { ArrowRight } from "lucide-react";
import "./RelatedConditions.css";
import { navigateTo } from "../../../../navigation";

export default function RelatedConditions() {
  const relatedConditions = [
    {
      category: "CARDIOLOGY",
      title: "Hypertension",
      description: (
        <>
          High blood pressure — a leading
          <br />
          driver of artery damage.
        </>
      ),
    },
    {
      category: "ENDOCRINOLOGY",
      title: "Type 2 Diabetes",
      description: (
        <>
          Closely linked to heart disease
          <br />
          through vascular damage
        </>
      ),
    },
  ];

  return (
    <section className="rc-section">
      {/* =====================================================
          RELATED CONDITIONS
      ===================================================== */}

      <div className="rc-content" id="related">
        <h2 className="rc-heading">Related conditions</h2>

        <div className="rc-cards">
          {relatedConditions.map((condition, index) => (
            <article className="rc-card" key={index}>
              <span className="rc-category">{condition.category}</span>

              <h3 className="rc-title">{condition.title}</h3>

              <p className="rc-description">{condition.description}</p>

              <div className="rc-divider"></div>

              <button
                className="rc-read-more"
                onClick={() => navigateTo("List", { query: condition.title })}
              >
                <span>Read more</span>
                <ArrowRight size={17} strokeWidth={1.5} />
              </button>
            </article>
          ))}
        </div>
      </div>

      {/* =====================================================
          BOOKING HELP
      ===================================================== */}

      <div className="rc-help">
        <div className="rc-help-text">
          <h2>Got questions about booking?</h2>

          <p>Booking guidance, insurance, second opinion. All in one place</p>
        </div>

        <button className="rc-help-link" onClick={() => navigateTo("ContactUs")}>
          <span>Visit help centre</span>
          <ArrowRight size={17} strokeWidth={1.5} />
        </button>
      </div>
    </section>
  );
}
