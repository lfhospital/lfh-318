import { FileText, Clock3, Zap } from "lucide-react";
import "./ComparisonDetails.css";

export default function ComparisonDetails() {
  return (
    <section className="comparison-details-section">

      {/* TESTS INCLUDED */}
      <div className="comparison-block">
        <div className="comparison-row">
          <div className="comparison-label">
            <h2>TESTS INCLUDED</h2>
            <p>Complete List</p>
          </div>

          <div className="comparison-column">
            <ul>
              <li>✓ Complete Blood Count (CBC)</li>
              <li>✓ Blood Sugar Fasting + PP</li>
              <li>✓ Lipid Profile Full</li>
              <li>✓ Thyroid Function (TSH)</li>
              <li>✓ Liver Function Test (LFT)</li>
            </ul>

            <span>+12 more tests included</span>
          </div>

          <div className="comparison-column">
            <ul>
              <li>✓ Complete Blood Count (CBC)</li>
              <li>✓ Blood Sugar Fasting + PP</li>
              <li>✓ Lipid Profile Full</li>
              <li>✓ Thyroid Function (TSH)</li>
              <li>✓ Liver Function Test (LFT)</li>
            </ul>

            <span>+12 more tests included</span>
          </div>

          <div className="comparison-column">
            <ul>
              <li>✓ Complete Blood Count (CBC)</li>
              <li>✓ Blood Sugar Fasting + PP</li>
              <li>✓ Lipid Profile Full</li>
              <li>✓ Thyroid Function (TSH)</li>
              <li>✓ Liver Function Test (LFT)</li>
            </ul>

            <span>+12 more tests included</span>
          </div>
        </div>
      </div>

      <div className="section-divider"></div>

      {/* ADDITIONAL INFO */}
      <div className="comparison-block">
        <h2 className="section-heading">
          ADDITIONAL INFORMATION
        </h2>

        <div className="info-row">
          <span>Reports Format</span>
          <p>Digital PDF</p>
          <p>Digital + Doctor summary</p>
          <p>Digital + Doctor summary</p>
        </div>

        <div className="info-row">
          <span>Consultation Included</span>
          <p>No</p>
          <p>Optional add-on</p>
          <p>Optional add-on</p>
        </div>

        <div className="info-row">
          <span>Recommended Frequency</span>
          <p>Once a year</p>
          <p>Every 3–6 months</p>
          <p>Every 3–6 months</p>
        </div>
      </div>

      {/* KEY DIFFERENCES */}
      <div className="key-differences">
        <div className="key-title">
          KEY DIFFERENCES
        </div>

        <div className="difference-item">
          <div className="icon-circle">
            <FileText size={18} />
          </div>

          <div>
            <span>Tests Included</span>
            <p>10 vs 18 tests</p>
          </div>
        </div>

        <div className="difference-item">
          <div className="icon-circle">
            <Clock3 size={18} />
          </div>

          <div>
            <span>Report Time</span>
            <p>24 hours vs 6–8 hours</p>
          </div>
        </div>

        <div className="difference-item">
          <div className="icon-circle">
            <Zap size={18} />
          </div>

          <div>
            <span>Best For</span>
            <p>Routine vs Diabetes</p>
          </div>
        </div>
      </div>

    </section>
  );
}