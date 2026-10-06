import { ArrowLeft } from "lucide-react";
import "./ComparePackagesHeader.css";

export default function ComparePackagesHeader() {
  return (
    <section className="compare-header-section">
      <div className="compare-header-top">
        <div className="compare-left">
          <button className="back-btn">
            <ArrowLeft size={40} strokeWidth={1.5} />
          </button>

          <div>
            <h1>Compare before you choose</h1>
            <p>
              Compare tests, pricing, and key details to make a
              confident choice.
            </p>
          </div>
        </div>

        <span className="compare-count">
          Comparing 3 packages
        </span>
      </div>
    </section>
  );
}