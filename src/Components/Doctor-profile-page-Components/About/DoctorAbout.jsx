import { useRef, useState } from "react";
import "./DoctorAbout.css";
import ReviewsSection from "../ReviewsSection/ReviewsSection";
import LocationTimings from "../LocationTimings/LocationTimings";

export default function DoctorAbout({ doctorData, doctorId }) {
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

  // Use doctorData if available, otherwise use default values
  const displayName = doctorData
    ? `Dr. ${doctorData.firstName} ${doctorData.lastName}`
    : "Dr. Ananya Menon";
  
  const displayAbout = doctorData && doctorData.about && doctorData.about.trim() !== ""
    ? doctorData.about
    : `${displayName} is a ${doctorData?.speciality_fee?.[0]?.speciality || 'medical professional'} with ${doctorData?.yearsOfExp || '18'} years of clinical experience. ${doctorData?.education?.[0] ? `Graduated with ${doctorData.education[0].degree} from ${doctorData.education[0].collegeName}.` : ''} Registered with ${doctorData?.registrationCouncil || 'Medical Council'} (Registration No: ${doctorData?.registernumber || 'N/A'}).`;
  
  const displayExpertise = doctorData && doctorData.speciality_fee && doctorData.speciality_fee.length > 0
    ? doctorData.speciality_fee.map(s => s.speciality)
    : expertise;
  
  const displayEducation = doctorData && doctorData.education && doctorData.education.length > 0
    ? doctorData.education
    : [];
  
  const displayAwards = doctorData && doctorData.awards && doctorData.awards.length > 0
    ? doctorData.awards
    : [];
  
  const displayMemberships = doctorData && doctorData.memberships && doctorData.memberships.length > 0
    ? doctorData.memberships
    : [];

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
            {displayAbout}
          </p>
          
          {displayEducation.length > 0 && (
            <div className="expertise-section" style={{ marginTop: '30px', marginBottom: '30px' }}>
              <h4>EDUCATION</h4>
              <div className="expertise-tags">
                {displayEducation.map((edu, i) => (
                  <button key={i}>{edu.degree} - {edu.collegeName} ({edu.passedOutYear})</button>
                ))}
              </div>
            </div>
          )}
          
          <div className="expertise-section" style={{ marginTop: '30px' }}>
            <h4>AREAS OF EXPERTISE</h4>
            <div className="expertise-tags">
              {displayExpertise.map((item, i) => (
                <button key={i}>{item}</button>
              ))}
            </div>
          </div>
          
          {displayAwards.length > 0 && (
            <div className="expertise-section" style={{ marginTop: '30px' }}>
              <h4>AWARDS & RECOGNITION</h4>
              <div className="expertise-tags">
                {displayAwards.map((award, i) => (
                  <button key={i}>{award}</button>
                ))}
              </div>
            </div>
          )}
          
          {displayMemberships.length > 0 && (
            <div className="expertise-section" style={{ marginTop: '30px' }}>
              <h4>MEMBERSHIPS</h4>
              <div className="expertise-tags">
                {displayMemberships.map((membership, i) => (
                  <button key={i}>{membership}</button>
                ))}
              </div>
            </div>
          )}
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
     
        <ReviewsSection doctorId={doctorId || doctorData?.doctorId || doctorData?._id} />
      </div>

      {/* 03 — Location & OPD Timings */}
      <div ref={locationRef} className="location-wrapper">
        <LocationTimings/>
      </div>

    </section>
  );
}