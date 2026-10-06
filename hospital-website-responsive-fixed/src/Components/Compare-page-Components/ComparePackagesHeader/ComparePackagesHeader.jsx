import { ArrowLeft, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import "./ComparePackagesHeader.css";
import {
  getRemovedIds,
  subscribeToComparison,
} from "../comparisonStore";

const TOTAL_PACKAGES = 3;

export default function ComparePackagesHeader() {
  const [removedIds, setRemovedIds] = useState(getRemovedIds());

  useEffect(() => {
    return subscribeToComparison(setRemovedIds);
  }, []);

  const packageCount = Math.max(TOTAL_PACKAGES - removedIds.length, 0);

  return (
    <section className="compare-header-section">
      <div className="compare-header-top">
        <div className="compare-left">
          <button className="back-btn">
            <ArrowLeft size={30} strokeWidth={1.5} />
          </button>

          <div>
            <h1>Compare before you choose</h1>
            <p>
              Compare tests, pricing, and key details to make a
              confident choice.
            </p>
          </div>
        </div>

        <div className="compare-header-actions">
          <span className="compare-count">
            Comparing {packageCount} package{packageCount !== 1 ? "s" : ""}
          </span>

          {packageCount < TOTAL_PACKAGES && (
            <button className="add-package-btn">
              <Plus size={12} strokeWidth={2} />
              Add Package
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
