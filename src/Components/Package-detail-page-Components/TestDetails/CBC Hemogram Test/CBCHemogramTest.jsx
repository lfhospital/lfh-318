import React from "react";
import {Home, Building2, Phone} from "lucide-react"
import { togglePlanItem, usePlan } from "../../../../planStore";
import "./CBCHemogramTest.css";

export default function CBCHemogramTest({ packageData, loading, error }) {
  const { isInPlan } = usePlan();
  const inPlan = !!packageData && isInPlan(packageData._id);
  const defaultIncludedTests = [
    "Complete Blood Count (CBC)",
    "Blood Sugar Fasting + PP",
    "Lipid Profile Full",
    "Thyroid Function (TSH)",
    "Liver Function Test (LFT)",
  ];

  const defaultKeyTests = [
    "Complete Blood Count",
    "Lipid Profile",
    "HbA1c",
    "Liver Function",
    "Kidney Function",
    "Thyroid Profile",
    "Vitamin D",
    "Vitamin B12",
    "Iron Studies",
  ];

  // Build lab test name list from API data (if available)
  const apiLabTestNames = packageData?.labTests?.map((t) => t.labMainTest) || [];

  const allIncludedTests = apiLabTestNames.length > 0 ? apiLabTestNames : defaultIncludedTests;
  const includedTests = allIncludedTests.slice(0, 5);
  const extraIncludedCount = Math.max(allIncludedTests.length - 5, 0);

  const allKeyTests = apiLabTestNames.length > 0 ? apiLabTestNames : defaultKeyTests;
  const keyTests = allKeyTests.slice(0, 9);
  const extraKeyCount = Math.max(allKeyTests.length - 9, 0);

  const totalTests = packageData?.labTests?.reduce((sum, test) => {
    return sum + (test.subTests?.length || 1);
  }, 0);

  const title = packageData?.package_name || "CBC Hemogram Test";
  const description =
    packageData?.description ||
    "A comprehensive blood test that evaluates red blood cells, white blood cells, platelets, and other key blood parameters. Commonly recommended as part of routine health assessments, it helps identify infections, anaemia, inflammation, and other underlying health concerns while providing valuable insight into overall wellbeing.";
  const price = packageData?.price ? `₹${packageData.price.toLocaleString('en-IN')}` : "₹1,299";
  const homeCollectionText = packageData?.home_collection_available
    ? "Free home collection"
    : "Home collection unavailable";
  const categoryText = packageData?.package_type?.package_type?.toUpperCase() || "COMPREHENSIVE · MOST CHOSEN · FOR 35+";

  if (loading) {
    return (
      <section className="test-details-section">
        <p style={{ textAlign: 'center', padding: '4rem', fontSize: '1.2rem' }}>Loading package details...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="test-details-section">
        <p style={{ textAlign: 'center', padding: '4rem', fontSize: '1.2rem', color: 'red' }}>{error}</p>
      </section>
    );
  }

  return (
    <section className="test-details-section">
      <div className="test-details-container">
        {/* LEFT */}
        <div className="test-left">
          <span className="test-category">
            {categoryText}
          </span>

          <h1>{title}</h1>

          <p className="test-description">
            {description}
          </p>

          <div className="stats-wrapper">
            <div className="stat-box">
              <span>TESTS</span>
              <h3>{totalTests ? `${totalTests} included` : "08 included"}</h3>
              <p>Blood health markers</p>
            </div>

            <div className="stat-box">
              <span>FASTING</span>
              <h3>0 hrs</h3>
              <p>Not required</p>
            </div>

            <div className="stat-box">
              <span>REPORT</span>
              <h3>24-48 hrs</h3>
              <p>Digital + printed</p>
            </div>
          </div>

          <div className="key-tests-section">
            <h4>KEY TESTS</h4>

            <div className="chips-container">
              {keyTests.map((item, index) => (
                <span key={index} className="test-chip">
                  {item}
                </span>
              ))}

              {extraKeyCount > 0 && (
                <span className="test-chip more-chip">
                  +{extraKeyCount} more
                </span>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="test-right">
          <h3 className="plan-title">Add to your plan</h3>

          <div className="price-box">
            <h2>{price}</h2>
            <p>
              Inclusive of all taxes · {homeCollectionText}
            </p>
          </div>

          <div className="mode-selector">
            <button className="active-mode">
            <Home size={18}/> Home Collection
            </button>

            <button>
             <Building2 size={18}/>  Visit Hospital
            </button>
          </div>

          <div className="included-section">
            <h4>WHAT'S INCLUDED</h4>

            {includedTests.map((item, index) => (
              <div className="included-item" key={index}>
                ✓ {item}
              </div>
            ))}

            {extraIncludedCount > 0 && (
              <p className="more-tests">
                +{extraIncludedCount} more tests included
              </p>
            )}
          </div>

          <button
            className={`add-plan-btn ${inPlan ? "in-plan" : ""}`}
            aria-pressed={inPlan}
            disabled={!packageData}
            onClick={() =>
              togglePlanItem({
                id: packageData._id,
                title: packageData.package_name,
                price: packageData.price,
              })
            }
          >
            {inPlan ? "Added to plan ✓" : "Add to plan →"}
          </button>

          <div className="advisor-section">
            <span>Need help deciding?</span>

            <button>
              <Phone size={18}/> Talk to advisor
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}