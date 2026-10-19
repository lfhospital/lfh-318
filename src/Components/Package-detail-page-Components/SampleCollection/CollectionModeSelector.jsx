import React from "react";
import { Home, Building2 } from "lucide-react";
import useCollectionChoice from "./useCollectionChoice";

// Compact Home Collection / Visit Hospital toggle on the price card
export default function CollectionModeSelector({ collection }) {
  const { mode, homeAvailable, onChange } = useCollectionChoice(collection);

  return (
    <div className="mode-selector" role="radiogroup" aria-label="Sample collection">
      <button
        type="button"
        role="radio"
        aria-checked={mode === "home"}
        className={mode === "home" ? "active-mode" : ""}
        disabled={!homeAvailable}
        title={homeAvailable ? undefined : "Home collection isn't available for this package"}
        onClick={() => onChange("home")}
      >
        <Home size={18} /> Home Collection
      </button>

      <button
        type="button"
        role="radio"
        aria-checked={mode === "hospital"}
        className={mode === "hospital" ? "active-mode" : ""}
        onClick={() => onChange("hospital")}
      >
        <Building2 size={18} /> Visit Hospital
      </button>
    </div>
  );
}
