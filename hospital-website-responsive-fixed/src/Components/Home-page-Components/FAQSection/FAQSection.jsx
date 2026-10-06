import React, { useState } from "react";
import { Plus, Minus, ArrowRight } from "lucide-react";
import "./FAQSection.css";

const faqData = [
  {
    question: "How can I book an appointment online?",
    answer:
      "You can book an appointment through our website by selecting a doctor, choosing an available time slot, and confirming your visit.",
  },
  {
    question: "How can I book an appointment online?",
    answer:
      "You can book appointments online 24/7 using our patient portal.",
  },
  {
    question: "How can I book an appointment online?",
    answer:
      "Appointments can be scheduled online, over the phone, or at the reception desk.",
  },
  {
    question: "How can I book an appointment online?",
    answer:
      "You will receive an SMS and email confirmation after booking.",
  },
  {
    question: "How can I book an appointment online?",
    answer:
      "You can also reschedule or cancel appointments through your account.",
  },
];

export default function FAQSection() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

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
          {faqData.map((item, index) => (
            <div
              key={index}
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
        </div>

      </div>
    </section>
  );
}