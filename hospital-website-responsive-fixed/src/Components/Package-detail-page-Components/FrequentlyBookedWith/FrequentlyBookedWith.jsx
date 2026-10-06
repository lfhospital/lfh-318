import "./FrequentlyBookedWith.css";

export default function FrequentlyBookedWith() {
  return (
    <section className="frequently-booked-section">
      <h1 className="fwbsection-title">Frequently booked with</h1>
      <div className="cards-wrapper">
        <div className="package-card">
          <span className="card-tag">
            COMPREHENSIVE · MOST CHOSEN
          </span>

          <h2>Full Body</h2>

          <p className="booked-text">
            Booked 1200+ times this month
          </p>

          <p className="card-description">
            Cardiac risk assessment with lipid profile, hs-CRP,
            ECG, 2D echo and consultation with a
            cardiologist...
          </p>

          <p className="card-meta">
            42 tests · 8h fasting · Report in 24h · Home collection
            available
          </p>

          <div className="divider"></div>

          <div className="price-row">
            <div>
              <h3>₹2,299</h3>
              <span>Inclusive of all taxes</span>
            </div>

            <button className="detail-btn">
              View Detail
            </button>
          </div>

          <button className="plan-btn">
            Add to plan <span>→</span>
          </button>
        </div>

        <div className="package-card">
          <span className="card-tag">
            COMPREHENSIVE · MOST CHOSEN
          </span>

          <h2>Full Body</h2>

          <p className="booked-text">
            Booked 1200+ times this month
          </p>

          <p className="card-description">
            Cardiac risk assessment with lipid profile, hs-CRP,
            ECG, 2D echo and consultation with a
            cardiologist...
          </p>

          <p className="card-meta">
            42 tests · 8h fasting · Report in 24h · Home collection
            available
          </p>

          <div className="divider"></div>

          <div className="price-row">
            <div>
              <h3>₹2,299</h3>
              <span>Inclusive of all taxes</span>
            </div>

            <button className="detail-btn">
              View Detail
            </button>
          </div>

          <button className="plan-btn">
            Add to plan <span>→</span>
          </button>
        </div>
      </div>

      <button className="view-all-btn">
        View all <span>→</span>
      </button>
    </section>
  );
}