// Packages the visitor has added to their plan. Kept in localStorage so the
// plan survives refreshes and is shared by every page that shows packages.
import { useSyncExternalStore } from "react";

const STORAGE_KEY = "lfh-plan";
const listeners = new Set();

const load = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
};

let items = load();

const save = (next) => {
  items = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage unavailable (private mode): the plan still works for this visit
  }
  listeners.forEach((listener) => listener());
};

const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

// pkg: { id, title, price } where price is a number in rupees
export const addToPlan = (pkg) => {
  if (!items.some((item) => item.id === pkg.id)) save([...items, pkg]);
};

export const removeFromPlan = (id) => save(items.filter((item) => item.id !== id));

export const togglePlanItem = (pkg) =>
  items.some((item) => item.id === pkg.id) ? removeFromPlan(pkg.id) : addToPlan(pkg);

export const clearPlan = () => save([]);

export function usePlan() {
  const plan = useSyncExternalStore(subscribe, () => items);
  return {
    items: plan,
    total: plan.reduce((sum, item) => sum + (Number(item.price) || 0), 0),
    isInPlan: (id) => plan.some((item) => item.id === id),
  };
}

export const formatRupees = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;
