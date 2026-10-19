import React from "react";
import { Star, Clock3, BadgeCheck, ArrowRight, Phone } from "lucide-react";
import "./DiseaseOverview.css";
import { navigateTo } from "../../../../navigation";

export default function DiseaseOverview() {
  return (
    <section className="disease-overview-page">
      {/* =====================================================
          FIRST CONTENT SECTION
      ===================================================== */}

      <div className="disease-content">
        {/* ===================================================
            LEFT CONTENT
        =================================================== */}

        <main className="disease-main">
          {/* Definition */}
          <section
            id="definition"
            className="disease-section definition-section"
          >
            <h2 className="disease-heading">
              What is coronary artery disease?
            </h2>

            <p className="disease-text">
              Coronary artery disease (CAD) develops when the major blood
              vessels that supply your heart become damaged or diseased. Fatty
              deposits called plaque build up inside these arteries a process
              known as atherosclerosis narrowing them and reducing blood flow to
              the heart muscle.
            </p>

            <p className="disease-text definition-text-second">
              As the arteries narrow, your heart receives less oxygen-rich
              blood. Over time this can lead to chest pain (angina), shortness
              of breath, or — if an artery becomes completely blocked a heart
              attack.
            </p>
          </section>

          {/* =================================================
              SYMPTOMS
          ================================================= */}

          <section id="symptoms" className="symptoms-section">
            <h2 className="disease-heading symptoms-heading">Symptoms</h2>

            <p className="symptoms-intro">
              Symptoms often appear gradually and may only be noticeable during
              physical activity or stress, when the heart demands more blood.
            </p>

            {/* Symptoms Grid */}

            <div className="symptoms-grid">
              {/* Card 1 */}
              <article className="symptom-card">
                <span className="symptom-number">01</span>

                <div className="symptom-card-content">
                  <h3>Chest pain (angina)</h3>

                  <p>
                    Pressure, tightness or squeezing, usually in the centre or
                    left side of the chest.
                  </p>
                </div>
              </article>

              {/* Card 2 */}
              <article className="symptom-card">
                <span className="symptom-number">02</span>

                <div className="symptom-card-content">
                  <h3>Fatigue</h3>

                  <p>
                    Unusual tiredness when the heart can't pump efficiently.
                  </p>
                </div>
              </article>

              {/* Card 3 */}
              <article className="symptom-card">
                <span className="symptom-number">03</span>

                <div className="symptom-card-content">
                  <h3>Shortness of breath</h3>

                  <p>
                    Feeling winded during exertion or, in advanced cases, at
                    rest.
                  </p>
                </div>
              </article>

              {/* Card 4 */}
              <article className="symptom-card">
                <span className="symptom-number">04</span>

                <div className="symptom-card-content">
                  <h3>Pain that radiates</h3>

                  <p>
                    Discomfort spreading to the arm, shoulder, neck, jaw or
                    back.
                  </p>
                </div>
              </article>
            </div>

            {/* =================================================
                EMERGENCY CARE
            ================================================= */}

            <div className="emergency-section">
              <h3>Seek emergency care</h3>

              <p>
                Crushing chest pain, pain spreading to the arm or jaw, cold
                sweats, nausea or sudden breathlessness may signal a heart
                attack.
                <br />
                Call emergency services immediately — do not wait.
              </p>
            </div>
          </section>
        </main>

        {/* ===================================================
            RIGHT SIDEBAR
        =================================================== */}

        <aside className="disease-sidebar">
          {/* =================================================
              WHY LAKSHMEE FOUNDATION HOSPITAL
          ================================================= */}

          <div className="do-hospital-card">
            <h2>Why Lakshmee Foundation Hospital</h2>

            {/* Doctor Reviewed */}
            <div className="hospital-feature">
              <div className="feature-icon">
                <Star size={13} />
              </div>

              <div className="feature-content">
                <h3>Doctor reviewed</h3>

                <p>Curated by senior physicians</p>
              </div>
            </div>

            <div className="hospital-divider" />

            {/* Reports */}
            <div className="hospital-feature">
              <div className="feature-icon">
                <Clock3 size={13} />
              </div>

              <div className="feature-content">
                <h3>12-hour reports</h3>

                <p>Digital + printed copies</p>
              </div>
            </div>

            <div className="hospital-divider" />

            {/* Patients */}
            <div className="hospital-feature">
              <div className="feature-icon">
                <BadgeCheck size={13} />
              </div>

              <div className="feature-content">
                <h3>2.4 lakh+ patients</h3>

                <p>Trusted across Vijayawada</p>
              </div>
            </div>

            <div className="hospital-divider" />

            {/* Certification */}
            <div className="hospital-feature">
              <div className="feature-icon">
                <BadgeCheck size={13} />
              </div>

              <div className="feature-content">
                <h3>NABL &amp; CAP certified</h3>

                <p>Same standard, every sample</p>
              </div>
            </div>
          </div>

          {/* =================================================
              HELP CARD
          ================================================= */}

          <div className="help-card">
            <h2>Need help?</h2>

            <p>
              Speak with our advisor. They'll walk you through what's right for
              your age, history and goals no upsell.
            </p>

            <button
              className="advisor-button"
              onClick={() => navigateTo("ContactUs")}
            >
              <span>Talk to an Advisor</span>

              <ArrowRight size={17} />
            </button>
          </div>
        </aside>
      </div>

      {/* =====================================================
          SECOND SECTION — CAUSES
      ===================================================== */}

      <section id="causes" className="causes-section">
        <h2 className="causes-heading">Causes</h2>

        <p className="causes-intro">
          CAD usually begins with damage to the inner layer of a coronary
          artery. Once the artery wall is
          <br />
          damaged, fatty deposits, cholesterol and other substances accumulate
          at the site forming plaque.
        </p>

        <ul className="causes-list">
          <li>
            <span className="cause-dot"></span>
            Build-up of LDL ("bad") cholesterol within the artery wall
          </li>

          <li>
            <span className="cause-dot"></span>
            Chronic inflammation that damages the artery lining
          </li>

          <li>
            <span className="cause-dot"></span>
            Smoking, which injures blood vessels and accelerates plaque
            formation
          </li>

          <li>
            <span className="cause-dot"></span>
            High blood pressure that places ongoing stress on the arteries
          </li>
        </ul>
      </section>
    </section>
  );
}
