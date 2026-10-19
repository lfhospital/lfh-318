import { useState } from "react";

// The detail page passes a shared { mode, homeAvailable, onChange } so the
// price card and the Sample collection section stay in sync. Pages without
// package data fall back to a local choice.
export default function useCollectionChoice(collection) {
  const [localMode, setLocalMode] = useState("home");
  if (collection) return collection;
  return { mode: localMode, homeAvailable: true, onChange: setLocalMode };
}
