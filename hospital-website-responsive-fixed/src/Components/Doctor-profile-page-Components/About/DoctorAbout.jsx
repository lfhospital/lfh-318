import { useRef, useState } from "react";
import "./DoctorAbout.css";
import ReviewsSection from "../ReviewsSection/ReviewsSection";
import LocationTimings from "../LocationTimings/LocationTimings";

export default function DoctorAbout() {
  const [activeTab, setActiveTab] = useState("01");
  const aboutRef    = useRef(null);
  const reviewsRef  = useRef(null);
  const locationRef = useRef(null);

  const scrollToSection = (id) => {
    setActiveTab(id);
    const refMap = {
      "01": aboutRef,
      "02": reviewsRef,
      "03": locationRef,
    };
    const el = refMap[id]?.current;
    if (el) {
      const yOffset = -110;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const expertise = [
    "Coronary Intervention (PCI)",
    "Complex Bifurcation Lesions",
    "Chronic Total Occlusions",
    "Structural Heart Disease",
    "TAVR Workup",
    "Heart Failure Management",
  ];

const insurance = [
  "Tata AIG General Insurance Company Limited",
  "Reliance General Insurance Company Ltd",
  "Good Health Insurance TPA Ltd",
  "Ericson Insurance TPA PVT. LTD",
  "AKNA Health Insurance TPA Pvt. Ltd.",
  "SBI General Insurance Company Ltd.",
  "Galaxy Health Insurance Co. Ltd.",
  "Link-K Insurance TPA Private Limited",
  "Park Mediclaim Insurance TPA Pvt. Ltd.",
  "Family Health Plan Insurance TPA Ltd",
];

  const ratings = [
    { star: 5, count: 94, width: "90%" },
    { star: 4, count: 17, width: "30%" },
    { star: 3, count: 6,  width: "10%" },
    { star: 2, count: 2,  width: "5%"  },
    { star: 1, count: 1,  width: "2%"  },
  ];

  const tabs = [
    { id: "01", label: "About" },
    { id: "02", label: "Reviews" },
    { id: "03", label: "Location & OPD Timings" },
  ];

  return (
    <section className="about-section">

      <div className="about-tabs">
        {tabs.map(({ id, label }, i) => (
          <div
            key={id}
            className={`tab ${activeTab === id ? "active" : ""}`}
            onClick={() => scrollToSection(id)}
          >
            <span>0{i + 1}</span>
            <p>{label}</p>
          </div>
        ))}
      </div>

      {/* 01 — About */}
      <div ref={aboutRef} className="about-content">
        <div className="about-left">
          <h1>About</h1>
          <p>
            Dr. Ananya Menon is a Senior Consultant Interventional Cardiologist
            with 18 years of clinical experience across India and the United
            States. She trained at AIIMS Delhi and completed advanced
            fellowships in coronary intervention and structural heart disease.
            She leads the complex PCI programme at Sacred Health and chairs the
            weekly heart-team meeting.
          </p>
          <p>
            Her primary clinical interest is the management of acute coronary
            syndromes, complex bifurcation lesions and chronic total occlusions.
            She has authored over 40 peer-reviewed publications and presents
            annually at TCT and ESC.
          </p>
          <div className="expertise-section">
            <h4>AREAS OF EXPERTISE</h4>
            <div className="expertise-tags">
              {expertise.map((item, i) => (
                <button key={i}>{item}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="insurance-card">
  <h3>Insurance accepted</h3>

  <div className="insurance-tags">
    {insurance.map((company, index) => (
      <button key={index} className="insurance-pill">
        {company}
      </button>
    ))}
  </div>
</div>
      </div>

      {/* 02 — Reviews */}
      <div ref={reviewsRef} className="reviews-wrapper">
     
        <ReviewsSection/>
      </div>

      {/* 03 — Location & OPD Timings */}
      <div ref={locationRef} className="location-wrapper">
        <LocationTimings/>
      </div>

    </section>
  );
}