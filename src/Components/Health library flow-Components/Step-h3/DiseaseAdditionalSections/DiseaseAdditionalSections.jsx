import React from "react";
import { CheckCircle2, ArrowRight } from "lucide-react";
import "./DiseaseAdditionalSections.css";
import { navigateTo } from "../../../../navigation";

const findCardiologist = () => navigateTo("allDoctors", { specialty: "Cardiology" });
const openProcedures = () => navigateTo("specialty", { section: "procedures" });

export default function DiseaseAdditionalSections() {
  return (
    <section className="da-page">
      {/* =====================================================
          1. RISK FACTORS
      ===================================================== */}

      <section id="risk-factors" className="da-section da-risk-section">
        <h2 className="da-heading">Risk factors</h2>

        <p className="da-description da-risk-description">
          Some risk factors you can change, others you cannot. Knowing yours
          helps you and your doctor
          <br />
          decide how aggressively to act.
        </p>

        {/* Modifiable */}

        <div className="da-risk-group">
          <h3 className="da-subheading">Modifiable</h3>

          <ul className="da-bullet-list">
            <li>
              <span className="da-bullet"></span>
              Smoking and tobacco use
            </li>

            <li>
              <span className="da-bullet"></span>
              High cholesterol and high blood pressure
            </li>

            <li>
              <span className="da-bullet"></span>
              Diabetes and obesity
            </li>

            <li>
              <span className="da-bullet"></span>
              Physical inactivity and an unhealthy diet
            </li>
          </ul>
        </div>

        {/* Non Modifiable */}

        <div className="da-risk-group da-nonmodifiable">
          <h3 className="da-subheading">Non modifiable</h3>

          <ul className="da-bullet-list">
            <li>
              <span className="da-bullet"></span>
              Age (risk rises after 45 in men, 55 in women)
            </li>

            <li>
              <span className="da-bullet"></span>
              Family history of early heart disease
            </li>
          </ul>
        </div>
      </section>

      {/* =====================================================
          2. DIAGNOSIS
      ===================================================== */}

      <section id="diagnosis" className="da-section da-diagnosis-section">
        <h2 className="da-heading">Diagnosis</h2>

        <p className="da-description">
          Your cardiologist will start with your history and a physical exam,
          then confirm with one or more tests:
        </p>

        <div className="da-diagnosis-grid">
          {/* Test 1 */}

          <div className="da-test-card">
            <CheckCircle2 className="da-check-icon" size={16} />

            <div>
              <h3>Lipid profile &amp; blood tests</h3>

              <p>measure cholesterol and markers of risk</p>
            </div>
          </div>

          {/* Test 2 */}

          <div className="da-test-card">
            <CheckCircle2 className="da-check-icon" size={16} />

            <div>
              <h3>ECG</h3>

              <p>records the heart's electrical activity</p>
            </div>
          </div>

          {/* Test 3 */}

          <div className="da-test-card">
            <CheckCircle2 className="da-check-icon" size={16} />

            <div>
              <h3>Stress Test</h3>

              <p>assesses heart function during exertion</p>
            </div>
          </div>

          {/* Test 4 */}

          <div className="da-test-card">
            <CheckCircle2 className="da-check-icon" size={16} />

            <div>
              <h3>Coronary angiography</h3>

              <p>imaging to see blockages directly</p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          3. TREATMENT OPTIONS
      ===================================================== */}

      <section id="treatment" className="da-section da-treatment-section">
        <h2 className="da-heading">Treatment options</h2>

        <p className="da-description da-treatment-description">
          Treatment aims to slow plaque build-up, manage symptoms and reduce the
          risk of complications. It
          <br />
          usually combines lifestyle changes, medication and — when needed —
          procedures.
        </p>

        {/* Medications */}

        <div className="da-treatment-group">
          <h3 className="da-subheading">Medications</h3>

          <p className="da-treatment-text">
            Statins to lower cholesterol, blood thinners, beta-blockers and
            blood pressure medicines are commonly prescribed.
          </p>
        </div>

        {/* Procedures */}

        <div className="da-treatment-group da-procedures">
          <h3 className="da-subheading">Procedures</h3>

          {/* Procedure 1 */}

          <button className="da-procedure-row" onClick={openProcedures}>
            <div>
              <h4>Coronary Angioplasty &amp; Stenting</h4>

              <p>Minimally invasive — opens blocked arteries</p>
            </div>

            <ArrowRight size={16} className="da-procedure-arrow" />
          </button>

          {/* Procedure 2 */}

          <button className="da-procedure-row" onClick={openProcedures}>
            <div>
              <h4>Bypass Surgery (CABG)</h4>

              <p>Reroutes blood around blocked arteries</p>
            </div>

            <ArrowRight size={16} className="da-procedure-arrow" />
          </button>
        </div>
      </section>

      {/* =====================================================
          4. PREVENTION
      ===================================================== */}

      <section id="prevention" className="da-section da-prevention-section">
        <h2 className="da-heading">Prevention</h2>

        <p className="da-description">
          The same habits that treat CAD also help prevent it. Most are within
          your control:
        </p>

        <ul className="da-prevention-list">
          <li>
            <span className="da-bullet"></span>
            Stop smoking and avoid second-hand smoke
          </li>

          <li>
            <span className="da-bullet"></span>
            Eat a heart-healthy diet rich in vegetables, whole grains and lean
            protein
          </li>

          <li>
            <span className="da-bullet"></span>
            Stay active — aim for 150 minutes of moderate exercise weekly
          </li>

          <li>
            <span className="da-bullet"></span>
            Maintain a healthy weight and manage stress
          </li>

          <li>
            <span className="da-bullet"></span>
            Keep blood pressure, cholesterol and blood sugar in target ranges
          </li>
        </ul>
      </section>

      {/* =====================================================
          5. WHEN TO SEE A DOCTOR
      ===================================================== */}

      <section id="doctor" className="da-section da-doctor-section">
        <h2 className="da-heading">When to see a doctor</h2>

        <p className="da-description da-doctor-description">
          See a cardiologist if you have ongoing chest discomfort,
          breathlessness on exertion, or several risk
          <br />
          factors. If you experience sudden, severe chest pain — treat it as an
          emergency.
        </p>

        {/* Buttons */}

        <div className="da-doctor-actions">
          <button className="da-primary-button" onClick={findCardiologist}>
            <span>Find a Cardiologist</span>

            <ArrowRight size={16} />
          </button>

          <button
            className="da-secondary-button"
            onClick={() => navigateTo("healthPackages")}
          >
            Heart Checkup Packages
          </button>
        </div>
      </section>
    </section>
  );
}
