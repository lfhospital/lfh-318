import "./PackageStickyBar.css";
import { ArrowRight } from "lucide-react";

export default function PackageStickyBar() {
  return (
    <div className="package-sticky-bar">
      <div className="package-content">
        <div className="package-left">
          <div className="package-info">
            <h3>Full Body Advanced</h3>
            <p>86 tests · Free home collection · 12-hr report</p>
          </div>

          <div className="bardivider"></div>

          <div className="package-price">₹1,299</div>
        </div>

        <button className="view-plan-btn">
          View plan
          <span>→</span>
        </button>
      </div>
    </div>
  );
}