import "./ComparisonOverview.css";

export default function ComparisonOverview() {
  return (
    <section className="comparison-overview-section">
      {/* OVERVIEW */}
      <div className="comparison-block">
        <h2>OVERVIEW</h2>

        <div className="ccomparison-row">
          <span className="label">Category</span>
          <span>Preventive</span>
          <span>Preventive + Condition-specific</span>
          <span>Preventive</span>
        </div>

        <div className="ccomparison-row">
          <span className="label">Best For</span>
          <span>Routine checkups</span>
          <span>Diabetes monitoring</span>
          <span>Diabetes monitoring</span>
        </div>

        <div className="ccomparison-row">
          <span className="label">No. of Tests Included</span>
          <span>10</span>
          <span>18</span>
          <span>18</span>
        </div>
      </div>

      {/* KEY DETAILS */}
      <div className="comparison-block">
        <h2>KEY DETAILS</h2>

        <div className="ccomparison-row">
          <span className="label">Fasting Required</span>
          <span>Yes (8–10 hrs)</span>
          <span>Yes (8 hrs) + Condition-specific</span>
          <span>Yes (8 hrs) + Condition-specific</span>
        </div>

        <div className="ccomparison-row">
          <span className="label">Report Time</span>
          <span>24 hours</span>
          <span>6-8 hours</span>
          <span>6-8 hours</span>
        </div>

        <div className="ccomparison-row">
          <span className="label">Home Collection</span>
          <span>Available</span>
          <span>Available</span>
          <span>Available</span>
        </div>
      </div>

      {/* SECOND KEY DETAILS */}
      <div className="comparison-block">
        <h2>KEY DETAILS</h2>

        <div className="ccomparison-row">
          <span className="label">Fasting Required</span>
          <span>Yes (8–10 hrs)</span>
          <span>Yes (8 hrs) + Condition-specific</span>
          <span>Yes (8 hrs) + Condition-specific</span>
        </div>

        <div className="ccomparison-row">
          <span className="label">Report Time</span>
          <span>24 hours</span>
          <span>6-8 hours</span>
          <span>6-8 hours</span>
        </div>

        <div className="ccomparison-row">
          <span className="label">Home Collection</span>
          <span>Available</span>
          <span>Available</span>
          <span>Available</span>
        </div>
      </div>
    </section>
  );
}