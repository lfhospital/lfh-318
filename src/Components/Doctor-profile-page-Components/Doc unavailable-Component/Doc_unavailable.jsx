import React from "react";
import "./Doc_unavailable.css";
import { ArrowRight, ArrowLeft, ChevronRight } from "lucide-react";

import doctor from "../../../asserts/doctors.jpg";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/DoctorFooter";

export default function Doc_unavailable() {
  const doctors = [1, 2, 3, 4, 5, 6];

  return (
    <>
      <Navbar />
      <section className="dc-doctors-listing-section">
        <section className="dc-doctor-unavailable">
          <div className="dc-doctor-unavailable-content">
            <h2>This doctor isn't available at the moment</h2>

            <p>
              You can explore other available specialists in the same department
              or check back later for future availability.
            </p>

            <div className="dc-doctor-unavailable-divider"></div>
          </div>
        </section>
        <div className="dc-listing-container">
          <div className="dc-doctors-panel">
            <div className="dc-title">
              <h2>Recommended alternatives</h2>
            </div>
            {doctors.map((item) => (
              <div className="dc-doctor-card" key={item}>
                <img src={doctor} alt="Doctor" />

                <div className="dc-doctor-content">
                  <div className="dc-alldoctor-top">
                    <div>
                      <h2>
                        Dr. Rohan Pillai
                        <span> MBBS, MD - Cardiology</span>
                      </h2>

                      <h4>General Pediatrics & Neonatology</h4>

                      <p>
                        MBBS (Grant Medical College) · MD Pediatrics (JIPMER) ·
                        Fellowship Neonatology, Great Ormond Street Hospital,
                        London
                      </p>
                    </div>

                    <button className="dc-profile-link">View Profile</button>
                  </div>

                  <div className="dc-doctor-stats">
                    <div>
                      <span>EXPERIENCE</span>
                      <h5>22 years</h5>
                    </div>

                    <div>
                      <span>RATING</span>
                      <h5>4.8 (1200)</h5>
                    </div>

                    <div>
                      <span>CONSULTS</span>
                      <h5>In person · Video</h5>
                    </div>
                  </div>

                  <div className="dc-language-section">
                    <span>LANGUAGES</span>

                    <div>
                      <p>English</p>
                      <p>Hindi</p>
                      <p>Telugu</p>
                    </div>
                  </div>
                </div>

                <button className="dc-book-btn">
                  Book <ArrowRight size={24} />
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="dc-assistance-section">
          <button>
            View all
            <ArrowRight size={22} />
          </button>
        </div>
      </section>

      <Footer />
    </>
  );
}
