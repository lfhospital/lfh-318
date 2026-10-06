import React, { createContext, useContext, useState } from "react";

const CompareContext = createContext(null);

const MAX_COMPARE = 3;

export function CompareProvider({ children }) {
  const [compareMode, setCompareMode] = useState(false);
  const [selectedPackages, setSelectedPackages] = useState([]);

  // Turning compare mode off also clears any current selection
  const toggleCompareMode = () => {
    setCompareMode((prev) => {
      const next = !prev;
      if (!next) {
        setSelectedPackages([]);
      }
      return next;
    });
  };

  // Adds/removes a package id, capped at MAX_COMPARE
  const togglePackageSelection = (id) => {
    setSelectedPackages((prev) => {
      if (prev.includes(id)) {
        return prev.filter((pkgId) => pkgId !== id);
      }
      if (prev.length >= MAX_COMPARE) {
        return prev; // already at limit, ignore
      }
      return [...prev, id];
    });
  };

  const isPackageSelected = (id) => selectedPackages.includes(id);

  const value = {
    compareMode,
    toggleCompareMode,
    selectedPackages,
    togglePackageSelection,
    isPackageSelected,
    maxCompare: MAX_COMPARE,
  };

  return (
    <CompareContext.Provider value={value}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return context;
}