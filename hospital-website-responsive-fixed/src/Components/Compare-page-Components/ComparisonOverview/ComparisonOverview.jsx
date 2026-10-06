import { useEffect, useState } from "react";
import "./ComparisonOverview.css";
import {
  getRemovedIds,
  subscribeToComparison,
} from "../comparisonStore";

const PACKAGE_DATA = [
  {
    id: 1,
    category: "Preventive",
    bestFor: "Routine checkups",
    tests: "10",
    fasting: "Yes (8–10 hrs)",
    reportTime: "24 hours",
    homeCollection: "Available",
  },
  {
    id: 2,
    category: "Preventive + Condition-specific",
    bestFor: "Diabetes monitoring",
    tests: "18",
    fasting: "Yes (8 hrs) + Condition-specific",
    reportTime: "6-8 hours",
    homeCollection: "Available",
  },
  {
    id: 3,
    category: "Preventive",
    bestFor: "Diabetes monitoring",
    tests: "18",
    fasting: "Yes (8 hrs) + Condition-specific",
    reportTime: "6-8 hours",
    homeCollection: "Available",
  },
];

export default function ComparisonOverview() {
  const [removedIds, setRemovedIds] = useState(getRemovedIds());

  useEffect(() => {
    return subscribeToComparison(setRemovedIds);
  }, []);

  const visiblePackages = PACKAGE_DATA.filter(
    (pkg) => !removedIds.includes(pkg.id),
  );

  const renderRow = (label, key) => (
    <div
      className="ccomparison-row"
      style={{ "--package-count": visiblePackages.length }}
    >
      <span className="label">{label}</span>
      {visiblePackages.map((pkg) => (
        <span key={pkg.id}>{pkg[key]}</span>
      ))}
    </div>
  );

  return (
    <section className="comparison-overview-section">
      <div className="comparison-block">
        <h2>OVERVIEW</h2>
        {renderRow("Category", "category")}
        {renderRow("Best For", "bestFor")}
        {renderRow("No. of Tests Included", "tests")}
      </div>

      <div className="comparison-block">
        <h2>KEY DETAILS</h2>
        {renderRow("Fasting Required", "fasting")}
        {renderRow("Report Time", "reportTime")}
        {renderRow("Home Collection", "homeCollection")}
      </div>

      <div className="comparison-block">
        <h2>KEY DETAILS</h2>
        {renderRow("Fasting Required", "fasting")}
        {renderRow("Report Time", "reportTime")}
        {renderRow("Home Collection", "homeCollection")}
      </div>
    </section>
  );
}
