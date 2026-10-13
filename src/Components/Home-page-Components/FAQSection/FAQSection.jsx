import React, { useState, useEffect } from "react";
import { Plus, Minus, ArrowRight } from "lucide-react";
import "./FAQSection.css";

// Note: www.ishah.in has an SSL cert mismatch, so use the bare domain
const FAQS_API = "https://ishah.in/api/lfhospital/getfaqs";
const INITIAL_VISIBLE = 5;

export default function FAQSection() {
  const [faqData, setFaqData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        setLoading(true);
        const response = await fetch(FAQS_API);
        const data = await response.json();

        if (data.success && Array.isArray(data.questions)) {
          const faqs = data.questions
            .filter((q) => q.isActive)
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
          setFaqData(faqs);
        } else {
          setError("Failed to load FAQs");
        }
      } catch (err) {
        console.error("Error fetching FAQs:", err);
        setError("Failed to load FAQs");
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const visibleFaqs = showAll ? faqData : faqData.slice(0, INITIAL_VISIBLE);

  return (
    <section className="faq-section">
      <div className="faq-container">

        <div className="faq-left">
          <h2 className="faq-title">
            Frequently
            <br />
            Asked Questions
          </h2>

          <p className="faq-description">
            Find the information you need to better understand your care and treatment options.
          </p>

          <button className="contact-btn">
            Get in Touch
            <ArrowRight size={18} />
          </button>
        </div>

        <div className="faq-right">
          {loading && <p className="faq-status">Loading FAQs...</p>}
          {!loading && error && <p className="faq-status">{error}</p>}

          {visibleFaqs.map((item, index) => (
            <div
              key={item._id || index}
              className={`faq-item ${
                activeIndex === index ? "active" : ""
              }`}
            >
              <div
                className="faq-question"
                onClick={() => toggleFAQ(index)}
              >
                <span>{item.question}</span>

                <button className="faq-icon">
                  {activeIndex === index ? (
                    <Minus size={18} />
                  ) : (
                    <Plus size={18} />
                  )}
                </button>
              </div>

              {activeIndex === index && (
                <div className="faq-answer">
                  {item.answer}
                </div>
              )}
            </div>
          ))}

          {!loading && faqData.length > INITIAL_VISIBLE && (
            <button
              className="faq-toggle-btn"
              onClick={() => {
                setShowAll(!showAll);
                setActiveIndex(null);
              }}
            >
              {showAll ? "Show less" : `View all ${faqData.length} questions`}
            </button>
          )}
        </div>

      </div>
    </section>
  );
}