import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Search,
} from "lucide-react";
import "./ComparePackages.css";

export default function ComparePackages() {
  const [openPackage, setOpenPackage] = useState(null);

  return (
    <section className="compare-packages-section">
      <div className="compare-grid">

        {/* Left Label */}
        <div className="compare-label">
          <h2>PACKAGES & TESTS</h2>
        </div>

        {/* Package 1 */}
        <div className="compare-column">
          <div className="package-wrapper">

            <div
              className="package-box"
              onClick={() =>
                setOpenPackage(openPackage === 1 ? null : 1)
              }
            >
              <div>
                <h3>
                  Basic Health
                  <br />
                  Checkup
                </h3>
                <p>For adults 18–40 years</p>
              </div>

              {openPackage === 1 ? (
                <ChevronUp className="dropdown-icon" />
              ) : (
                <ChevronDown className="dropdown-icon" />
              )}
            </div>

            {openPackage === 1 && (
              <div className="package-dropdown">
                <h5>CHOOSE A DIFFERENT PACKAGE OR TEST</h5>

                <div className="search-package">
                  <input placeholder="Search packages or tests..." />
                  <Search size={18} />
                </div>

                {[1, 2, 3].map((item) => (
                  <div className="package-option" key={item}>
                    <div>
                      <h4>Comprehensive Panel</h4>
                      <p>For adults 40+</p>
                      <span>32 tests</span>
                      <small>Preventive + Advanced</small>
                    </div>

                    <strong>₹ 800</strong>
                  </div>
                ))}
              </div>
            )}
          </div>

          <h1 className="price">₹1,299</h1>

          <button className="book-package-btn">
            Book package
            <ArrowRight size={24} />
          </button>

          <button className="remove-btn">
            Remove
          </button>
        </div>

        {/* Package 2 */}
        <div className="compare-column">
          <div className="package-wrapper">

            <div
              className="package-box"
              onClick={() =>
                setOpenPackage(openPackage === 2 ? null : 2)
              }
            >
              <div>
                <h3>
                  Advanced Health
                  <br />
                  Checkup
                </h3>
                <p>For adults 40+ years</p>
              </div>

              {openPackage === 2 ? (
                <ChevronUp className="dropdown-icon" />
              ) : (
                <ChevronDown className="dropdown-icon" />
              )}
            </div>

            {openPackage === 2 && (
              <div className="package-dropdown">
                <h5>CHOOSE A DIFFERENT PACKAGE OR TEST</h5>

                <div className="search-package">
                  <input placeholder="Search packages or tests..." />
                  <Search size={18} />
                </div>

                {[1, 2, 3].map((item) => (
                  <div className="package-option" key={item}>
                    <div>
                      <h4>Heart Health Package</h4>
                      <p>For adults 40+</p>
                      <span>42 tests</span>
                      <small>Cardiac + Preventive</small>
                    </div>

                    <strong>₹ 1,200</strong>
                  </div>
                ))}
              </div>
            )}
          </div>

          <h1 className="price">₹2,299</h1>

          <button className="book-package-btn">
            Book package
            <ArrowRight size={24} />
          </button>

          <button className="remove-btn">
            Remove
          </button>
        </div>

        {/* Package 3 */}
        <div className="compare-column">
          <div className="package-wrapper">

            <div
              className="package-box"
              onClick={() =>
                setOpenPackage(openPackage === 3 ? null : 3)
              }
            >
              <div>
                <h3>
                  Full Body
                  <br />
                  Advanced
                </h3>
                <p>For adults 35+ years</p>
              </div>

              {openPackage === 3 ? (
                <ChevronUp className="dropdown-icon" />
              ) : (
                <ChevronDown className="dropdown-icon" />
              )}
            </div>

            {openPackage === 3 && (
              <div className="package-dropdown">
                <h5>CHOOSE A DIFFERENT PACKAGE OR TEST</h5>

                <div className="search-package">
                  <input placeholder="Search packages or tests..." />
                  <Search size={18} />
                </div>

                {[1, 2, 3].map((item) => (
                  <div className="package-option" key={item}>
                    <div>
                      <h4>Full Body Advanced</h4>
                      <p>For adults 35+</p>
                      <span>86 tests</span>
                      <small>Complete Wellness</small>
                    </div>

                    <strong>₹ 2,000</strong>
                  </div>
                ))}
              </div>
            )}
          </div>

          <h1 className="price">₹3,299</h1>

          <button className="book-package-btn">
            Book package
            <ArrowRight size={24} />
          </button>

          <button className="remove-btn">
            Remove
          </button>
        </div>

      </div>
    </section>
  );
}