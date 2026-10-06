import { useEffect, useState } from "react";
import { FileText, Clock3, Zap } from "lucide-react";
import "./ComparisonDetails.css";
import {
  getRemovedIds,
  subscribeToComparison,
} from "../comparisonStore";

const PACKAGE_DATA = [
  {
    id: 1,
    tests: [
      "✓ Complete Blood Count (CBC)",
      "✓ Blood Sugar Fasting + PP",
      "✓ Lipid Profile Full",
      "✓ Thyroid Function (TSH)",
      "✓ Liver Function Test (LFT)",
    ],
    more: "+12 more tests included",
    reports: "Digital PDF",
    consultation: "No",
    frequency: "Once a year",
    testsDifference: "10 vs 18 tests",
    reportDifference: "24 hours vs 6–8 hours",
    bestFor: "Routine vs Diabetes",
  },
  {
    id: 2,
    tests: [
      "✓ Complete Blood Count (CBC)",
      "✓ Blood Sugar Fasting + PP",
      "✓ Lipid Profile Full",
      "✓ Thyroid Function (TSH)",
      "✓ Liver Function Test (LFT)",
    ],
    more: "+12 more tests included",
    reports: "Digital + Doctor summary",
    consultation: "Optional add-on",
    frequency: "Every 3–6 months",
    testsDifference: "10 vs 18 tests",
    reportDifference: "24 hours vs 6–8 hours",
    bestFor: "Routine vs Diabetes",
  },
  {
    id: 3,
    tests: [
      "✓ Complete Blood Count (CBC)",
      "✓ Blood Sugar Fasting + PP",
      "✓ Lipid Profile Full",
      "✓ Thyroid Function (TSH)",
      "✓ Liver Function Test (LFT)",
    ],
    more: "+12 more tests included",
    reports: "Digital + Doctor summary",
    consultation: "Optional add-on",
    frequency: "Every 3–6 months",
    testsDifference: "10 vs 18 tests",
    reportDifference: "24 hours vs 6–8 hours",
    bestFor: "Routine vs Diabetes",
  },
];

export default function ComparisonDetails() {
  const [removedIds, setRemovedIds] = useState(getRemovedIds());

  useEffect(() => {
    return subscribeToComparison(setRemovedIds);
  }, []);

  const visiblePackages = PACKAGE_DATA.filter(
    (pkg) => !removedIds.includes(pkg.id),
  );

  const gridStyle = {
    "--package-count": visiblePackages.length,
  };

  return (
    <section className="comparison-details-section">
      <div className="comparison-block">
        <div className="comparison-row" style={gridStyle}>
          <div className="comparison-label">
            <h2>TESTS INCLUDED</h2>
            <p>Complete List</p>
          </div>

          {visiblePackages.map((pkg) => (
            <div className="comparison-column" key={pkg.id}>
              <ul>
                {pkg.tests.map((test) => (
                  <li key={test}>{test}</li>
                ))}
              </ul>
              <span>{pkg.more}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="section-divider"></div>

      <div className="comparison-block">
        <h2 className="section-heading">ADDITIONAL INFORMATION</h2>

        <div className="info-row" style={gridStyle}>
          <span>Reports Format</span>
          {visiblePackages.map((pkg) => (
            <p key={pkg.id}>{pkg.reports}</p>
          ))}
        </div>

        <div className="info-row" style={gridStyle}>
          <span>Consultation Included</span>
          {visiblePackages.map((pkg) => (
            <p key={pkg.id}>{pkg.consultation}</p>
          ))}
        </div>

        <div className="info-row" style={gridStyle}>
          <span>Recommended Frequency</span>
          {visiblePackages.map((pkg) => (
            <p key={pkg.id}>{pkg.frequency}</p>
          ))}
        </div>
      </div>

      <div className="key-differences" style={gridStyle}>
        <div className="key-title">KEY DIFFERENCES</div>

        <div className="difference-item">
          <div className="icon-circle">
            <FileText size={18} />
          </div>
          <div>
            <span>Tests Included</span>
            <p>{visiblePackages[0]?.testsDifference || "—"}</p>
          </div>
        </div>

        {visiblePackages.length > 1 && (
          <div className="difference-item">
            <div className="icon-circle">
              <Clock3 size={18} />
            </div>
            <div>
              <span>Report Time</span>
              <p>{visiblePackages[1]?.reportDifference || "—"}</p>
            </div>
          </div>
        )}

        {visiblePackages.length > 2 && (
          <div className="difference-item">
            <div className="icon-circle">
              <Zap size={18} />
            </div>
            <div>
              <span>Best For</span>
              <p>{visiblePackages[2]?.bestFor || "—"}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
