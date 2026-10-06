import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, ArrowRight, Search } from "lucide-react";
import "./ComparePackages.css";
import {
  getRemovedIds,
  removePackage,
  subscribeToComparison,
} from "../comparisonStore";

// ---- All package content lives here. Add/remove packages by editing this array only. ----
const PACKAGES_DATA = [
  {
    id: 1,
    title: ["Basic Health", "Checkup"],
    subtitle: "For adults 18–40 years",
    price: "₹1,299",
    alternatives: [
      {
        title: "Comprehensive Panel",
        subtitle: "For adults 40+",
        tests: "32 tests",
        tag: "Preventive + Advanced",
        price: "₹ 800",
      },
    ],
  },
  {
    id: 2,
    title: ["Advanced Health", "Checkup"],
    subtitle: "For adults 40+ years",
    price: "₹2,299",
    alternatives: [
      {
        title: "Heart Health Package",
        subtitle: "For adults 40+",
        tests: "42 tests",
        tag: "Cardiac + Preventive",
        price: "₹ 1,200",
      },
    ],
  },
  {
    id: 3,
    title: ["Full Body", "Advanced"],
    subtitle: "For adults 35+ years",
    price: "₹3,299",
    alternatives: [
      {
        title: "Full Body Advanced",
        subtitle: "For adults 35+",
        tests: "86 tests",
        tag: "Complete Wellness",
        price: "₹ 2,000",
      },
    ],
  },
];

export const getVisiblePackages = () =>
  PACKAGES_DATA.filter((pkg) => !getRemovedIds().includes(pkg.id));

export default function ComparePackages() {
  const [openPackage, setOpenPackage] = useState(null);
  const [removedIds, setRemovedIds] = useState(getRemovedIds());

  useEffect(() => {
    return subscribeToComparison(setRemovedIds);
  }, []);

  const handleRemove = (id) => {
    removePackage(id);

    if (openPackage === id) {
      setOpenPackage(null);
    }
  };

  const visiblePackages = PACKAGES_DATA.filter(
    (pkg) => !removedIds.includes(pkg.id),
  );

  return (
    <section className="compare-packages-section">
      <div
        className="compare-grid"
        style={{
          "--package-count": visiblePackages.length,
        }}
      >
        <div className="compare-label">
          <h2>PACKAGES & TESTS</h2>
        </div>

        {visiblePackages.map((pkg) => {
          const isOpen = openPackage === pkg.id;

          return (
            <div className="compare-column" key={pkg.id}>
              <div className="package-wrapper">
                <div
                  className="package-box"
                  onClick={() => setOpenPackage(isOpen ? null : pkg.id)}
                >
                  <div>
                    <h3>
                      {pkg.title[0]}
                      <br />
                      {pkg.title[1]}
                    </h3>
                    <p>{pkg.subtitle}</p>
                  </div>

                  {isOpen ? (
                    <ChevronUp className="dropdown-icon" />
                  ) : (
                    <ChevronDown className="dropdown-icon" />
                  )}
                </div>

                {isOpen && (
                  <div className="package-dropdown">
                    <h5>CHOOSE A DIFFERENT PACKAGE OR TEST</h5>

                    <div className="search-package">
                      <input placeholder="Search packages or tests..." />
                      <Search size={16} />
                    </div>

                    <div className="package-options-list">
                      {pkg.alternatives.map((alt, index) => (
                        <div className="package-option" key={index}>
                          <div>
                            <h4>{alt.title}</h4>
                            <p>{alt.subtitle}</p>
                            <span>{alt.tests}</span>
                            <small>{alt.tag}</small>
                          </div>

                          <strong>{alt.price}</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <h1 className="price">{pkg.price}</h1>

              <button className="book-package-btn">
                Book package
                <ArrowRight size={20} />
              </button>

              <button
                className="remove-btn"
                onClick={() => handleRemove(pkg.id)}
              >
                Remove
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
