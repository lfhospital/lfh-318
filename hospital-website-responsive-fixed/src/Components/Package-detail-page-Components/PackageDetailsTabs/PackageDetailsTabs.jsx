import React, { useRef, useState } from "react";
import "./PackageDetailsTabs.css";
import WhoShouldTake from "../WhoShouldTake/WhoShouldTake";
import BenefitsSection from "../BenefitsSection/BenefitsSection";
import PreparationInstructions from "../PreparationInstructions/PreparationInstructions";
import SampleCollection from "../SampleCollection/SampleCollection";
import ReviewsSection from "../ReviewsSection/ReviewsSection";
import WhatsIncluded from "../WhatsIncluded/WhatsIncluded";
import FrequentlyBookedWith from "../FrequentlyBookedWith/FrequentlyBookedWith";

export default function PackageDetailsTabs() {
  const [activeTab, setActiveTab] = useState("01");
  const [openPanels, setOpenPanels] = useState([]);

  const includedRef = useRef(null);
  const whoRef = useRef(null);
  const benefitsRef = useRef(null);
  const preparationRef = useRef(null);
  const sampleRef = useRef(null);
  const reportRef = useRef(null);
  const reviewsRef = useRef(null);
  const faqRef = useRef(null);

  const togglePanel = (index) => {
    setOpenPanels((prev) =>
      prev.includes(index)
        ? prev.filter((item) => item !== index)
        : [...prev, index]
    );
  };

  const scrollToSection = (id) => {
    setActiveTab(id);

    const sections = {
      "01": includedRef,
      "02": whoRef,
      "03": benefitsRef,
      "04": preparationRef,
      "05": sampleRef,
      "06": reportRef,
      "07": reviewsRef,
      "08": faqRef,
    };

    const section = sections[id]?.current;

    if (section) {
      const yOffset = -140;
      const y =
        section.getBoundingClientRect().top +
        window.pageYOffset +
        yOffset;

      window.scrollTo({
        top: y,
        behavior: "smooth",
      });
    }
  };

  const tabs = [
    { id: "01", name: "What's included" },
    { id: "02", name: "Who is it for" },
    { id: "03", name: "Benefits" },
    { id: "04", name: "Preparation" },
    { id: "05", name: "Sample Collection" },
    { id: "06", name: "Report" },
    { id: "07", name: "Reviews" },
    { id: "08", name: "FAQ" },
  ];

  const hospitalBenefits = [
    {
      title: "Doctor reviewed",
      subtitle: "Curated by senior physicians",
    },
    {
      title: "12-hour reports",
      subtitle: "Digital + printed copies",
    },
    {
      title: "2.4 lakh+ patients",
      subtitle: "Trusted across Vijayawada",
    },
    {
      title: "NABL & CAP certified",
      subtitle: "Same standard, every sample",
    },
  ];

  const faqItems = [
    {
      question: "How long does the test take?",
      answer:
        "Sample collection typically takes 10–15 minutes. Reports are available within 24–48 hours.",
    },
    {
      question: "Is fasting required?",
      answer:
        "Yes, 8–10 hours of fasting is required for this package. Plain water is permitted.",
    },
    {
      question: "Can I get home collection?",
      answer:
        "Yes, free home collection is available between 7 AM and 9 PM, all 7 days.",
    },
  ];

  return (
    <section className="package-tabs-section">
      <div className="package-tabs-nav">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`tab-item ${
              activeTab === tab.id ? "active-tab" : ""
            }`}
            onClick={() => scrollToSection(tab.id)}
          >
            <span>{tab.id}</span>
            <p>{tab.name}</p>
          </div>
        ))}
      </div>

      <div className="package-content">
        <div className="package-left">

          {/* 01 What's Included */}
          <div ref={includedRef} className="package-left-section">
            <WhatsIncluded />
          </div>

          {/* 02 Who Should Take */}
          <div ref={whoRef} className="package-left-section">
            <WhoShouldTake />
          </div>

          {/* 03 Benefits */}
          <div ref={benefitsRef} className="package-left-section">
            <BenefitsSection />
          </div>

          {/* 04 Preparation */}
          <div ref={preparationRef} className="package-left-section">
            <PreparationInstructions />
          </div>

          {/* 05 Sample Collection */}
          <div ref={sampleRef} className="package-left-section">
            <SampleCollection />
          </div>

          {/* 06 Report */}
          <div ref={reportRef} className="package-left-section">
          </div>

          {/* 07 Reviews */}
          <div ref={reviewsRef} className="package-left-section">
            <ReviewsSection />
          </div>

          {/* 08 FAQ */}
          <div ref={faqRef} className="package-left-section">
            <FrequentlyBookedWith/>
          </div>

        </div>

        <div className="package-right">
          <div className="hospital-card">
            <h2>Why Lakshmee Foundation Hospital</h2>

            {hospitalBenefits.map((item, index) => (
              <div className="benefit-item" key={index}>
                <div className="benefit-icon">★</div>

                <div>
                  <h4>{item.title}</h4>
                  <p>{item.subtitle}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="guidance-card">
            <h2>Need guidance?</h2>

            <p>
              Our team can help identify the most suitable health package based
              on individual health concerns and preventive care needs.
            </p>

            <button className="advisor-btn">
              <span>Talk to an Advisor</span>
              <span className="advisor-arrow">→</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}