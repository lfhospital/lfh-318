import React, { useState } from "react";
import "./WhatsIncluded.css";

export default function WhatsIncluded({ packageData }) {
  const [openPanels, setOpenPanels] = useState([]);

  const togglePanel = (index) => {
    setOpenPanels((prev) =>
      prev.includes(index)
        ? prev.filter((item) => item !== index)
        : [...prev, index]
    );
  };

  const defaultPanels = [
    {
      number: "01",
      title: "Blood & Hematology",
      description: "Complete blood count and related markers",
      tests: "14 TESTS",
      testNames: [],
    },
    {
      number: "02",
      title: "Diabetes & Metabolism",
      description: "Sugar control and insulin sensitivity",
      tests: "9 TESTS",
      testNames: [],
    },
    {
      number: "03",
      title: "Cardiac & Lipid Profile",
      description: "Heart risk markers and cholesterol",
      tests: "11 TESTS",
      testNames: [],
    },
    {
      number: "04",
      title: "Liver Function",
      description: "Hepatic enzymes, proteins and bilirubin",
      tests: "12 TESTS",
      testNames: [],
    },
    {
      number: "05",
      title: "Kidney Function",
      description: "Renal markers and electrolytes",
      tests: "9 TESTS",
      testNames: [],
    },
    {
      number: "06",
      title: "Thyroid Profile",
      description: "Comprehensive thyroid function tests",
      tests: "5 TESTS",
      testNames: [],
    },
    {
      number: "07",
      title: "Vitamins & Minerals",
      description: "Essential nutrient panel",
      tests: "26 TESTS",
      testNames: [],
    },
  ];

  // Group API labTests by their relevanceName to build dynamic panels
  const buildPanelsFromApi = () => {
    if (!packageData?.labTests || packageData.labTests.length === 0) {
      return null;
    }

    const grouped = {};
    packageData.labTests.forEach((test) => {
      const groupName = test.relevanceName || "General";
      if (!grouped[groupName]) {
        grouped[groupName] = [];
      }
      grouped[groupName].push(test.labMainTest);
    });

    return Object.entries(grouped).map(([groupName, testNames], index) => ({
      number: String(index + 1).padStart(2, "0"),
      title: groupName,
      description: `${testNames.length} test${testNames.length > 1 ? "s" : ""} included`,
      tests: `${testNames.length} TEST${testNames.length > 1 ? "S" : ""}`,
      testNames,
    }));
  };

  const apiPanels = buildPanelsFromApi();
  const panels = apiPanels || defaultPanels;

  const totalTests = packageData?.labTests?.reduce((sum, test) => {
    return sum + (test.subTests?.length || 1);
  }, 0);

  const benefits = [
    {
      title: "Doctor reviewed",
      subtitle: "Curated by senior physicians",
    },
    {
      title: "12-hour reports",
      subtitle: "Digital + printed copies",
    },
    {
      title: "2.4 lakh+ patients",
      subtitle: "Trusted across Vijayawada",
    },
    {
      title: "NABL & CAP certified",
      subtitle: "Same standard, every sample",
    },
  ];

  return (
    <section className="package-tabs-section">
      <div className="package-content">
        <div className="package-left">
          <div className="title-row">
            <h1>What's included</h1>
            <span>{totalTests ? `${totalTests} tests · ` : ""}{panels.length} panels</span>
          </div>

          {panels.map((item, index) => (
            <div className="panel-wrapper" key={index}>
              <div className="panel-row">
                <div className="panel-number">{item.number}</div>

                <div className="panel-content">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>

                <div className="panel-actions">
                  <span className="tests-badge">{item.tests}</span>

                  <button
                    className={`plus-btn ${
                      openPanels.includes(index) ? "active" : ""
                    }`}
                    onClick={() => togglePanel(index)}
                  >
                    {openPanels.includes(index) ? "−" : "+"}
                  </button>
                </div>
              </div>

              {openPanels.includes(index) && (
                <div className="dropdown-content">
                  {(item.testNames && item.testNames.length > 0
                    ? item.testNames
                    : [
                        "Complete Blood Count (CBC)",
                        "Complete Blood Count (CBC)",
                        "Complete Blood Count (CBC)",
                        "Complete Blood Count (CBC)",
                        "Complete Blood Count (CBC)",
                        "Complete Blood Count (CBC)",
                        "Complete Blood Count (CBC)",
                        "Complete Blood Count (CBC)",
                      ]
                  ).map((testName, testIndex) => (
                    <div className="test-item" key={testIndex}>✓ {testName}</div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}